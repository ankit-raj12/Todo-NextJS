import connectDB from "@/lib/connectDB";
import User from "@/models/user.model";
import { cookies } from "next/headers";
import { signCookie } from "@/lib/authenticateUser";
import Session from "@/models/session.model";
import { compare } from "bcrypt";

export const POST = async (request) => {
  await connectDB();
  const { email, password } = await request.json();
  const existingUser = await User.findOne({ email });
  if (!existingUser)
    return Response.json(
      { message: "User doesn't exist❌", status: false },
      {
        status: 404,
      }
    );
  const passMatch = await compare(password, existingUser.password);

  if (!passMatch)
    return Response.json(
      { message: "Invalid credentials❌", status: false },
      {
        status: 404,
      }
    );
  const cookieStore = await cookies();

  const existingSession = await Session.find({ userId: existingUser.id });
  if (existingSession) await Session.findByIdAndDelete(existingSession[0]?.id);

  const session = await Session.create({ userId: existingUser._id });

  cookieStore.set("sessionId", signCookie(session.id), {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60,
  });

  return Response.json(
    {
      status: true,
      user: {
        name: existingUser.name,
        email: existingUser.email,
      },
    },
    {
      status: 200,
    }
  );
};
