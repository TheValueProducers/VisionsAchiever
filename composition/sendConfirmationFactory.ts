import connectDB from "@/infrastructure/db/mongoose";
import { MongooseUserRepository } from "@/infrastructure/repos/MongooseUserRepository";
import { ResendEmailSender } from "@/infrastructure/email/ResendEmailSender";
import { SendConfirmation } from "@/core/usecases/SendConfirmation";

export async function createSendConfirmationUseCase() {
  await connectDB();
  const repo = new MongooseUserRepository();
  const emailSender = new ResendEmailSender();
  return new SendConfirmation(repo, emailSender);
}
