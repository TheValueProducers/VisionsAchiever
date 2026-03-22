import { UserLanguage } from "../entities/User";
import { UserRepository } from "../ports/UserRepository";

export type GetLanguageResult =
  | { success: true; language: UserLanguage }
  | { success: false; error: string };

export class GetLanguage {
  constructor(private userRepo: UserRepository) {}

  async execute(userId: string): Promise<GetLanguageResult> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, language: user.language };
  }
}