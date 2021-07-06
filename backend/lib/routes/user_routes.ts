import { Application, Request, Response } from "express";
import { verifyToken } from "../validators/verify_token";
import { UserController } from "../controllers/user_controller";

export class UserRoutes {
  private user_controller: UserController = new UserController();

  public route(app: Application) {
    app.post("/api/user", (req: Request, res: Response) => {
      this.user_controller.create_user(req, res);
    });

    app.post("/api/auth/login", (req: Request, res: Response) => {
      this.user_controller.login(req, res);
    });

    app.get("/api/user/:id", verifyToken, (req: Request, res: Response) => {
      this.user_controller.get_user(req, res);
    });

    app.put("/api/user/:id", (req: Request, res: Response) => {
      this.user_controller.update_user(req, res);
    });

    app.delete("/api/user/:id", (req: Request, res: Response) => {
      this.user_controller.delete_user(req, res);
    });

    app.get("/api/user", (req: Request, res: Response) => {
      this.user_controller.find_all(req, res);
    });

    app.get("/api/profile", verifyToken, (req: Request, res: Response) => {
      this.user_controller.profile(req, res);
    });
  }
}
