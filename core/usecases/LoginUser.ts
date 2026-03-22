import { User } from "../entities/User";
import { UserRepository } from "../ports/UserRepository";
import { PasswordHasher } from "../ports/PasswordHasher";

export interface LoginCredentials {
  email: string;
  password: string;
}

export type LoginResult = 
  | { success: true; user: User }
  | { success: false; error: string };

export class LoginUser {
  constructor(
    private userRepo: UserRepository,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(credentials: LoginCredentials): Promise<LoginResult> {
    const user = await this.userRepo.findByEmail(credentials.email);
    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    if (!user.isVerified) {
      return { success: false, error: "User is not verified. Please check your email." };
    }

    const isPasswordValid = await this.passwordHasher.compare(
      credentials.password,
      user.getPasswordHash()
    );
    console.log(`Is Password Valid ${isPasswordValid}`)

    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password" };
    }

    return {
      success: true,
      user: new User({
        _id: user._id,
        email: user.email,
        hashedPassword: user.getPasswordHash(),
        notification: user.notification,
        token: user.token,
        isVerified: user.isVerified,
        theme: user.theme,
        language: user.language,
      }),
    };
  }
}
