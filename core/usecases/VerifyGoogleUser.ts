import { User } from "../entities/User";
import { UserRepository } from "../ports/UserRepository";

export interface GoogleSignInData {
  email: string;
  providerAccountId: string;
  name?: string;
  image?: string;
}

export type GoogleSignInResult = 
  | { success: true; user: User }
  | { success: false; error: string };

export class VerifyGoogleUser {
  constructor(private userRepo: UserRepository) {}

  async execute(data: GoogleSignInData): Promise<GoogleSignInResult> {
    const normalizedEmail = data.email.trim().toLowerCase();

    let user = await this.userRepo.findByGoogleId(data.providerAccountId);

    if (!user) {
      user = await this.userRepo.findByEmail(normalizedEmail);

      if (!user) {
        return {
          success: false,
          error: "User does not exist. Please register first.",
        };
      }

      if (!user.isVerified) {
        return {
          success: false,
          error: "User is not verified. Please check your email.",
        };
      }

      if (!user._id) {
        return {
          success: false,
          error: "User is missing an identifier.",
        };
      }

      user = await this.userRepo.linkGoogleAccount(
        user._id,
        data.providerAccountId,
        data.name
      );
    }

    return {
      success: true,
      user,
    };
  }
}
