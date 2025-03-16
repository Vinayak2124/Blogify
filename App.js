require("dotenv").config();

const express = require('express')
const path = require('path')
const app = express()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const Blog = require("./models/blog")
mongoose
    .connect(process.env.MONGO_URL)
    .then(e => console.log("MongoDB Connected"));

const port = process.env.PORT ||  8000;
const userRouter = require('./routes/user')
const blogRouter = require('./routes/blog')
const { checkForAuthenticationCookie } = require('./middleware/authentication')
app.use(express.static(path.resolve('./public')))
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));

app.use('/user', userRouter)
app.use('/blog', blogRouter)





app.get('/', async(req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});


app.listen(port, () => console.log(`server is running on port ${port}`));
