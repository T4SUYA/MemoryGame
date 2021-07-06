import * as bcrypt from "bcryptjs";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { response_status_codes } from "../modules/common/model";
import environment from "../environment";
import {
  failureResponse,
  insufficientParameters,
  mongoError,
  successResponse,
} from "../modules/common/service";
import { IUser } from "../modules/users/model";
import UserService from "../modules/users/service";
import {
  loginValidation,
  registerValidation,
} from "../validators/user_validation";

export class UserController {
  private user_service: UserService = new UserService();

  public async login(req: Request, res: Response) {
    const { error } = loginValidation(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const user: any = await this.user_service.getByNickname({
      name: req.body.name,
    });

    if (!user) return res.status(401).json({ message: "Wrong Nickname" });

    const validPass = await bcrypt.compare(req.body.password, user.password);

    if (!validPass) return res.status(401).json({ message: "Wrong Password" });

    const token = jwt.sign(
      {
        _id: user._id,
      },
      environment.getSecret()
    );

    res
      .status(response_status_codes.success)
      .json({ token: token, user: user });
  }

  public async create_user(req: Request, res: Response) {
    const { error } = registerValidation(req.body);

    if (error) return res.status(401).send(error);

    const nicknameExists = await this.user_service.getByNickname({
      name: req.body.name,
    });

    if (nicknameExists)
      return res.status(400).send("This Nickname already exists");

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user_params: IUser = {
      name: req.body.name,
      password: hashedPassword,
    };
    this.user_service.createUser(user_params, (err: any, user_data: IUser) => {
      if (err) {
        mongoError(err, res);
      } else {
        successResponse("create user successfull", user_data, res);
      }
    });
  }

  public get_user(req: Request, res: Response) {
    if (req.params.id) {
      const user_filter = { _id: req.params.id };
      this.user_service.filterUser(
        user_filter,
        (err: any, user_data: IUser) => {
          if (err) {
            mongoError(err, res);
          } else {
            successResponse("get user successfull", user_data, res);
          }
        }
      );
    } else {
      insufficientParameters(res);
    }
  }

  public update_user(req: Request, res: Response) {
    if (req.params.id && req.body.name) {
      const user_filter = { _id: req.params.id };
      this.user_service.filterUser(
        user_filter,
        (err: any, user_data: IUser) => {
          if (err) {
            mongoError(err, res);
          } else if (user_data) {
            const user_params: IUser = {
              _id: req.params.id,
              name: req.body.name ? req.body.name : user_data.name,
              is_deleted: req.body.is_deleted
                ? req.body.is_deleted
                : user_data.is_deleted,
            };
            this.user_service.updateUser(user_params, (err: any) => {
              if (err) {
                mongoError(err, res);
              } else {
                successResponse("update user successfull", user_params, res);
              }
            });
          } else {
            failureResponse("invalid user", null, res);
          }
        }
      );
    } else {
      insufficientParameters(res);
    }
  }

  public delete_user(req: Request, res: Response) {
    if (req.params.id) {
      this.user_service.deleteUser(
        req.params.id,
        (err: any, delete_details: any) => {
          if (err) {
            mongoError(err, res);
          } else if (delete_details.deletedCount !== 0) {
            successResponse("delete user successfull", null, res);
          } else {
            failureResponse("invalid user", null, res);
          }
        }
      );
    } else {
      insufficientParameters(res);
    }
  }

  async find_all(req: Request, res: Response) {
    try {
      let users = await this.user_service.findAll();
      res.send(successResponse("", users, res));
    } catch (error) {
      res.json({ error: "error" }).send();
    }
  }

  profile(req: Request, res: Response) {
    const token: any = req.headers["auth-token"];
    const { _id }: any = jwt.verify(token, environment.getSecret());
    this.user_service.filterUser({ _id }, (err: any, user_data: IUser) => {
      if (err) {
        mongoError(err, res);
      } else if (user_data) {
        res.send(user_data);
      }
    });
  }
}
