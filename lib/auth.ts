import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { redirect } from "next/navigation"
import { createLoginUserUseCase } from "@/composition/registerUserFactory"
import { createVerifyGoogleUserUseCase } from "@/composition/registerUserFactory"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  debug: true,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) return null

        const usecase = await createLoginUserUseCase()
        const result = await usecase.execute({ email, password })

        if (!result.success) throw new Error(result.error)

        return {
          _id: String(result.user._id),
          email: result.user.email,
        }
      },
    }),
  ],

  session: { strategy: "jwt" },
  
  pages: {
    error: "/login", // ✅ correct place
  },
  

  callbacks: {
    async jwt({ token, account, user, profile }) {
      // First-time Google sign in
      if (account?.provider === "google" && user?.email) {
        const usecase = await createVerifyGoogleUserUseCase()

        const result = await usecase.execute({
          email: user.email,
          name: user.name ?? "",
          image: user.image ?? "",
          providerAccountId: account.providerAccountId,
        })

        if (!result.success) {
          throw new Error(result.error)
        }

        token.uid = String(result.user._id)
        token.email = result.user.email
        token.provider = "google"
        token.providerAccountId = account.providerAccountId
      }

      // Credentials sign in
      if (user && account?.provider === "credentials") {
        token.uid = (user as any)._id
        token.email = user.email
        token.provider = "credentials"
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string
        ;(session.user as any).id = token.uid as string | undefined
        ;(session.user as any).provider = token.provider as string | undefined
        ;(session.user as any).providerAccountId =
          token.providerAccountId as string | undefined
      }

      return session
    },
  },
})