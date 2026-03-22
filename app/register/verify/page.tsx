import { redirect } from "next/navigation"
import { makeVerifyEmail } from "@/composition/verifyEmailFactory";
import { cookies } from "next/headers";

export default async function Verify({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  
  
  const token = (await searchParams).token;

  if (!token) {
    console.log("Invalid or missing token")
    return <p>Invalid or missing token</p>
  }
  
  const usecase = makeVerifyEmail();
  (await usecase).execute(token)

  redirect("/login");
}