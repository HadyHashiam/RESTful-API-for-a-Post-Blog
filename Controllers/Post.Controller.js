const handlerFactory = require('../Controllers/handlersFactory.Controller');
const Post = require('../Models/postModel');
const ApiError = require('../utils/apiError');
const Comment = require('../Models/commentModel'); // تأكد من استيراد Comment


const checkPostOwnership = async (user, postId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError('Post not found', 404);
  }
  if (post.user.toString() !== user.id.toString()) {

    if (user.role !== 'admin') {
      throw new ApiError('You are not authorized to perform this action because you are neither the owner nor an admin', 403);


    } else {
    }
  }
};


// Create a post
exports.createPost = handlerFactory.createOne(Post);

// Get all posts
exports.getAllPosts = handlerFactory.getAll(Post);

// Get a single post
exports.getPost = handlerFactory.getOne(Post);

// Update a post
exports.updatePost = async (req, res, next) => {
  try {
    await checkPostOwnership(req.user.id, req.params.id);
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      status: 'success',
      data: {
        post: updatedPost
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete a post
exports.deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user is authorized to delete the post
    await checkPostOwnership(req.user, id);

    // Find and delete the post
    const post = await Post.findById(id);
    if (!post) {
      return next(new ApiError('No post found with that ID', 404));
    }

    // Remove all comments associated with the post
    await Comment.deleteMany({ _id: { $in: post.comments.map(comment => comment.commentId) } });

    // Delete the post
    await Post.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      message: 'Post and its associated comments deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};



// Get all posts by a specific user
exports.getPostsByUser = async (req, res, next) => {
  const posts = await Post.find({ user: req.params.userId });

  if (!posts || posts.length === 0) {
    return next(new ApiError('No posts found for this user', 404));
  }

  res.status(200).json({ results: posts.length, data: posts });
};



