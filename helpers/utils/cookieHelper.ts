export function getCookie(name: string) {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

export function setCookie(name: string, value: string, days: number = 30) {
  if (typeof document === "undefined") return;

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

export function syncAuthWithCookies() {
  if (typeof window === "undefined") return;

  // Check if token exists in localStorage but not in cookie
  const localStorageToken = localStorage.getItem("token");
  const cookieToken = getCookie("token");

  if (localStorageToken && !cookieToken) {
    // Add localStorage token to cookie
    setCookie("token", localStorageToken);
  } else if (cookieToken && !localStorageToken) {
    // Add cookie token to localStorage
    localStorage.setItem("token", cookieToken);
  }

  // Check if user exists in localStorage
  const localStorageUser = localStorage.getItem("user");

  // If we have a token but no user in localStorage, fetch user data
  if ((localStorageToken || cookieToken) && !localStorageUser) {
    // We'll need to fetch user data - this would be handled in the auth context
  }
}
