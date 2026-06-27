import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/signup"); // Change this to your working route like /signup or /auth/login
}