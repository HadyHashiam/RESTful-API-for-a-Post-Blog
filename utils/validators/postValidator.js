const { body, param } = require('express-validator');

exports.createPostValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
];

exports.updatePostValidator = [
  param('id').isMongoId().withMessage('Invalid post ID'),
  body('title').optional().notEmpty().withMessage('Title must not be empty'),
  body('content').optional().notEmpty().withMessage('Content must not be empty'),
];

exports.deletePostValidator = [
  param('id').isMongoId().withMessage('Invalid post ID'),
];

exports.getPostValidator = [
  param('id').isMongoId().withMessage('Invalid post ID'),
];
