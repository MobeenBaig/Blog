import { errorHandler } from "../utils/error.js"
import Post from "../models/post.model.js"
export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a post'));
  }

  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }

  // Clean image field if it's empty
  if (!req.body.image || req.body.image.trim() === '') {
    delete req.body.image; // Let Mongoose use default
  }

  // Generate slug from title
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, '');

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};



export const deletepost = async (req, res, next) => {
  try {
    // Check if the user is admin
    if (!req.user || !req.user.isAdmin) {
      return next(errorHandler(403, 'Only admins can delete posts'));
    }

    const { postId, userId } = req.params;

    // Find the post by ID and verify the userId matches
    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, 'Post not found'));
    }

    // Optional check: ensure the post's userId matches the one provided
    if (post.userId !== userId) {
      return next(errorHandler(403, 'Post does not belong to this user'));
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
};



export const updatepost = async (req, res, next) => {
  const { postId, userId } = req.params;

  try {
    // Find the post to update
    const post = await Post.findById(postId);
    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    // Check if the current user is the owner of the post or an admin
    if (req.user.id !== post.userId.toString() && !req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to update this post"));
    }

    // Update the post fields
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;
    post.image = req.body.image || post.image;

    // Optional: update slug based on new title
    if (req.body.title) {
      post.slug = req.body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-z0-9\-]/g, "");
    }

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);

  } catch (error) {
    next(error);
  }
};
