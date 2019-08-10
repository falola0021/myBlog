var express = require("express");
var  app = express();
var expressSanitizer = require('express-sanitizer');
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");



mongoose.connect("mongodb://localhost:27017/restfulBlog",{useNewUrlParser: true},function(err) {
  if (err) { return console.error('failed');}
      
  });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());



//setting up a schema
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type:Date , default:Date.now}
});
// create a model
var Blog = mongoose.model("Blog", blogSchema);

//ROOT ROUTE.mostly redirected to the index route
app.get("/" , function (req , res ){
    
    res.redirect("/blogs");
});
    

//INDEX ROUTE
app.get("/blogs" , function (req , res ){
    // get all blogs from data
    Blog.find({}, function(err,allBlogs){
        if(err){
            console.log("err");
        } else{
        res.render("index",{blogs:allBlogs});
            
        }
    });
    
});

//NEW ROUTE
app.get("/blogs/new" , function (req , res ){

    res.render("new");
});
 
 // CREATE ROUTE
 app.post("/blogs" , function (req , res ){
     //using sanitize
     req.body.blog.body = req.sanitize(req.body.blog.body);
     //create blog
    Blog.create (req.body.blog , function( err , newBlog){
        if(err){ res.render("new");
            
        } else{
             //redirect to the index

            res.redirect("/blogs");
        }
    }); 
    
});

//SHOW ROUTE
app.get("/blogs/:id" , function (req , res ){
    Blog.findById(req.params.id, function (err, foundBlog){
    if(err){
        res.redirect("/blogs");
    } else{
       res.render("show", {blog:foundBlog}) ;
    } 
        
    });
    
});

//EDIT ROUTE
app.get("/blogs/:id/edit" , function (req , res ){
     Blog.findById(req.params.id, function (err, foundBlog){
    if(err){
        res.redirect("/blogs");
    } else{
       res.render("edit", {blog:foundBlog}) ;
    } 
        
    });
 
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req , res){
     //using sanitize
     req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id , req.body.blog , function(err , updatedBlog){
     if(err){
         res.redirect("/blogs");
     }  else{
         res.redirect("/blogs/" + req.params.id);
     }
   });
});

//DELETE ROUTE

app.delete("/blogs/:id", function(req , res){
   //destroy route 
    Blog.findByIdAndRemove(req.params.id, function (err){
        if(err){res.redirect("/blogs");
    }   else{
     res. redirect("/blogs");
    }
});

});


app.listen(3000, function(){
    console.log("blog is working");});