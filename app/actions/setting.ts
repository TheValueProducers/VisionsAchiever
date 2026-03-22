"use server"

import { auth } from "@/lib/auth"
import {
  createChangeLanguageUseCase,
  createChangeThemeUseCase,
  createGetLanguageUseCase,
  createGetThemeUseCase,
  createChangePasswordUseCase,
} from "@/composition/registerUserFactory"
import { UserLanguage } from "@/core/entities/User"

export async function handleGetLanguage(): Promise<{ language: UserLanguage }> {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const usecase = await createGetLanguageUseCase()
  const result = await usecase.execute(session.user.id)

  if (!result.success) {
    throw new Error(result.error)
  }

  return { language: result.language }
}

export async function handleChangeLanguage(
  language: UserLanguage
): Promise<{ language: UserLanguage }> {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const usecase = await createChangeLanguageUseCase()
  const result = await usecase.execute(session.user.id, language)

  if (!result.success) {
    throw new Error(result.error)
  }

  return { language: result.language }
}

export async function handleGetTheme(): Promise<{ theme: string }> {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const usecase = await createGetThemeUseCase()
  const result = await usecase.execute(session.user.id)

  if (!result.success) {
    throw new Error(result.error)
  }

  return { theme: result.theme }
}

export async function handleChangeTheme(): Promise<{ theme: string }> {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const usecase = await createChangeThemeUseCase()
  const result = await usecase.execute(session.user.id)

  if (!result.success) {
    throw new Error(result.error)
  }

  return { theme: result.theme }
}

export async function handleChangePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: true }> {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const usecase = await createChangePasswordUseCase()
  const result = await usecase.execute(session.user.id, currentPassword, newPassword)

  if (!result.success) {
    throw new Error(result.error)
  }

  return { success: true }
}

export async function getEmail(){
    const session = await auth();
    return session?.user?.email;
}
