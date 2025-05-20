import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      user_type?: string;
      first_name?: string;
      last_name?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    user_type?: string;
    first_name?: string;
    last_name?: string;
    apiToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    user_type?: string;
    first_name?: string;
    last_name?: string;
    apiToken?: string;
  }
}
