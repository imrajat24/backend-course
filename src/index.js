import connectDB from "./db/index.js";
import dontenv from "dotenv";

connectDB();

dontenv.config({ path: "../.env" });

// (async () => {
//   try {
//     const DB = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     console.log(DB);
//   } catch (error) {
//     console.log("Error in connecting the DB=", error);
//     throw error;
//   }
// })();
