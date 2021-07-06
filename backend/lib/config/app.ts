import { PhotoRoutes } from "./../routes/photo_routes";
import { UserRoutes } from "../routes/user_routes";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import environment from "../environment";
import { CommonRoutes } from "../routes/common_routes";
import { ScoreRoutes } from "../routes/score_routes";

class App {
  public app: express.Application;

  private commonRoutes: CommonRoutes = new CommonRoutes();
  private user_routes: UserRoutes = new UserRoutes();
  private photo_routes: PhotoRoutes = new PhotoRoutes();
  private score_routes: ScoreRoutes = new ScoreRoutes();

  public mongoUrl: string =
    "mongodb+srv://root:321258789Ab)@cluster0.ruvud.mongodb.net/" +
    environment.getDBName();
  constructor() {
    this.app = express();
    this.config();
    this.mongoSetup();

    this.user_routes.route(this.app);
    this.photo_routes.route(this.app);
    this.score_routes.route(this.app);
    this.commonRoutes.route(this.app);
  }
  private config(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private mongoSetup(): void {
    mongoose.connect(this.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  }
}
export default new App().app;
