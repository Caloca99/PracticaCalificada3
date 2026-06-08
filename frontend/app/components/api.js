"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function api(path, options = {}) {
  const { body, headers, method, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    method: method || (body ? "POST" : "GET"),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest
  });

  let data = null;
  if (response.status !== 204) {
    try {
      data = await response.json();
    } catch (_error) {
      data = null;
    }
  }

  if (!response.ok) {
    const message =
      (Array.isArray(data?.details) && data.details.join(", ")) ||
      data?.message ||
      `Error ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.details = data?.details;
    throw error;
  }

  return data;
}

export const apiBase = API_URL;
