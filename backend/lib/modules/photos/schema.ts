import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

const schema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  base64: {
    type: String,
    required: true,
  },
});

export default mongoose.model("photos", schema);
