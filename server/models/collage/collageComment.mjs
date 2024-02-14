import { Schema, model } from "mongoose";

const collageCommentSchema = new new Schema({})();

// Create Model
const CollageComment = model("CollageComment", collageCommentSchema);

export default CollageComment;
