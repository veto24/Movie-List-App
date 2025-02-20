import { handlers, signIn, signOut, auth } from "@/auth"; // Referring to the auth.ts we just created
export const { GET, POST } = handlers;
export { signIn, signOut, auth };
