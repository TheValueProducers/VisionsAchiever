// composition/verifyEmailFactory.ts
import { VerifyEmail } from "@/core/usecases/VerifyEmail"
import { MongooseUserRepository } from "@/infrastructure/repos/MongooseUserRepository"

export function makeVerifyEmail() {
  return new VerifyEmail(new MongooseUserRepository())
}