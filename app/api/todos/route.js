import { checkAuthentication } from "@/lib/authenticateUser";
import connectDB from "@/lib/connectDB";
import Todo from "@/models/todo.model";

export const GET = async () => {
  await connectDB();

  const user = await checkAuthentication();
  if (user instanceof Response) return user;

  const allTodos = await Todo.find({ userId: user.id });

  return Response.json(
    allTodos.map(({ id, text, completed }) => ({
      id,
      text,
      completed,
    }))
  );
};

export const POST = async (request) => {
  await connectDB();

  const todo = await request.json();
  try {
    const user = await checkAuthentication();
    if (user instanceof Response) return user;

    const { id, text, completed } = await Todo.create({
      text: todo.text,
      userId: user.id,
    });

    return Response.json(
      { id, text, completed },
      {
        status: 201,
      }
    );
  } catch (error) {
    return Response.json("Error while creating Todo", {
      status: 500,
    });
  }
};
