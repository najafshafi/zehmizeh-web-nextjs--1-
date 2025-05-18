import NextAuth from "next-auth";
import { authOptions } from "../../auth/options";

// Export the API handler directly without exposing authOptions
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
