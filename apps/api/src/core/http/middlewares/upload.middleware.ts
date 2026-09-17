import multer from "multer";
import { RequestHandler } from "express";
import { BadRequestError } from "@shared/error";
import { ErrorCodes } from "@shared/error/error-codes";
import {
  MAX_IMAGE_UPLOAD_BYTES,
  isAllowedImageMimeType,
} from "@shared/constant/image-upload";

const storage = multer.memoryStorage();

const imageFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  // The allowlist lives in `@boilerplate/shared-types` so the web checks the
  // same set before sending. Anything outside it is refused at the edge.
  if (isAllowedImageMimeType(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        "Invalid image file type",
        undefined,
        ErrorCodes.FILE_INVALID_TYPE,
      ),
    );
  }
};

// Single-image upload — used by the avatar endpoint. `memoryStorage` buffers
// the whole file in RAM, so MAX_IMAGE_UPLOAD_BYTES doubles as a memory guard.
export const uploadImage: RequestHandler = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_IMAGE_UPLOAD_BYTES },
}).single("file") as unknown as RequestHandler;
