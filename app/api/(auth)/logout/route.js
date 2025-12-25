"use server";
import Session from "@/models/session.model";
import { cookies } from "next/headers";

export const POST = async () => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("sessionId")?.value;
    
    if (!sessionCookie) {
      return Response.json(
        { message: "No active session found", status: false },
        { status: 400 }
      );
    }
    
    const sessionId = sessionCookie.split(".")[0];
    await Session.findByIdAndDelete(sessionId);
    cookieStore.delete("sessionId");
    
    return Response.json(
      { message: "Logout successful", status: true },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Error during logout", status: false, error: error.message },
      { status: 500 }
    );
  }
};
