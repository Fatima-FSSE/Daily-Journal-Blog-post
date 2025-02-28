require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const path = require("path");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: $(conn.connection.host)` );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public')); 

const postSchema = {
  title: String,
  content: String
};

const Post = new mongoose.model("Post", postSchema);

app.get("/", async (req, res) => {
  try {
    await Post.find({}).then(function(posts){
      res.render("home", {
        homeContent: homeStartingContent,
        postsList: posts
      });
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/posts/:postID", async (req, res) => {
  try {
    const postID = req.params.postID;
    await Post.findOne({_id: postID}).then(function(foundPost){
      res.render("post", {
      title: foundPost.title,
      content: foundPost.content
       });
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/about", function(req, res){
  res.render("about", {ejsAboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {ejsContactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", async (req, res) => {
  try {
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postText
    });
    await post.save().then(function(){
      res.redirect("/");
    }); 
  } catch (error) {
    console.log(error);
  } 
});

connectDB().then(  () => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});
