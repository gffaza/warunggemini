import { getFirebaseAuth } from "@/lib/firebase/client";

interface ApiError {
  code: string;
  message: string;
}

interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: ApiError;
}

async function getBearerToken(): Promise<string> {
  const user = getFirebaseAuth().currentUser;

  if (!user) {
    throw new Error("Not authenticated");
  }

  return user.getIdToken();
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const json = (await response.json()) as ApiResponse<T>;

  if (!json.ok || json.data === undefined) {
    throw new Error(json.error?.message ?? "Request failed");
  }

  return json.data;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getBearerToken();
  const response = await fetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  return parseApiResponse<T>(response);
}

export async function apiFetchFormData<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const token = await getBearerToken();
  const response = await fetch(path, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return parseApiResponse<T>(response);
}
