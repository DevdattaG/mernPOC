import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import logger from "morgan";
import { getSecret } from "./secret";
import Comment from "./models/comment";

const app = express();
const router = express.Router();
const API_PORT = process.env.API_PORT || 3001;

mongoose.connect(getSecret('dbUri'));
var db = mongoose.connection;
db.on('error', console.error.bind(console,'connection establishment error'));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(logger('dev'));

router.get('/', (req,res) => {
    res.json({'message':'I am on'});
});

router.get('/comments', (req,res) => {
    Comment.find((err, comments) => {
        if(err)
            return res.json({success:false});
        return res.json({success:true, data:comments});
    });
});

router.post("/comments", (req, res)=>{
    const comment = new Comment();
    // body parser lets us use the req.body
    const { author, text } = req.body;
    if (!author || !text) {
      // we should throw an error. we can do this check on the front end
      return res.json({
        success: false,
        error: 'You must provide an author and comment'
      });
    }
    comment.author = author;
    comment.text = text;
    comment.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });    
    });
});

router.put('/comments/:commentId', (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
      return res.json({ success: false, error: 'No comment id provided' });
    }
    Comment.findById(commentId, (error, comment) => {
      if (error) return res.json({ success: false, error });
      const { author, text } = req.body;
      if (author) comment.author = author;
      if (text) comment.text = text;
      comment.save(error => {
        if (error) return res.json({ success: false, error });
        return res.json({ success: true });
      });
    });
  });
  
  router.delete('/comments/:commentId', (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
      return res.json({ success: false, error: 'No comment id provided' });
    }
    Comment.remove({ _id: commentId }, (error, comment) => {
      if (error) return res.json({ success: false, error });
      return res.json({ success: true });
    });
  });
  
app.use('/api',router);
app.listen(API_PORT, () => console.log("listening on port : "+ API_PORT));