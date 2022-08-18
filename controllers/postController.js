const Post = require('../models/postModel')

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts,
      },
    })
  } catch (error) {
    res.status(error?.status || 500).json({
      status: 'failed',
      error: error?.message,
    })
  }
}

const getOnePost = async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id)

    res.status(200).json({
      status: 'success',
      data: {
        posts,
      },
    })
  } catch (error) {
    res.status(error?.status || 500).json({
      status: 'failed',
      error: error?.message,
    })
  }
}

const createPost = async (req, res) => {
  try {
    const posts = await Post.create(req.body)

    res.status(200).json({
      status: 'success',
      data: {
        posts,
      },
    })
  } catch (error) {
    res.status(error?.status || 500).json({
      status: 'failed',
      error: error?.message,
    })
  }
}

const updatePost = async (req, res) => {
  try {
    const posts = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      status: 'success',
      data: {
        posts,
      },
    })
  } catch (error) {
    res.status(error?.status || 500).json({
      status: 'failed',
      error: error?.message,
    })
  }
}

const deletePost = async (req, res) => {
  try {
    const posts = await Post.findByIdAndDelete(req.params.id)

    res.status(200).json({
      status: 'success',
    })
  } catch (error) {
    res.status(error?.status || 500).json({
      status: 'failed',
      error: error?.message,
    })
  }
}

module.exports = {
  getAllPosts,
  getOnePost,
  createPost,
  updatePost,
  deletePost,
}
