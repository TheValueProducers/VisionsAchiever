  "use server"
  import { signIn } from "@/lib/auth";
  import { redirect } from "next/navigation"
  
  export const handleGoogleLogin = async () => {
    await signIn("google", { redirectTo: "/" })
    redirect("/dashboard")
    }