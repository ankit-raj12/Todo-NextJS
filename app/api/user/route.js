import { checkAuthentication } from "@/lib/authenticateUser";
import connectDB from "@/lib/connectDB";

export const GET = async () => {
  try {
    await connectDB();
    
    const user = await checkAuthentication();
    if (user instanceof Response) {
      return user;
    }
  
    return Response.json(user);
  } catch (error) {
    return Response.json(
      { message: "Error fetching user info", status: false, error: error.message },
      { status: 500 }
    );
  }
};
