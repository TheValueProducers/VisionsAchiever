import { UserRepository } from "../ports/UserRepository";
import { PasswordHasher } from "../ports/PasswordHasher";

export type ChangePasswordResult =
  | { success: true }
  | { success: false; error: string };

export class ChangePassword {
  constructor(
    private userRepo: UserRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<ChangePasswordResult> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const isValid = await this.passwordHasher.compare(
      currentPassword,
      user.getPasswordHash()
    );

    if (!isValid) {
      return { success: false, error: "Incorrect current password" };
    }

    const newHashedPassword = await this.passwordHasher.hash(newPassword);
    user.changePassword(newHashedPassword);
    await this.userRepo.updatePassword(userId, newHashedPassword);

    return { success: true };
  }
}
