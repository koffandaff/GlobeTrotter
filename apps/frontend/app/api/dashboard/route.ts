import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

async function proxyRequest(request: NextRequest, endpoint: string) {
  const authHeader = request.headers.get("authorization");
  const cookieHeader = request.headers.get("cookie");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authHeader) {
    headers.Authorization = authHeader;
  }

  if (cookieHeader) {
    headers.Cookie = cookieHeader;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: request.method,
    headers,
    body: request.method !== "GET" && request.method !== "HEAD" ? await request.text() : undefined,
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = `/dashboard?${searchParams.toString()}`;
  return proxyRequest(request, endpoint);
}