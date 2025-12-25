import { checkAuthentication } from "@/lib/authenticateUser";
import connectDB from "@/lib/connectDB";
import Todo from "@/models/todo.model";

export const PATCH = async (request, { params }) => {
  try {
    await connectDB();

    const user = await checkAuthentication();
    if (user instanceof Response) {
      return user;
    }
    
    const { id } = await params;
    
    const editedTodo = await request.json();
    
    if (!id) {
      return Response.json(
        { message: "Todo ID is required", status: false },
        { status: 400 }
      );
    }

    const result = await Todo.updateOne(
      { _id: id, userId: user.id },
      editedTodo,
      { new: true }
    );
    
    if (result.matchedCount === 0) {
      return Response.json(
        { message: "Todo not found or unauthorized", status: false },
        { status: 404 }
      );
    }
    
    return Response.json(
      { message: "Todo updated successfully", status: true, result },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Error updating todo", status: false, error: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = async (request, { params }) => {
  try {
    await connectDB();
    
    const { id } = await params;
    
    if (!id) {
      return Response.json(
        { message: "Todo ID is required", status: false },
        { status: 400 }
      );
    }

    const user = await checkAuthentication();
    if (user instanceof Response) {
      return user;
    }

    const result = await Todo.deleteOne({ _id: id, userId: user.id });
    
    if (result.deletedCount === 0) {
      return Response.json(
        { message: "Todo not found or unauthorized", status: false },
        { status: 404 }
      );
    }
    
    return Response.json(
      { message: "Todo deleted successfully", status: true },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Error deleting todo", status: false, error: error.message },
      { status: 500 }
    );
  }
};