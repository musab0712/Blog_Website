const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.set('strictQuery', true);

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/BlogWebsiteDB');
}


const homeStartingContent = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.";

const aboutContent = "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout";

const contactContent = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout";

const app = express();

const port = 3000;

const postSchema = new mongoose.Schema({
    title : String,
    content : String
});

const Post = mongoose.model('Post', postSchema);


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));


app.get("/", (req, res) => {
    Post.find({}, (err, posts) => {
        res.render("home", {
          startingContent: homeStartingContent,
          posts: posts
          });
      });
});

app.get("/about", (req, res) => {
    res.render("about", {startingAbout :aboutContent});
});


app.get("/contact", (req, res) => {
    res.render("contact", {startingContact :contactContent});
});

app.get("/compose", (req, res) => {
    res.render("compose");
});

app.post("/compose", (req,res) => {
    const post = new Post({
        title : req.body.postTitle,
        content : req.body.postContent
    });
    post.save();
    res.redirect("/");
})

app.get("/posts/:postID", (req, res) => {

    const requestedID = req.params.postID;

    Post.findOne({_id : requestedID}, (err, post) => {
        res.render("post", {
            title: post.title,
            content: post.content
        });
    });
});


app.listen(port, () => {
    console.log("server is running");
});