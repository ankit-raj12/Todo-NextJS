import { checkAuthentication } from "@/lib/authenticateUser";
import connectDB from "@/lib/connectDB";
import Todo from "@/models/todo.model";

export const GET = async () => {
  try {
    await connectDB();

    const user = await checkAuthentication();
    if (user instanceof Response) {
      return user;
    }

    const allTodos = await Todo.find({ userId: user.id });

    return Response.json(
      allTodos.map(({ id, text, completed }) => ({
        id,
        text,
        completed,
      }))
    );
  } catch (error) {
    return Response.json(
      { message: "Error fetching todos", status: false, error: error.message },
      { status: 500 }
    );
  }
};

export const POST = async (request) => {
  try {
    await connectDB();

    const todo = await request.json();
    
    if (!todo.text || todo.text.trim() === "") {
      return Response.json(
        { message: "Todo text is required", status: false },
        { status: 400 }
      );
    }
    
    const user = await checkAuthentication();
    if (user instanceof Response) {
      return user;
    }

    const { id, text, completed } = await Todo.create({
      text: todo.text,
      userId: user.id,
    });
    
    return Response.json(
      { id, text, completed, message: "Todo created successfully", status: true },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: "Error while creating todo", status: false, error: error.message },
      { status: 500 }
    );
  }
};
