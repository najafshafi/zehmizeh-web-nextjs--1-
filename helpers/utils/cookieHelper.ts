export const setCookie = (key: string, value: string): void => {
  document.cookie = key + "=" + value + ";";
};

export const getCookie = (key: string): string | null => {
  // Split the cookies string into individual cookies
  const cookies = document.cookie.split(";");

  // Loop through each cookie to find the one with the specified key
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();

    // Check if this cookie starts with the key
    if (cookie.startsWith(key + "=")) {
      // Return the cookie value (substring after the key)
      return cookie.substring(key.length + 1);
    }
  }

  // If cookie with the key is not found, return null
  return null;
};
