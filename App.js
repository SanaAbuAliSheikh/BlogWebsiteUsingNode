const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const bodyparser=require('body-parser');

// INIT APP
const app=express();

//Middleware
app.use(express.json({extended:false}))
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

// SET STATIC FOLDER
app.use(express.static(path.join(__dirname,'public')))



// DB CONNECTION
mongoose.connect("mongodb+srv://root:root@cluster0-gq3hv.mongodb.net/test?retryWrites=true&w=majority",{ useUnifiedTopology: true, useNewUrlParser: true});
let db=mongoose.connection;

// CHECK FOR DB SUCCESSFUL CONNECTION
db.once('open',()=>{
    console.log("Connected to Mongo DB");
})

// CHECK FOR DB ERRORS
db.on('error',(err)=>{
    console.log(err);
})


// BRING IN MODELS
let Articles=require('./Models/Articles');
console.log(Articles)

// VIEW ENGINE
app.set('view engine','pug');
app.set('views',path.join(__dirname,'Views'));

// HOME PAGE POST REQUEST
app.post('/',async(req,res)=>{
    
    let article={}
    article.title=req.body.title;
    article.author=req.body.author;
    article.body=req.body.body;

    let articleModel= new Articles(article);
    await articleModel.save();
    
});

// HOME PAGE GET REQUEST
app.get('/',(req,res)=>{
    console.log("Outside");
    Articles.find({},(err,articles)=>{
        if(err){
            console.log(err)
        } else{
            res.render('Home',{
                category:'Home',
                articles_list:articles
        
            });
        }
    }); 
})


// ADD ARTICLES GET REQUEST
app.get('/add_articles',(req,res)=>{
    res.render('Add_Articles',{
        category:'Add Articles'
    });
});


// ADD ARTICLES POST REQUEST
app.post('/add_articles',async(req,res)=>{
    console.log(req.body.title)
    const{title,author,body}=req.body;
    let article={}
    article.title=title;
    article.author=author;
    article.body=body;
    
    let articleModel= new Articles(article);
    await articleModel.save((err)=>{
        if(err){
            console.log(err);
        } else{
            res.redirect("/");
        }
    });
});

// Get single record
app.get('/article/:id',(req,res)=>{
    
    Articles.findById(req.params.id,(err,articles)=>{
        if(err){
            console.log(err)
        } else{
            res.render('Article',{
                category:'Article Blog',
                article:articles
        
            });
        }
    }); 
})

//GET Update Article
app.get('/article/edit/:id',(req,res)=>{
    Articles.findById(req.params.id,(err,articles)=>{
        if(err){
            console.log(err)
        } else{
            res.render('UpdateArticle',{
                article:articles    
            });
        }
    });
    
})

// POST UPDATE ARTICLE
app.post('/article/edit/:id',(req,res)=>{
    console.log('Edit Post')
    let article={}
    article.title=req.body.title;
    article.author=req.body.author;
    article.body=req.body.body;
    
    let query={
        _id:req.params.id
    }
    console.log(req.body.body)
    Articles.update(query,article,(err)=>{
            if(err){
                console.log(err)
            } else{
                res.redirect("/");
                
            }
        });
})


//GET DELETE Article
app.get('/article/delete/:id',(req,res)=>{
    console.log(req.params.id)
    let query={_id:req.params.id}
    Articles.deleteOne(query,(err)=>{
        if(err){
            console.log(err);
        } else{
            res.redirect('/');
        }
    })
})

app.delete('/article/delete/:id',(req,res)=>{
    console.log(req.params.id)
    let query={_id:req.params.id}
    Articles.remove(query,(err)=>{
        if(err){
            console.log(err);
        } else{
            res.send('Success');
        }
    })
})

// LISTEN SERVER
app.listen(3000,()=>{
    console.log("Server has Started");
})