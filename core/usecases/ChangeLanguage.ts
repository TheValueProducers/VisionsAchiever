import { UserLanguage, User } from "../entities/User";
import { UserRepository } from "../ports/UserRepository";

export type ChangeLanguageResult =
  | { success: true; language: UserLanguage; user: User }
  | { success: false; error: string };

export class ChangeLanguage {
  constructor(private userRepo: UserRepository) {}

  async execute(userId: string, language: UserLanguage): Promise<ChangeLanguageResult> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    user.changeLanguage(language);
    await this.userRepo.updateLanguage(userId, language);

    return { success: true, language: user.language, user };
  }
}