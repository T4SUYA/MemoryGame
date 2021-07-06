import { Application, Request, Response } from "express";
import multer from "multer";
import PhotoController from "../controllers/photo_controller";

export class PhotoRoutes {
  private photoController = new PhotoController();

  upload: multer.Multer;

  constructor() {
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads/");
      },
      filename: function (req, file, cb) {
        cb(
          null,
          file.originalname.split(".")[1] +
            "-" +
            Date.now() +
            "." +
            file.mimetype.split("/")[1]
        );
      },
    });
    this.upload = multer({ storage: storage });
  }
  public route(app: Application) {
    app.post(
      "/api/photos/upload",
      this.upload.array("figure"),
      (req: Request, res: Response) => {
        this.photoController.savePhoto(req, res);
      }
    );

    app.get("/api/photos", (req: Request, res: Response) => {
      this.photoController.findPaginated(req, res);
    });
  }
}
