import { UserRepository } from "../ports/UserRepository";

export type GetThemeResult =
  | { success: true; theme: string }
  | { success: false; error: string };

export class GetTheme {
  constructor(private userRepo: UserRepository) {}

  async execute(userId: string): Promise<GetThemeResult> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, theme: user.theme };
  }
}
