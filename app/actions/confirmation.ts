"use server";

import { cookies } from "next/headers";
import { createSendConfirmationUseCase } from "@/composition/sendConfirmationFactory";

export async function sendVerification() {
  try {
    const email = (await cookies()).get("verify_email")?.value;

    if (!email) {
      return {
        success: false,
        message: "Missing verification email cookie",
      };
    }

    const useCase = await createSendConfirmationUseCase();
    await useCase.execute(email);

    return {
      success: true,
      message: "Verification email sent",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send verification email",
    };
  }
}
