import app from "./src/app.js";
import { config } from "./src/config/config.js";
import connectDB from "./src/config/db.js";

const startServer = async () => {

  //connect database
await connectDB();
const PORT = config.port  || 3001;

app.listen(PORT, () =>{
  console.log(`server is running on ${PORT}`)
});
}

startServer();