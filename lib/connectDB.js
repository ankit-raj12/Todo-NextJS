import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState == 1) {
      console.log("Already Connected!");
      return;
    }

    await mongoose.connect(process.env.MONGO_URL, {
        dbName: "TodoApp"
    });

    console.log("Database Connected successfully!");
  } catch (error) {
    console.log("Error connecting Database-> ", error);
    process.exit(1);
  }
};

export default connectDB;
