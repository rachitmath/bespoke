const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface UserProfile {
  id: string;
  email: string;
  plan: 'FREE' | 'PRO';
  createdAt: string;
}

export interface MonthlyUsage {
  usedThisMonth: number;
  monthlyLimit: number | null;
  remainingThisMonth: number | null;
}

export interface GenerationRecord {
  id: string;
  userId: string;
  jobDescription: string;
  originalResume: string;
  tailoredResume: string;
  outreachMessage: string;
  createdAt: string;
}

export interface MeResponse {
  user: UserProfile;
  usage: MonthlyUsage;
  generations: GenerationRecord[];
}

export interface GenerateRequestPayload {
  jobDescription: string;
  resume: string;
}

export interface GenerateResponsePayload {
  tailoredResume: string;
  outreachMessage: string;
}

export interface AuthResponse {
  success: boolean;
  user: UserProfile;
  token?: string;
  message?: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const endpoint = `${API_BASE_URL.replace(/\/$/, '')}${path}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  let res: Response;
  try {
    res = await fetch(endpoint, {
      ...options,
      headers,
      credentials: 'include', // Automatically sends and receives httpOnly auth cookies
    });
  } catch (err: any) {
    throw new Error(
      `Unable to reach the Bespoke server at ${API_BASE_URL}. Please verify the server is running.`
    );
  }

  let data: any;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const message =
      typeof data === 'object' && data !== null
        ? Array.isArray(data.message)
          ? data.message.join('. ')
          : data.message || data.error || `HTTP ${res.status}: ${res.statusText}`
        : `HTTP ${res.status}: ${res.statusText}`;

    const error = new Error(message);
    (error as any).status = res.status;
    (error as any).data = data;
    throw error;
  }

  return data as T;
}

export const authApi = {
  signup: (email: string, password: string): Promise<AuthResponse> =>
    request<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string): Promise<AuthResponse> =>
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: (): Promise<{ success: boolean; message: string }> =>
    request<{ success: boolean; message: string }>('/api/auth/logout', {
      method: 'POST',
    }),
};

export const usersApi = {
  getMe: (): Promise<MeResponse> =>
    request<MeResponse>('/api/me', {
      method: 'GET',
    }),
};

export const generateApi = {
  generate: (
    payload: GenerateRequestPayload
  ): Promise<GenerateResponsePayload> =>
    request<GenerateResponsePayload>('/api/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
