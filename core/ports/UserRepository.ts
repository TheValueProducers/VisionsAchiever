import { User } from "../entities/User";

export interface CreateUserDTO {
  email: string;
  password: string;
  notification: boolean;
  token?: string | null;
  isVerified?: boolean;
  theme: string;
  language?: string;
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
  findByToken(token: string): Promise<User | null>;
  save(user: User): Promise<void>;
  updateTheme(userId: string, theme: string): Promise<void>;
  updateLanguage(userId: string, language: string): Promise<void>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
  findByGoogleId(googleId: string): Promise<User | null>;
  linkGoogleAccount(userId: string, googleId: string, name?: string): Promise<User>;
}
