const express = require('express')
const path = require('path')
const app = express()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
mongoose.connect('mongodb://localhost:27017/blogify').then(e => console.log("MongoDB Connected"));

const port = 8000;
const userRouter = require('./routes/user')
const blogRouter = require('./routes/blog')
const { checkForAuthenticationCookie } = require('./middleware/authentication')

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use('/user', userRouter)

app.use('/blog', blogRouter)


app.get('/', (req, res) => {
    res.render("home", {
    user: req.user,
    });
});


app.listen(port, () => console.log(`server is running on port ${port}`));
