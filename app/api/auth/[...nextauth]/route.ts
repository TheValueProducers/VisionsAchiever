// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth"; // Adjust the import path if auth.ts is elsewhere
console.log("NEXTAUTH ROUTE LOADED")
export const { GET, POST } = handlers;