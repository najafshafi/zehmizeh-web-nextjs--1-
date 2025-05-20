import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import axios, { AxiosError } from "axios";

// Create a server-side only Axios instance for auth requests
const serverApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
});

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          first_name: profile.given_name,
          last_name: profile.family_name,
        };
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        email_id: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email && !credentials?.email_id) {
          throw new Error("Email is required");
        }
        if (!credentials?.password) {
          throw new Error("Password is required");
        }

        try {
          // Use the email_id if provided, otherwise fall back to email
          const email = credentials.email_id || credentials.email;

          // Use the server-side axios instance to avoid client-side interceptors
          const response = await serverApiClient.post("/auth/login", {
            email_id: email,
            password: credentials.password,
            stay_signedin: true,
            terms_agreement: true,
          });

          // Check if login was successful
          if (response.data.status) {
            const { user, token } = response.data.data;

            // Return a user object compatible with NextAuth
            return {
              id: user.user_id || user.id,
              email: user.email_id,
              name: `${user.first_name} ${user.last_name}`,
              image: user.profile_photo || null,
              first_name: user.first_name,
              last_name: user.last_name,
              user_type: user.user_type,
              apiToken: token, // Pass the API token to be stored in JWT
            };
          }

          console.error("API returned failure status:", response.data);
          throw new Error(response.data.message || "Authentication failed");
        } catch (error) {
          console.error("Authentication error:", error);
          // Add more detailed error information
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            console.error("API response error data:", axiosError.response.data);
            console.error("API response status:", axiosError.response.status);
          }

          const errorMessage =
            axiosError.response?.data &&
            typeof axiosError.response.data === "object" &&
            "message" in axiosError.response.data
              ? (axiosError.response.data as { message?: string }).message
              : axiosError.message;

          throw new Error(errorMessage || "Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login", // Error code passed in query string as ?error=
    newUser: "/register/freelancer", // New users will be directed here on first sign in
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;

        // Store custom fields
        if ("user_type" in user) {
          token.user_type = user.user_type as string;
        }
        if ("first_name" in user) {
          token.first_name = user.first_name as string;
        }
        if ("last_name" in user) {
          token.last_name = user.last_name as string;
        }

        // Store the API token in the JWT
        if ("apiToken" in user) {
          token.apiToken = user.apiToken;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Make sure user object exists
        if (!session.user) {
          session.user = {
            id: token.userId,
            name: token.name,
            email: token.email,
          };
        } else {
          // Ensure id is set
          session.user.id = token.userId;
        }

        // Add custom fields
        if (token.user_type) {
          session.user.user_type = token.user_type;
        }
        if (token.first_name) {
          session.user.first_name = token.first_name;
        }
        if (token.last_name) {
          session.user.last_name = token.last_name;
        }
      }

      return session;
    },
  },
  // We explicitly omit any signOut events since we handle those on the client
  debug: process.env.NODE_ENV === "development",
};
