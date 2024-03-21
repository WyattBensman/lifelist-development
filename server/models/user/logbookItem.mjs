import { Schema, model } from "mongoose";

const logbookItemSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  collage: {
    type: Schema.Types.ObjectId,
    ref: "Collage",
  },
  startDate: {
    type: Date,
  },
  finishDate: {
    type: Date,
  },
  date: {
    type: Date,
  },
  month: {
    type: String,
  },
});

const LogbookItem = model("LogbookItem", logbookItemSchema);

export default LogbookItem;
