import { Score } from "./model";
import scores from "./schema";

export default class ScoreService {
  public async createScore(score_params: Score) {
    const _session = new scores({
      user: score_params.userId,
      gameType: score_params.gameType,
      score: score_params.score,
    });
    return await _session.save();
  }

  public async filterScore(query: any) {
    return await scores
      .find(query)
      .limit(3)
      .populate("user")
      .sort({ score: -1 })
      .exec();
  }

  public async filterOneScore(query: any) {
    return await scores
      .findOne(query)
      .populate("user")
      .sort({ score: -1 })
      .exec();
  }

  public async findAll() {
    return await scores.find().exec();
  }

  public async updateScore(score_params: Score) {
    const query = { _id: score_params._id };
    return await scores.findOneAndUpdate(query, {
      _id: score_params._id,
      user: score_params.userId,
      gameType: score_params.gameType,
      score: score_params.score,
    });
  }
}
