require('dotenv').config();

const express = require("express");
const connectDB = require('./Controllers/database.Controller');
const morgan = require("morgan");                   // the logger


const userRoute = require("./routes/user.Route")
const authRoute = require("./routes/auth.Route")
const postRoutes = require('./Routes/post.Route');
const commentRoutes = require('./Routes/comment.Route');

// create express app
const app = express()

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`)
}


app.use("/test", (req, res) => {
  console.log("hey in url test ");
})



app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);




const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server listening on port " + port);
});

