import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"


export const { handlers: { GET, POST }, auth, signIn, signOut } =  NextAuth(
  {
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const myHeaders = new Headers();
          myHeaders.append("Authorization", `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`);
          myHeaders.append("Content-Type", "application/json");
          const response = await fetch('https://amogademo-postgrest.morr.biz/user_catalog', {
            method: 'GET',
            headers: myHeaders
          });

          if (!response.ok) { 
            throw new Error('Failed to fetch user data');
          }
          
          const users = await response.json(); 
          const user = users.find((u) => 
            u.user_email == credentials.email && u.password == credentials.password
          );
         

          if (user) {
            // Return user object if credentials are valid
            return { id: user.user_catalog_id, email: user.user_email, name: user.user_name,mobile:user.user_mobile,business_number:user.business_number, picture:user.user_picture,business_name: user.business_name };
          } else {
            // Return null if user data is invalid
            return null;
          }
        } catch (error) {
          
          return null;
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        
        token.user=user
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        
        session.user.id = token.user?.id;
        session.user.email = token?.email;
        session.user.name = token?.name;
        session.user.mobile = token?.user?.mobile;
        session.user.business_number = token?.user?.business_number;
        session.user.business_name = token?.user?.business_name;
        
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET

})