import dontenv from "dotenv";

import connectDB from "./db/index.js";
import { app } from "./app.js";

dontenv.config();

connectDB()
  .then(() => {
    // * if the app returns the error
    app.on("error", (err) => {
      console.log("Application not able to talk to DB:", err);
    });

    // *  if everything goes well
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongo connection failed:", err);
  });

// (async () => {
//   try {
//     const DB = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     console.log(DB);
//   } catch (error) {
//     console.log("Error in connecting the DB=", error);
//     throw error;
//   }
// })();
