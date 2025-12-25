import { checkAuthentication } from "@/lib/authenticateUser";
import connectDB from "@/lib/connectDB";

export const GET = async () => {
  await connectDB();
  const user = await checkAuthentication();
  if (user instanceof Response) return user;
  return Response.json(user);
};
