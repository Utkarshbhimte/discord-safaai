import { RequestInit } from "next/dist/server/web/spec-extension/request";

export const fetchWithToken = async (url: string, options?: RequestInit) => {

  // get token from local storage
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No token found');
  }

  const headers = {
    ...options?.headers,
    authorization: token
  };
  return fetch(url, { ...options, headers });
}