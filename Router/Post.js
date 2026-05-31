let express=require("express");
 const logging=require("../middleware")
const Post = require("../model/post");
const User = require("../model/user");

const route = express.Router();
/* ===================== profile ===================== */
route.get("/profile",  async (req, res) => {
    if(req.user!=null){
      const user = await User.findById(req.user._id).populate("post");
      res.render("profile/profile", { user });
    }else{
      res.render("profile/profile");
    }
  });
  /* ===================== create post ===================== */
  route.get("/post/new", logging, (req, res) => {
    res.render("profile/post");
  });
  
  route.post("/post/new", logging, async (req, res) => {
    try {
      const { title, Post_name, description, image } = req.body;
  
      const user = await User.findById(req.user._id);
  
      const newPost = new Post({
        title,
        Post_name,
        description,
        image: {
          url: image
        }
      });
  
      // 1. Save post
      await newPost.save();
  
      // 2. Link post to user
      user.post.push(newPost._id);   // ✅ make sure schema has "posts"
      await user.save();
  
      // 3. Flash + redirect
      req.flash("success", "Post created successfully! 🎉");
      res.redirect("/profile");
  
    } catch (err) {
      console.error("Error creating post:", err);
      req.flash("error", err.message);
      res.redirect("/post/new");
    }
  });
/* ===================== Edit post ===================== */
route.get("/post/:id/edit", logging, async (req, res) => {
  let postId = req.params.id;
  let post = await Post.findById(postId);
  res.render("profile/edit",{post});
})

/* ===================== Edit post ===================== */
route.put("/post/:id/update", logging, async (req, res) => {
let postId = req.params.id;
let { title, Post_name, description, image } = req.body;


let updatedData = {
  title,
  Post_name,
  description,
  image: {url:image}
};


// ✅ handle new uploaded image


await Post.findByIdAndUpdate(postId, updatedData, {
  runValidators: true,
  new: true,
});

req.flash("success", "post update successfully!");
res.redirect("/profile");

})

/* ===================== Delete post ===================== */

route.delete("/post/:id/delete", logging, async (req, res) => {
  let postId = req.params.id;
  await Post.findByIdAndDelete(postId);
  req.flash("success", "post deleted successfully!");
  res.redirect("/profile");
})


  
  /* ===================== Likes ===================== */
  route.post("/posts/:id/like",async (req, res) => {
    let postId = req.params.id;
    let userId = req.user._id;
    let post=await Post.findById(postId);
    if(post.like.includes(userId)){
      post.like.pull(userId);  
      req.flash("success","You unliked!"); // unlike
   }else{
      post.like.push(userId);
      req.flash("success","You  liked!");   // like
   }
  
   await post.save();
  
   res.redirect("/profile");
  })

  module.exports = route;