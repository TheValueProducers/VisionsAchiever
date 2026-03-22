import connectDB from "../infrastructure/db/mongoose";
import { MongooseUserRepository } from "../infrastructure/repos/MongooseUserRepository";
import { ResendEmailSender } from "../infrastructure/email/ResendEmailSender";
import { BcryptPasswordHasher } from "../infrastructure/auth/BcryptPasswordHasher";
import { RegisterUser } from "../core/usecases/RegisterUser";
import { LoginUser } from "../core/usecases/LoginUser";
import { VerifyGoogleUser } from "../core/usecases/VerifyGoogleUser";
import { ChangeTheme } from "../core/usecases/ChangeTheme";
import { GetTheme } from "../core/usecases/GetTheme";
import { ChangeLanguage } from "../core/usecases/ChangeLanguage";
import { GetLanguage } from "../core/usecases/GetLanguage";
import { ChangePassword } from "../core/usecases/ChangePassword";

export async function createRegisterUserUseCase() {
  await connectDB();
  const repo = new MongooseUserRepository();
  const emailSender = new ResendEmailSender();
  const passwordHasher = new BcryptPasswordHasher();
  const usecase = new RegisterUser(repo, emailSender, passwordHasher);
  return usecase;
}

export async function createLoginUserUseCase() {
  await connectDB();
  const repo = new MongooseUserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  const usecase = new LoginUser(repo, passwordHasher);
  return usecase;
}

export async function createVerifyGoogleUserUseCase() {
  await connectDB();
  const repo = new MongooseUserRepository();
  const usecase = new VerifyGoogleUser(repo);
  return usecase;
}

export async function createChangeThemeUseCase() {
  await connectDB();
  const repo = new MongooseUserRepository();
  return new ChangeTheme(repo);
}

export async function createGetThemeUseCase() {
  await connectDB();
  const repo = new MongooseUserRepository();
  return new GetTheme(repo);
}

export async function createChangeLanguageUseCase() {
  await connectDB();
  const repo = new MongooseUserRepository();
  return new ChangeLanguage(repo);
}

export async function createGetLanguageUseCase() {
  await connectDB();
  const repo = new MongooseUserRepository();
  return new GetLanguage(repo);
}

export async function createChangePasswordUseCase() {
  await connectDB();
  const repo = new MongooseUserRepository();
  const passwordHasher = new BcryptPasswordHasher();
  return new ChangePassword(repo, passwordHasher);
}
