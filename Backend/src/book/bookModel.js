import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({

  title:{
    require:true,
    type:String,
  },

  description: {
  type: String,
  require: true,
  },

  author:{
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  require:true
  },

  coverImage:{
  type: String,
  require: true
  },

  file:{
  type: String,
  require: true
  },

  genre:{
  type: String,
  require: true
  },
}, {timestamps : true}

)

export default mongoose.model("Book", bookSchema);



