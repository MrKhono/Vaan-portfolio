// lib/session.ts
import { auth } from "./auth";
import { headers } from "next/headers";

export async function getServerSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Non autorisé");
  return session;
}