import { UserRepository } from "../ports/UserRepository"
import { EmailSender } from "../ports/EmailSender"

export class VerifyEmail {
  constructor(private readonly users: UserRepository) {}

  async execute(token: string) {
    if (!token) throw new Error("Invalid or missing token")

    const user = await this.users.findByToken(token)

    if (!user) {
      throw new Error("Invalid or expired token")
    }

    user.verifyEmail()

    console.log(user)

    await this.users.save(user)

    return { success: true }
  }
}