const express = require('express')
const app=express();
const port = process.env.PORT||3000;
const mysql = require('mysql');
const bodyParser=require('body-parser');
const https=require('https');
const axios = require('axios')
app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
const moment = require('moment')



var expressValidator = require('express-validator');
var flash = require('express-flash');
var session = require('express-session');

app.locals.moment = moment;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "jpmc"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE IF NOT EXISTS allnews(url VARCHAR(255) PRIMARY KEY,title VARCHAR(1000),author VARCHAR(1000),description VARCHAR(1000),content VARCHAR(2550),publishedAt VARCHAR(1000),urlToImage VARCHAR(1000))";
  // var sql = "CREATE TABLE IF NOT EXISTS newsjp (url VARCHAR(255) PRIMARY KEY,title VARCHAR(255))";
  con.query(sql, function (err, result) {
   if (err) throw err;
   console.log("Table created");
 });
});

app.get('/',(req,res)=>
{
  const options = {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  }
    const url="https://newsapi.org/v2/everything?q=women%20politics&sortBy=publishedAt&apiKey=36f3e29b704f41339af8439dc1228334"
    const data=[];
    https.get(url,options,(response)=>
    {
        response.on('data',(d)=>
        {
          data.push(d);

        }).on('end',()=>
        {
          const buffer = Buffer.concat(data);
        const obj = JSON.parse(buffer.toString());
        var values=[];
        // var sql = "INSERT INTO allnews (url, title,author,description,content,publishedAt,urlToImage) VALUES ?";
        // var c=0;
        // for(let i of obj.articles)
        // {
        //     var k=[];
        //     k.push(i.url);
        //     k.push(i.title);
        //     k.push(i.author);
        //     k.push(i.description);
        //     k.push(i.content);
        //     k.push(i.publishedAt);
        //     k.push(i.urlToImage);
        //     values.push(k);
        //     k=[];
        // }
        //   con.query(sql, [values], function (err, result) {
        //     if (err) throw err;
        //     console.log("Number of records inserted: " + result.affectedRows);
        //   });
        // res.render('news',{articles:obj.articles});
        res.render('index');
        })

    })
});


app.post('/search',function(req,res){
  const search=req.body.search;
  console.log(search);
  const options = {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  }
    var url = `https://newsapi.org/v2/everything?q=${search}&sortBy=publishedAt&apiKey=4359eeb411ab446686bdc062205af23f`;
    const data=[];
    https.get(url,options,(response)=>
    {
        response.on('data',(d)=>
        {
          data.push(d);
        }).on('end',()=>
        {
          const buffer = Buffer.concat(data);
        const obj = JSON.parse(buffer.toString());
        var values=[];
        console.log(obj.articles);
        res.render('news',{articles:obj.articles});
        })

    })

});


app.get('/news/:category',async(req,res)=>{
    var category = req.params.category;
    try {
        var url = 'http://newsapi.org/v2/everything?q=' + category + '&sortBy=publishedAt&apiKey=36f3e29b704f41339af8439dc1228334';

        const news_get =await axios.get(url)
        res.render('category',{articles:news_get.data.articles})

    }
    catch (error) {
        if(error.response){
            console.log(error)
        }
    }
});


app.get("/article/:email",function(req,res){
  var email=req.params.email;

  res.render('article',{email:email});
});

  var sql1="CREATE TABLE IF NOT EXISTS article(id integer auto_increment PRIMARY KEY,email varchar(255),name varchar(100),title varchar(100),content varchar(500),photo varchar(1000),video varchar(1000));";
  con.query(sql1, function (err, result) {
   if (err) throw err;
   console.log("Table created");
 });


app.post("/article",function(req,res){
  var email=req.body.email;
  var name=req.body.name;
  var title=req.body.title;
  var content=req.body.content;
  var photo=req.body.photo;
  var video=req.body.video;

  var sql2="INSERT INTO article(email,name,title,content,photo,video) values ?"
  var qf=[];
  qf.push(email);
  qf.push(name);
  qf.push(title);
  qf.push(content);
  qf.push(photo);
  qf.push(video);
  con.query(sql2, [[qf]], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
  res.redirect('/article/'+email);
});

app.get('/delete/:id',function(req,res){
  var id=req.params.id;
  var sql7="delete from article where id="+id;
  con.query(sql7,function(err,result){
    if (err) throw err;
    console.log("Number of records deleted: " + result.affectedRows);
  });
  res.redirect('/');
});

// app.get('/update/:id',function(req,res){
//   var id=req.params.id;
//   var sql8="select *  from article where id=?";
//   con.query(sql8,[id],function(err,result){
//     if (err) throw err;
//     console.log(result.id);
//     res.render("updatepage",{result:result});
//   });
//
// });



app.get("/contact",function(req,res){
  res.render('contact');
});
var sql3="CREATE TABLE IF NOT EXISTS contact(id INTEGER auto_increment PRIMARY KEY,name varchar(100),email varchar(100),phone varchar(100),whyvolunteer varchar(500),linkcv varchar(100),engage varchar(100));";
con.query(sql3, function (err, result) {
 if (err) throw err;
 console.log("Table created");
});


app.post("/contact",function(req,res){
  var name=req.body.name;
  var phone=req.body.phone;
  var email=req.body.email;
  var whyvolunteer=req.body.whyvolunteer;
  var linkcv=req.body.linkcv;
  var engage=req.body.engage;
  var sql4="INSERT INTO contact(name,phone,email,whyvolunteer,linkcv,engage) values ?"
  var qf=[];
  qf.push(name);
  qf.push(phone);
  qf.push(email);
  qf.push(whyvolunteer);
  qf.push(linkcv);
  qf.push(engage);
  con.query(sql4, [[qf]], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
  res.redirect('/contact');
});



app.get('/signin',function(req,res){
  res.render('signin');
});
 app.post("/signin",function(req,res){
    var email = req.body.email;
    var password = req.body.password;
    con.query('SELECT * FROM register WHERE email = ? AND pass = ?', [email, password], function(err, rows, fields) {
    if(err) throw err
    // if user not found
    if (rows.length <= 0) {
    console.log('error', 'Please correct enter email and Password!')
    res.redirect('/signin')
    }
    else { // if user found
    // render to views/user/edit.ejs template file
    // req.session.loggedin = true;
    // req.session.name = name;
    console.log("Success");
    con.query('select * from article where email=?',[email],function(err,rows,fields){
      console.log(rows);
      res.render('home',{email:email,rows:rows});
    })
    }
    })
 });


var sql5="CREATE TABLE IF NOT EXISTS register(email varchar(255) PRIMARY KEY,fname varchar(100),lname varchar(100),phn varchar(100),pass varchar(500));";
con.query(sql5, function (err, result) {
 if (err) throw err;
 console.log("Table created");
});
app.get('/signup',function(req,res){
  res.render('signup');
});
app.post("/signup",function(req,res){
  var fname=req.body.titile;
  var lname=req.body.lname;
  var email=req.body.mail;
  var phn=req.body.phn;
  var pass=req.body.pass;
  var sql6="INSERT INTO register(fname,lname,email,phn,pass) values ?"
  var qf=[];
  qf.push(fname);
  qf.push(lname);
  qf.push(email);
  qf.push(phn);
  qf.push(pass);
  con.query(sql6, [[qf]], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
  res.redirect('/signup');
});


app.get('/blogs',function(req,res){
  con.query('select * from article',function(err,rows,fields){
    console.log(rows);
    res.render('blogs',{rows:rows});
  })
});


app.listen(port,()=> console.log("started"))
