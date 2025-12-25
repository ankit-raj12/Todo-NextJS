import { signCookie } from "@/lib/authenticateUser";
import connectDB from "@/lib/connectDB";
import Session from "@/models/session.model";
import User from "@/models/user.model";
import { cookies } from "next/headers";
import { hash } from "bcrypt";

export const POST = async (request) => {
  try {
    await connectDB();
    
    const { name, email, password } = await request.json();
    
    if (!name || !email || !password) {
      return Response.json(
        { message: "Name, email and password are required", status: false },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return Response.json(
        { message: "Password must be at least 6 characters", status: false },
        { status: 400 }
      );
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { message: "User already exists", status: false },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    if (!newUser) {
      return Response.json(
        { message: "Error creating user", status: false },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();
    const priorSessionCookie = cookieStore.get("sessionId")?.value;
    if (priorSessionCookie) {
      const priorSessionId = priorSessionCookie.split(".")[0];
      await Session.findByIdAndDelete(priorSessionId);
    }

    const session = await Session.create({ userId: newUser._id });
    cookieStore.set("sessionId", signCookie(session.id), {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
    });

    return Response.json(
      { 
        newUser: { 
          name: newUser.name, 
          email: newUser.email
        },
        message: "Registration successful",
        status: true
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: "Internal server error. Please try again later.", status: false, error: error.message },
      { status: 500 }
    );
  }
};
