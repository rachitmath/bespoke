import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GenerateDto, GenerateResponse } from './dto/generate.dto';

@Injectable()
export class GenerateService {
  private readonly logger = new Logger(GenerateService.name);
  private genAI: GoogleGenerativeAI | null = null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      this.logger.warn(
        'GEMINI_API_KEY is not configured or is set to placeholder. Calls to Gemini API will fail until configured.',
      );
    }
  }

  private getGenAIClient(): GoogleGenerativeAI | null {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey === 'test_or_user_key' || apiKey.startsWith('demo')) {
      return null;
    }
    if (!this.genAI) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
    return this.genAI;
  }

  async generateTailoredContent(dto: GenerateDto): Promise<GenerateResponse> {
    const genAI = this.getGenAIClient();
    const modelName =
      this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.5-flash';

    // If a valid live Gemini API key is configured, call Gemini API
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

        return {
          tailoredResume: parsed.tailoredResume,
          outreachMessage: parsed.outreachMessage,
        };
      } catch (error: any) {
        this.logger.error(`Error in generateTailoredContent: ${error.message}`, error.stack);
        
        if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
          throw error;
        }

        if (error.message?.includes('API_KEY_INVALID') || error.status === 400) {
          throw new InternalServerErrorException(
            'Invalid Gemini API key provided. Please verify your GEMINI_API_KEY in server/.env.',
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
    }

    // Demo/Development Mode (when GEMINI_API_KEY is not yet supplied)
    this.logger.warn('Running in demo mode (GEMINI_API_KEY not set to live key). Returning tailored demonstration assets.');
    
    return {
      tailoredResume: `# Alex Morgan
**Full-Stack Software Engineer** | alex.morgan@email.com | (555) 234-5678 | San Francisco, CA
[LinkedIn Profile](https://linkedin.com) • [GitHub Portfolio](https://github.com)

---

## 🎯 Executive Summary
Results-driven Full-Stack Engineer with 5+ years of hands-on experience building high-throughput microservices, scalable distributed APIs, and high-performance React / Next.js web applications. Proven track record integrating LLMs and generative AI workflows into production systems with 99.98% reliability. Expert in TypeScript, Next.js (App Router), NestJS, and cloud infrastructure.

---

## 🛠️ Technical Competencies
- **Core Languages:** TypeScript, JavaScript (ES6+), Python, SQL, HTML5/CSS3
- **Frontend Architecture:** React 18/19, Next.js (App Router), Tailwind CSS, Redux Toolkit, WebSockets, Responsive UI/UX
- **Backend & APIs:** NestJS, Node.js, Express, RESTful APIs, GraphQL, Microservices Architecture
- **Databases & Caching:** PostgreSQL, MongoDB, Redis, Query Optimization, Indexing
- **AI & Integrations:** Gemini API, LLM Pipelines, Vector Search, Automated Workflows
- **DevOps & Testing:** Docker, AWS (S3, ECS, Lambda), CI/CD (GitHub Actions), Jest, Cypress

---

## 💼 Professional Experience

### **Senior Full-Stack Engineer** | DevStream Solutions
*2022 – Present | San Francisco, CA*
- **Architected and scaled distributed backend microservices** using **NestJS** and **TypeScript**, reliably handling **2.5M+ daily API transactions** with 99.98% uptime.
- **Spearheaded Next.js App Router migration**, re-engineering dashboard frontends with **Tailwind CSS** to reduce initial load time by **42%** and achieve top-tier Core Web Vitals.
- **Integrated generative AI features** via Gemini & LLM endpoints, powering automated summary generation and lifting active team engagement by **35%**.
- **Designed high-throughput Redis caching layers** and optimized PostgreSQL relational queries, decreasing p95 database response latency by **60%**.
- Implemented robust security standards including IP throttling, OAuth2/JWT authorization, and zero-downtime CI/CD deployment pipelines on AWS.

### **Full-Stack Developer** | InnovateTech Labs
*2020 – 2022 | San Francisco, CA*
- Developed responsive customer-facing web applications using **React**, **TypeScript**, and **Express.js**.
- Tuned PostgreSQL queries and schema migrations, slashing median endpoint latency from 450ms down to 95ms.
- Partnered with product and design leads across 2-week Agile sprints to ship 15+ high-priority client features on schedule.

---

## 🎓 Education & Certifications
- **Bachelor of Science in Computer Science** — University of California, Davis (2016 – 2020)
- **AWS Certified Solutions Architect – Associate** (2023)`,
      outreachMessage: `Hi there,

I noticed your opening for the Senior Full-Stack Engineer role at Nexus Cloud Labs and wanted to reach out.

With 5+ years building scalable TypeScript microservices (NestJS/Node.js) and high-performance Next.js frontends—along with hands-on experience deploying generative AI workflows to production—I'm confident I can make an immediate impact on your team's upcoming cloud collaboration features.

I'd love to learn more about Nexus Cloud Labs' technical roadmap. Would you be open to a brief 10-minute chat sometime this week?

Best regards,
Alex Morgan`,
    };
  }
}
