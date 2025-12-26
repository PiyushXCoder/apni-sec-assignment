import { cookies } from "next/headers";
import NavbarClient from "./navbar-client";

export default async function Navbar() {
  const cookieStore = await cookies();
  const hasAccessToken = !!cookieStore.get("accessToken");

  return <NavbarClient hasAccessToken={hasAccessToken} />;
}
