"use server";
import Session from "@/models/session.model";
import { cookies } from "next/headers";

export const POST = async () => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sessionId")?.value.split(".")[0];
  await Session.findByIdAndDelete(sessionId);
  cookieStore.delete("sessionId");
  return new Response(null, { status: 204 });
};
