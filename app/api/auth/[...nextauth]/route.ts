import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "用户名", type: "text" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        // 这里应该是您的实际验证逻辑
        // 这只是一个示例
        if (credentials?.username === "admin" && credentials?.password === "password") {
          return { id: "1", name: "Admin", email: "admin@example.com" }
        }
        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
})

export { handler as GET, handler as POST }

