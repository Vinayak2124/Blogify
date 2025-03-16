const { Router } = require("express");
const Blog = require("../models/blog");
const multer = require('multer')
const path = require("path")
// const Blog = require("../models/blog")
const Comment = require("../models/comment")

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(`./public/uploads/`));
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
})
const upload = multer({ storage: storage })

router.get("/add-new", (req, res) => {
    // console.log(req.user);
    return res.render("addblog", {
       user : req.user,
    }); 
    
});
router.get('/:id', async(req, res) => {
    const blog = await Blog.findById({ _id: req.params.id }).populate("createdBy");
    const comments = await Comment.find({ blogId: req.params.id }).populate("createdBy");
    console.log(blog);
    // console.log(req.user);
    
    return res.render("blog", {
        user: req.user,
        blog,   
        comments,
        
    });
});
router.post("/", upload.single("coverImage"), async(req, res) => {
    const { title, body } = req.body;
   const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
         coverImageURL: `uploads/${req.file.filename}`,
    });

    // console.log(req.body);
    // console.log(req.file);
    return res.redirect('/');
})


router.post('/comment/:blogId', async (req, res) => {
    const comment = await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    })
    return res.redirect(`/blog/${req.params.blogId}`);
});

// router.get('/', async(req, res) => {
//     const allBlogs = await Blog.find({});
//     res.render("home", {
//         user: req.user,
//         blogs: allBlogs,
//     });
// });
module.exports = router;