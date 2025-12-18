import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import globalErrorHandler from "./middleware/globalErrorHandling.js";
import userRouter from "./user/userRouter.js";
import { bookRouter } from "./book/bookRouter.js";

const app = express();

app.use(
  cors({
    origin: config.frontendDomain,
  })
);

app.get("/", (req, res, next) => {
  res.json({ message: "welcome" });
});

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

app.use(globalErrorHandler);

export default app;
