import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

//node js and c++ dono m void ka context alag alag h
//means in term of nodejs void ka mtlb Promise toh return kr he rha h but promise kis type ka h muje nhi parwah
async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("already connected to database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    console.log(db);
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
}

export default dbConnect;
