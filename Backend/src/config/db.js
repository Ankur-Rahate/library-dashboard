import mongoose from "mongoose";
import { config } from "./config.js";

const connectDB = async() => {

  try{
    mongoose.connection.on("connected", () =>{
      console.log("connected to database successfull");
    })

    mongoose.connection.on('error',(err) =>{
      console.log("error are connecting database",err)
    })
    await mongoose.connect(config.databaseUrl);

  }catch(error){
    console.log("failed to connect dataa base",error)
    process.exit(1);

  }
}
export default connectDB;