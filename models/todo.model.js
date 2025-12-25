import mongoose, { Schema } from "mongoose";

const Todo = mongoose.models.todos || mongoose.model("todos", {
  text: {
    type : String,
    required : true,
  },
  completed: {
    type : Boolean,
    default : false,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  }
});

export default Todo;