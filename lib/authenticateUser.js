import Session from "@/models/session.model";
import User from "@/models/user.model";
import { createHmac } from "crypto";
import { cookies } from "next/headers";

export const checkAuthentication = async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("sessionId");
  const errorResponse = Response.json(
    { message: "Please Login again", status: false },
    {
      status: 401,
    }
  );
  if (!cookie) return errorResponse;
  
  const sessionId = verifyCookie(cookie?.value);
  if (!sessionId) return errorResponse;
  
  const session = await Session.findById(sessionId);
  if (!session) return errorResponse;
  
  
  const user = await User.findById(session.userId).select("-password");
  if (!user) return errorResponse;

  return user;
};

export const signCookie = (cookie) => {
  const signature = createHmac("sha256", process.env.COOKIE_SECRET)
    .update(cookie)
    .digest("hex");

  const signedSessionId = `${cookie}.${signature}`;
  return signedSessionId;
};

export const verifyCookie = (signedCookie) => {
  const [sessionId, signatureFromCookie] = signedCookie.split(".");
  const signature = signCookie(sessionId).split(".")[1];
  if (signature === signatureFromCookie) return sessionId;
  return false;
};
