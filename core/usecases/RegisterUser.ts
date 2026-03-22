import { User } from "../entities/User";
import { UserRepository, CreateUserDTO } from "../ports/UserRepository";
import { EmailSender } from "../ports/EmailSender";
import { PasswordHasher } from "../ports/PasswordHasher";

export class RegisterUser {
  constructor(
    private userRepo: UserRepository,
    private emailSender: EmailSender,
    private passwordHasher: PasswordHasher
  ) {}

  async execute(data: CreateUserDTO) {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new Error("User already exists");

    const hashed = await this.passwordHasher.hash(data.password);

    const token = typeof crypto !== 'undefined' && (crypto as any).randomUUID
      ? (crypto as any).randomUUID()
      : Date.now().toString();

    const user = await this.userRepo.create({
      email: data.email,
      password: hashed,
      notification: data.notification,
      token,
      isVerified: false,
      theme: "dark",
      language: "english",
    });

    const verifyLink = `https://www.visionachiever.org/register/verify?token=${token}`;

    await this.emailSender.sendVerification(verifyLink, data.email);

    return new User({
      _id: user._id,
      email: user.email,
      hashedPassword: hashed,
      notification: user.notification,
      token: user.token,
      isVerified: user.isVerified,
      theme: user.theme,
      language: user.language,
    });
  }
}
