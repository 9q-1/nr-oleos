import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "nr_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 dias

export interface SessionPayload {
  sub: string; // usuario.id
  nome: string;
  email: string;
  papel: "ADMINISTRADOR" | "FUNCIONARIO";
}

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET não configurado. Defina em .env");
  }
  return secret;
}

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, getSecret(), { expiresIn: SESSION_DURATION_SECONDS });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, getSecret()) as SessionPayload;
  } catch {
    return null;
  }
}

/** Define o cookie de sessão httpOnly após login bem-sucedido. */
export async function createSessionCookie(payload: SessionPayload) {
  const token = signSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function destroySessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Lê e valida a sessão atual a partir do cookie (uso em Server Components/Actions). */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Busca o usuário completo (dados atualizados) a partir da sessão. */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const usuario = await prisma.usuario.findUnique({ where: { id: session.sub } });
  if (!usuario || !usuario.ativo) return null;
  return usuario;
}

/** Garante que a sessão atual pertence a um Administrador; redireciona caso contrário. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.papel !== "ADMINISTRADOR") {
    redirect("/dashboard");
  }
  return session;
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
