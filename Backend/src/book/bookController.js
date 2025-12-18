import path from "path";
import cloudinary from "../config/cloudinary.js";
import createHttpError from "http-errors";
import { fileURLToPath } from "node:url";
import bookModel from "./bookModel.js";
import fs from "node:fs";

const _filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(_filename);

// CREATE BOOK
const createBook = async (req, res, next) => {
  const { title, genre, description } = req.body;
  const files = req.files;

  if (!req.files || !req.files.coverImage || !req.files.file) {
    return next(createHttpError(400, "Files not provided"));
  }

  try {
    const coverImageMimeType = files.coverImage[0].mimetype
      .split("/")
      .at(-1);
    const filename = files.coverImage[0].filename;
    const filePath = path.resolve(
      __dirname,
      "../../public/data/upload",
      filename
    );

    // upload coverImage on cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: filename,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/upload",
      bookFileName
    );

    // upload file on cloudinary
    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdf",
        format: "pdf",
      }
    );

    // upload file on cloudinary
    const newBook = await bookModel.create({
      title,
      description,
      genre,
      author: req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    await fs.promises.unlink(filePath);
    await fs.promises.unlink(bookFilePath);

    res.status(201).json({ id: newBook._id });
  } catch (err) {
    console.log(err);
    return next(createHttpError(500, "Error while uploading file"));
  }
};

// UPDATE BOOK
const updateBook = async (req, res, next) => {
  const { title, description, genre } = req.body;
  const bookId = req.params.bookId;
  const files = req.files;

  const book = await bookModel.findOne({ _id: bookId });
  if (!book) {
    return next(createHttpError(404, "Book Not Found"));
  }

  // check access
  if (book.author.toString() != req.userId) {
    return next(
      createHttpError(403, "You can not update others book")
    );
  }

  const coverFileSplits = book.coverImage.split("/");
  const CoverImagePublicId =
    coverFileSplits.at(-2) +
    "/" +
    coverFileSplits.at(-1)?.split(".").at(-2);

  const bookFileSplits = book.file.split("/");
  const bookFilePublicId =
    bookFileSplits.at(-2) + "/" + bookFileSplits.at(-1);

  // update bookcover on cloudinary
  let completeCoverImage = "";
  if (files.coverImage) {
    const filename = files.coverImage[0].filename;
    const coverImageMimeType = files.coverImage[0].mimetype
      .split("/")
      .at(-1);
    const filePath = path.resolve(
      __dirname,
      "../../public/data/upload",
      filename
    );

    completeCoverImage = filename;

    // delete data on cloudinary
    try {
      await cloudinary.uploader.destroy(CoverImagePublicId);
    } catch (err) {
      return next(
        createHttpError(502, "network error. try again.")
      );
    }

    // update cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      filePath,
      {
        filename_override: filename,
        folder: "book-covers",
        format: coverImageMimeType,
      }
    );

    completeCoverImage = uploadResult.secure_url;
    await fs.promises.unlink(filePath);
  }

  // update bookfile on cloudinary
  let completeFileName = "";
  if (files.file) {
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/upload",
      files.file[0].filename
    );
    const bookFileName = files.file[0].filename;
    completeFileName = bookFileName;

    // delete data on cloudinary
    try {
      await cloudinary.uploader.destroy(bookFilePublicId, {
        resource_type: "raw",
      });
    } catch (err) {
      return next(
        createHttpError(502, "network error. try again.")
      );
    }

    // update cloudinary
    const uploadResultPdf = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: completeFileName,
        folder: "book-pdf",
        format: "pdf",
      }
    );

    completeFileName = uploadResultPdf.secure_url;
    await fs.promises.unlink(bookFilePath);
  }

  // update Book on database
  const updateBook = await bookModel.findOneAndUpdate(
    { _id: bookId },
    {
      title: title,
      description: description,
      genre: genre,
      coverImage: completeCoverImage
        ? completeCoverImage
        : book.coverImage,
      file: completeFileName ? completeFileName : book.file,
    },
    { new: true }
  );

  res.json(updateBook);
};

// LIST ALL BOOK
const listBook = async (req, res, next) => {
  try {
    const book = await bookModel
      .find()
      .populate("author", "name");
    res.json(book);
  } catch (err) {
    return next(
      createHttpError(500, "Error while getting book")
    );
  }
};

// GET ONE BOOK
const singleBook = async (req, res, next) => {
  const bookId = req.params.bookId;

  try {
    const book = await bookModel
      .findOne({ _id: bookId })
      .populate("author", "name");

    if (!book) {
      return next(
        createHttpError(404, "Book not found")
      );
    }

    res.json(book);
  } catch (err) {
    return next(
      createHttpError(500, "Error while getting book")
    );
  }
};

// DELETE BOOK
const deleteBook = async (req, res, next) => {
  const bookId = req.params.bookId;

  // checking BookId in database
  try {
    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    if (book.author.toString() != req.userId) {
      return next(
        createHttpError(
          403,
          "You can not deleted others book"
        )
      );
    }

    const coverFileSplits = book.coverImage.split("/");
    const CoverImagePublicId =
      coverFileSplits.at(-2) +
      "/" +
      coverFileSplits.at(-1)?.split(".").at(-2);

    const bookFileSplits = book.file.split("/");
    const bookFilePublicId =
      bookFileSplits.at(-2) + "/" + bookFileSplits.at(-1);

    // delete data on cloudinary
    try {
      await cloudinary.uploader.destroy(CoverImagePublicId);
      await cloudinary.uploader.destroy(bookFilePublicId, {
        resource_type: "raw",
      });
    } catch (err) {
      return next(
        createHttpError(502, "network error. try again.")
      );
    }

    // delete data in database
    try {
      await bookModel.deleteOne({ _id: bookId });
    } catch (err) {
      return next(
        createHttpError(500, "database error")
      );
    }

    return res.sendStatus(204);
  } catch (err) {
    return next(
      createHttpError(500, "Error while deleting book")
    );
  }
};

export {
  createBook,
  updateBook,
  listBook,
  singleBook,
  deleteBook,
};
