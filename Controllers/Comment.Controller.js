const handlerFactory = require('../Controllers/handlersFactory.Controller');
const Comment = require('../Models/commentModel');
const ApiError = require('../utils/apiError');
const Post = require('../Models/postModel');

// Create a comment
exports.createComment = async (req, res, next) => {
  try {
    const comment = await Comment.create(req.body);

    // Add comment reference to the corresponding post
    await Post.findByIdAndUpdate(req.body.postId, {
      $push: { comments: { commentId: comment._id, content: comment.content, userId: comment.userId } }
    });

    res.status(201).json({
      status: 'success',
      data: {
        comment
      }
    });
  } catch (error) {
    next(error);
  }
};
// Get all comments
exports.getAllComments = handlerFactory.getAll(Comment);

// Get a single comment
exports.getComment = handlerFactory.getOne(Comment);

// Check ownership
const checkCommentOwnership = async (user, commentId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError('Comment not found', 404);
  }
  if (comment.userId.toString() !== user.id.toString()) {
    if (user.role !== 'admin') {
      throw new ApiError('You are not authorized to perform this action because you are neither the owner nor an admin', 403);
    } else {
    }
  }
};


// Update a comment
exports.updateComment = async (req, res, next) => {
  try {
    await checkCommentOwnership(req.user.id, req.params.id);
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      status: 'success',
      data: {
        comment: updatedComment
      }
    });
  } catch (error) {
    next(error);
  }
};


// Delete a comment

exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    await checkCommentOwnership(req.user, id);
    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return next(new ApiError('No comment found with that ID', 404));
    }

    // Remove comment reference from the corresponding post
    await Post.findByIdAndUpdate(deletedComment.postId, {
      $pull: { comments: { commentId: deletedComment._id } }
    });

    res.status(200).json({
      status: 'success',
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};




