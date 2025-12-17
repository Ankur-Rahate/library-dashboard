import path from "path";
import multer from "multer";
import express from "express";
import {
  createBook,
  deleteBook,
  listBook,
  singleBook,
  updateBook,
} from "./bookController.js";
import authenticate from "../middleware/authentication.js";

const bookRouter = express.Router();

// MULTER
const upload = multer({
  dest: "./public/data/upload",
  limits: { fileSize: 3e7 },
});

// CREATE BOOK ROUTER
bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

// UPDATE BOOK ROUTER
bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

// LIST ALL BOOK ROUTER
bookRouter.get("/", listBook);

// GET SINGLE BOOK ROUTER
bookRouter.get("/:bookId", singleBook);

// DELETE BOOK ROUTER
bookRouter.delete("/:bookId", authenticate, deleteBook);

export { bookRouter };

