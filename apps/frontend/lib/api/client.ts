const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
export const API_URL = API_BASE_URL;

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const token =
    options.token ||
    (typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null);

  // PREVENT SENDING "undefined" OR "null" STRINGS
  if (token && token !== "undefined" && token !== "null") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const json = (await response.json().catch(() => ({}))) as ApiResponse<T>;

  if (!response.ok || (json.success !== undefined && !json.success)) {
    const errorMessage =
      json.error?.message || json.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return (json.data !== undefined ? json.data : json) as T;
}

// Keep fetchApi around for backwards compatibility with our Auth components
export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // PREVENT SENDING "undefined" OR "null" STRINGS
  if (token && token !== "undefined" && token !== "null") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error?.message || data?.message || "An unexpected error occurred");
  }

  return data;
}