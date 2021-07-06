import { NextFunction, Request, Response } from "express";
import { Score } from "../modules/scores/model";
import ScoreService from "../modules/scores/service";
export class ScoreController {
  private scoreService: ScoreService = new ScoreService();

  async findAll(req: Request, res: Response) {
    res.send(await this.scoreService.findAll());
  }

  async find(req: Request, res: Response) {
    const model: Score = req.body;
    const query = { user: { _id: model.userId }, gameType: model.gameType };
    res.send(await this.scoreService.filterOneScore(query));
  }
  async findByGameType(req: Request, res: Response) {
    res.send(
      await this.scoreService.filterScore({ gameType: req.params.type })
    );
  }

  async save(req: Request, res: Response) {
    const model: Score = req.body;
    const query = { user: { _id: model.userId }, gameType: model.gameType };
    const oldModel = await this.scoreService.filterOneScore(query);
    if (oldModel) {
      if (oldModel.score < model.score) {
        res.send(await this.scoreService.updateScore(model));
      }
    } else {
      res.send(await this.scoreService.createScore(model));
    }
    res.end();
  }
}
