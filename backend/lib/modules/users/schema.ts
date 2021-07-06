import * as mongoose from "mongoose";
import { ModificationNote } from "../common/model";

const Schema = mongoose.Schema;

const schema = new Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  modification_notes: [ModificationNote],

  points: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("users", schema);
