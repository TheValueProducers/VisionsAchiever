"use server"
import { NextRequest, NextResponse } from 'next/server';


import {cookies} from "next/headers";
import {redirect} from "next/navigation"
import { signIn, auth } from "@/lib/auth"





 
export async function checkLogIn() {
  const session = await auth();
  return !!session;
}




export default async function handleLogin(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
   
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, 
    })
 
    

    if (!result) {
      return { success: false, message: "Invalid email or password" }
    }

    return { success: true }
  } catch (error) {
    return { success: false, message: "Login failed" }
  }
}


