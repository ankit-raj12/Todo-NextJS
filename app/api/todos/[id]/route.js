import { checkAuthentication } from "@/lib/authenticateUser";
import connectDB from "@/lib/connectDB";
import Todo from "@/models/todo.model";

export const PATCH = async (request, { params }) => {
  try {
    await connectDB();

    const user = await checkAuthentication();
    if (user instanceof Response) return user;
    
    const { id } = await params;
    const editedTodo = await request.json();

    const newTodo = await Todo.updateOne({_id: id, userId: user.id}, editedTodo, {
      new: true,
    });
    return Response.json(newTodo);
  } catch (error) {
    return Response.json(
      { message: "Error updating todo", error },
      {
        status: 500,
      }
    );
  }
};

export const DELETE = async (request, { params }) => {
  await connectDB();
  const { id } = await params;

  try {

    const user = await checkAuthentication();
    if (user instanceof Response) return user;

    await Todo.deleteOne({_id: id, userId:  user.id });

    return new Response(null, {
      status: 204,
    });

  } catch (error) {
    return Response.json(
      { message: "Error deleting todo", error },
      {
        status: 500,
      }
    );
  }
};