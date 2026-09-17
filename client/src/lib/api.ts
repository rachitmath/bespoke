export interface GenerateRequestPayload {
  jobDescription: string;
  resume: string;
}

export interface GenerateResponsePayload {
  tailoredResume: string;
  outreachMessage: string;
}

export interface ApiErrorResponse {
  success?: boolean;
  statusCode?: number;
  error?: string;
  message?: string | string[];
}

export async function generateContent(
  payload: GenerateRequestPayload
): Promise<GenerateResponsePayload> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const endpoint = `${baseUrl.replace(/\/$/, '')}/api/generate`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error: any) {
    throw new Error(
      `Unable to reach the Bespoke server at ${baseUrl}. Please ensure the backend is running and CORS is enabled.`
    );
  }

  if (!response.ok) {
    let errorData: ApiErrorResponse | null = null;
    try {
      errorData = await response.json();
    } catch {
      // Non-JSON response
    }

    if (errorData?.message) {
      if (Array.isArray(errorData.message)) {
        throw new Error(errorData.message.join('. '));
      }
      throw new Error(errorData.message);
    }

    if (response.status === 429) {
      throw new Error(
        'Daily rate limit exceeded (3 requests/day). Please try again tomorrow or contact support.'
      );
    }

    throw new Error(
      `Server returned an error (${response.status}: ${response.statusText}).`
    );
  }

  const data = await response.json();
  return data as GenerateResponsePayload;
}
