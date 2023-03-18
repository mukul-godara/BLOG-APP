const express = require('express');
const { ObjectId } = require('mongodb');
const mongodb=require("mongodb")

const router = express.Router();
const db=require("../database/database")

router.get('/', function(req, res) {
  res.redirect('/posts');
});

router.post('/posts',async function(req, res) {
  const authorid=new ObjectId(req.body.author);
  const author=await db.getDb().collection("authors").findOne({_id:authorid});
  const newpost={
    title:req.body.title,
    summary:req.body.summary,
    body:req.body.content,
    date:new Date(),
    author:{
      id:authorid,
      name:author.name,
      email:author.email
    }
  }
  const result=await db.getDb().collection("posts").insertOne(newpost);
  res.redirect("/posts")
});

router.get('/posts',async function(req, res) {
  const posts=await db.getDb().collection("posts").find({},{title:1,summary:1,"author.name":1}).toArray();
  res.render('posts-list',{posts:posts});
});

router.get("/posts/:id",async function(req,res){
  const postid=req.params.id;
  console.log(postid);
  const post=await db.getDb().collection("posts").findOne({_id:new ObjectId(postid)},{summary:0});
  console.log(post)
  if(!post){
    return res.status(404).render("404");
  }
  res.render("post-detail",{post:post});
})


router.get("/posts/:id/edit",async function(req,res){
  const postid=req.params.id;
  const post=await db.getDb().collection("posts").findOne({_id:new ObjectId(postid)},{title:1,summary:1,body:1});
  if(!post){
    return res.status(404).render("404");
  }
  console.log(post)
  res.render("update-post",{post:post})

})
router.post("/posts/:id/edit",async function(req,res){
  console.log(req.params.id)
  const postid=new ObjectId(req.params.id);
  const result=await db.getDb().collection("posts").updateOne({_id:postid},{$set:{
    title:req.body.title,
    summary:req.body.summary,
    body:req.body.content,
  },})
  res.redirect("/posts")
})
router.post("/posts/:id/delete",async function(req,res){
  const postid=req.params.id;
  const result=await db.getDb().collection("posts").deleteOne({_id:new ObjectId(postid)})
  res.redirect("/posts")
})


router.get('/new-post', async function(req, res) {
  const authors=await db.getDb().collection("authors").find().toArray();
  res.render('create-post',{authors:authors});
});


module.exports = router;