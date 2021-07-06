import { IUser } from "../users/model";

export interface Score {
  _id: string;
  user: IUser;
  userId: string;
  score: number;
  gameType: number;
}
