import { UserModel } from './user-model';

export interface ScoreModel {
  _id?: string;
  user?: UserModel;
  userId: String | undefined;
  score: number;
  gameType: number;
  position?: number;
}
