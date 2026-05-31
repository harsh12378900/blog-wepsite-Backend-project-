const mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
  title: {   // ✅ FIXED
    type: String,
    required: true,
  },
  Post_name: {   // 🔥 also fix naming (camelCase better)
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    filename: {
      type: String,
      default: "post",
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1501117716987-c8e1ecb2108d",
      set: v =>
        v === ""
          ? "https://images.unsplash.com/photo-1501117716987-c8e1ecb2108d"
          : v,
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  like:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
    
  ],
});

module.exports = mongoose.model("Post", postSchema);