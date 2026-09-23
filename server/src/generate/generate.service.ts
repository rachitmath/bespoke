import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateDto, GenerateResponse } from './dto/generate.dto';

@Injectable()
export class GenerateService {
  private readonly logger = new Logger(GenerateService.name);
  private genAI: GoogleGenerativeAI | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey && apiKey !== 'your_gemini_api_key_here' && !apiKey.startsWith('test_') && !apiKey.startsWith('demo')) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      this.logger.warn(
        'GEMINI_API_KEY is not configured with a live key. Running in intelligent demonstration fallback mode until configured.',
      );
    }
  }

  private getGenAIClient(): GoogleGenerativeAI | null {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey === 'test_or_user_key' || apiKey.startsWith('test_') || apiKey.startsWith('demo')) {
      return null;
    }
    if (!this.genAI) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
    return this.genAI;
  }

  async generateTailoredContent(
    userId: string,
    dto: GenerateDto,
  ): Promise<GenerateResponse> {
    const genAI = this.getGenAIClient();
    const modelName =
      this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.5-flash';

    let tailoredResume = '';
    let outreachMessage = '';

    // If live Gemini API key is configured, invoke Gemini model
    if (genAI) {
      const systemInstruction = `You are "Bespoke", an expert executive career coach and ATS resume optimizer.
Your goal is to take a user's existing resume and a target job description, and generate two distinct outputs:
1. "tailoredResume": An optimized, highly professional, ATS-friendly markdown resume that:
   - Accentuates transferable skills, domain keywords, and achievements that directly match the target job description.
   - Refines bullet points using strong action verbs and quantified impact (XYZ formula: Accomplished [X] as measured by [Y], by doing [Z]).
   - Never fabricates fake work history, fake degrees, or false metrics; instead it highlights and reorganizes genuine experience.
   - Formatted in clean Markdown with clear headings (## Summary, ## Experience, ## Skills, ## Education, etc.).
2. "outreachMessage": A personalized, high-converting LinkedIn message for connecting with the hiring manager or recruiter:
   - Friendly, confident, concise, and authentic (around 75-150 words).
   - Mentions specific enthusiasm for the role/company and 1-2 exact reasons why the candidate is a strong match.
   - Includes a clear, low-friction call-to-action (e.g. open to a brief 10-minute chat or coffee).

IMPORTANT OUTPUT FORMAT:
Return ONLY a valid JSON object matching this schema, without any extra commentary:
{
  "tailoredResume": "string in markdown format",
  "outreachMessage": "string"
}`;

      const prompt = `TARGET JOB DESCRIPTION:
----------------------------------------
${dto.jobDescription}
----------------------------------------

CANDIDATE'S CURRENT RESUME:
----------------------------------------
${dto.resume}
----------------------------------------

Generate the tailored resume and LinkedIn outreach message in the requested JSON format.`;

      try {
        this.logger.log(`Invoking Gemini model (${modelName})...`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json',
          },
          systemInstruction,
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        if (!responseText) {
          throw new InternalServerErrorException(
            'Empty response received from Gemini API.',
          );
        }

        const cleaned = responseText
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();

        const parsed = JSON.parse(cleaned) as GenerateResponse;

        if (!parsed.tailoredResume || !parsed.outreachMessage) {
          throw new InternalServerErrorException(
            'Gemini response did not match expected structure.',
          );
        }

        tailoredResume = parsed.tailoredResume;
        outreachMessage = parsed.outreachMessage;
      } catch (error: any) {
        this.logger.error(`Error in generateTailoredContent: ${error.message}`, error.stack);

        if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
          throw error;
        }

        if (error.message?.includes('API_KEY_INVALID') || error.status === 400) {
          throw new InternalServerErrorException(
            'Invalid Gemini API key provided. Please verify your GEMINI_API_KEY.',
          );
        }

        if (error.status === 429 || error.message?.includes('RESOURCE_EXHAUSTED')) {
          throw new InternalServerErrorException(
            'Gemini API rate limit or quota exceeded. Please check your AI Studio quota or try again in a few moments.',
          );
        }

        throw new InternalServerErrorException(
          `Failed to generate tailored content: ${error.message || 'Unknown error'}`,
        );
      }
    } else {
      // Demo / Testing Fallback
      this.logger.warn(
        'GEMINI_API_KEY not configured with live key. Generating tailored demonstration output.',
      );

      tailoredResume = `# Tailored Resume for Target Role
**Senior Full-Stack Engineer** | Candidate Profile

---

## 🎯 Executive Summary
Results-driven software engineer with proven expertise aligning directly with the target job requirements. Adept at full-stack architecture, high-throughput backend APIs, and modern responsive frontends.

---

## 🛠️ Relevant Core Skills
- **Frontend & Web:** TypeScript, React, Next.js (App Router), Tailwind CSS
- **Backend & Cloud:** NestJS, Node.js, PostgreSQL, REST APIs, Microservices
- **System Quality:** Automated CI/CD, Unit/Integration Testing, Performance Profiling

---

## 💼 Highlighted Experience
- **Optimized Core Microservices**: Architected scalable backend services handling high-volume daily requests with sub-100ms response times.
- **Modernized User Interfaces**: Re-engineered core web applications with Next.js, cutting initial page load times by 40%+.
- **Engineered Automated Workflows**: Streamlined cross-team productivity through modern API integrations and robust error handling.

---

## 🎓 Education & Certifications
- **B.S. in Computer Science** — University of California`;

      outreachMessage = `Hi there,

I came across the open role on your team and wanted to reach out directly. Given my background building scalable full-stack web applications and microservices, I believe I can hit the ground running and make an immediate impact on your upcoming technical initiatives.

I would welcome the opportunity to connect for a brief 10-minute chat to learn more about your team's current priorities.

Best regards!`;
    }

    // Save generation record to PostgreSQL database
    try {
      await this.prisma.generation.create({
        data: {
          userId,
          jobDescription: dto.jobDescription,
          originalResume: dto.resume,
          tailoredResume,
          outreachMessage,
        },
      });
      this.logger.log(`Generation successfully persisted to database for user ${userId}.`);
    } catch (dbError: any) {
      this.logger.error(`Failed to save generation to database: ${dbError.message}`, dbError.stack);
      // We still return the generated content even if db save encounters an issue
    }

    return {
      tailoredResume,
      outreachMessage,
    };
  }
}
