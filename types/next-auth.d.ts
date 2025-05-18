import { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    first_name?: string;
    last_name?: string;
    user_type?: string;
    originalUser?: any; // Original user object from your API
    apiToken?: string; // API token for authentication
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      first_name?: string;
      last_name?: string;
      user_type?: string;
      provider?: string;
    } & DefaultSession["user"];
    apiToken?: string; // Add apiToken to Session
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId: string;
    first_name?: string;
    last_name?: string;
    user_type?: string;
    provider?: string;
    apiToken?: string; // Add apiToken to JWT
  }
}
