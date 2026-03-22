import { UserRepository } from "../ports/UserRepository";

export type ChangeThemeResult =
  | { success: true; theme: string }
  | { success: false; error: string };

export class ChangeTheme {
  constructor(private userRepo: UserRepository) {}

  async execute(userId: string): Promise<ChangeThemeResult> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    user.changeTheme();
    await this.userRepo.updateTheme(userId, user.theme);

    return { success: true, theme: user.theme };
  }
}
