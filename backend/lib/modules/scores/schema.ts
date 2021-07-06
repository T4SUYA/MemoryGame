import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users" },
  score: { type: Number, default: 0 },
  gameType: { type: Number, default: 1 },
});

export default mongoose.model("scores", schema);
