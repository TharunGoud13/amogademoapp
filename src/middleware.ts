import { auth } from "./auth";

export async function middleware(){
  const session = await auth();
  console.log("session----",session)
}