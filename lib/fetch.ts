import { cache } from "react";
import { apiClient } from "@/helpers/http/index";

export const revalidationTags = {
  user: "user",
  profile: "profile",
  jobs: "jobs",
  proposals: "proposals",
  chats: "chats",
};

type FetchOptions = {
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  headers?: HeadersInit;
};

// Cached fetch for client components (React cache)
export const fetchData = cache(
  async <T>(url: string, options: FetchOptions = {}): Promise<T> => {
    try {
      const response = await fetch(url, {
        cache: options.cache || "force-cache",
        next: options.next,
        headers: options.headers,
      });

      if (!response.ok) {
        throw new Error(`Error fetching ${url}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      throw error;
    }
  }
);

// API client with caching for server components
export const fetchApi = cache(
  async <T>(
    endpoint: string,
    options: { revalidate?: number | false; tags?: string[] } = {}
  ) => {
    try {
      const response = await apiClient.get(endpoint);
      return response.data as T;
    } catch (error) {
      console.error(`Error fetching API ${endpoint}:`, error);
      throw error;
    }
  }
);

// Server action for mutating data and revalidating tags
export async function mutateData<T>(
  endpoint: string,
  method: "POST" | "PUT" | "DELETE",
  data?: any,
  tags?: string[]
): Promise<T> {
  try {
    let response;

    switch (method) {
      case "POST":
        response = await apiClient.post(endpoint, data);
        break;
      case "PUT":
        response = await apiClient.put(endpoint, data);
        break;
      case "DELETE":
        response = await apiClient.delete(endpoint);
        break;
    }

    // Revalidate tags if provided
    if (tags && tags.length > 0) {
      try {
        await Promise.all(
          tags.map((tag) =>
            fetch(`/api/revalidate?tag=${tag}`, { method: "POST" })
          )
        );
      } catch (e) {
        console.error("Error revalidating tags:", e);
      }
    }

    return response?.data as T;
  } catch (error) {
    console.error(`Error with ${method} request to ${endpoint}:`, error);
    throw error;
  }
}
