/**
 * API client helper for ARTH AI prototype.
 * Provides authorization headers and fetch wrapper.
 */

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const isAuth = typeof window !== 'undefined' && localStorage.getItem('arth_ai_authenticated') === 'true';
  const mobile = (typeof window !== 'undefined' && localStorage.getItem('arth_ai_auth_mobile')) || '9876543210';
  
  if (isAuth) {
    return {
      Authorization: `Bearer demo-token-${mobile}`,
      'Content-Type': 'application/json',
    };
  }
  return {
    'Content-Type': 'application/json',
  };
}

export async function authenticatedFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const headers = new Headers(init?.headers);
  const authHeaders = await getAuthHeaders();
  
  Object.entries(authHeaders).forEach(([k, v]) => {
    if (!headers.has(k)) {
      headers.set(k, v);
    }
  });

  return fetch(input, {
    ...init,
    headers,
  });
}
