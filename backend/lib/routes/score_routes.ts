import { Application, Request, Response, NextFunction } from "express";
import { ScoreController } from "../controllers/score_controller";
import { verifyToken } from "../validators/verify_token";
export class ScoreRoutes {
  scoreController: ScoreController = new ScoreController();

  public route(app: Application) {
    app.get("/api/scores", verifyToken, (req: Request, res: Response) => {
      this.scoreController.findAll(req, res);
    });
    app.post("/api/score", verifyToken, (req: Request, res: Response) => {
      this.scoreController.find(req, res);
    });

    app.get(
      "/api/scores/game/:type",
      verifyToken,
      (req: Request, res: Response) => {
        this.scoreController.findByGameType(req, res);
      }
    );

    app.post("/api/scores", verifyToken, (req: Request, res: Response) => {
      this.scoreController.save(req, res);
    });
  }
}
