import communityPostService from "../services/communityPost.service.js";
export const createCommunityPost = async (req, res) => {
  try {
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    const post = await communityPostService.create({
      admin_id: req.user._id,
      province_id: req.body.province_id,
      title: req.body.title,
      content: req.body.content,
      location_description: req.body.location_description,
      location_link: req.body.location_link,
      images: imageUrls,
    });

    res.status(201).json({
      message: "Community post created successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllCommunityPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await communityPostService.getAll(page, limit);

    res.json({
      success: true,
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("GET COMMUNITY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCommunityPostById = async (req, res) => {
  try {
    const post = await communityPostService.getById(req.params.id);

    res.status(200).json({
      data: post,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const deleteCommunityPost = async (req, res) => {
  try {
    await communityPostService.remove(
      req.params.id,
      req.user._id,
      req.user.role,
    );

    res.status(200).json({
      message: "Community post deleted successfully",
    });
  } catch (error) {
    res.status(403).json({
      message: error.message,
    });
  }
};

export const updateCommunityPost = async (req, res) => {
  try {
    const updatedPost = await communityPostService.update(
      req.params.id,
      req.user._id,
      req.user.role,
      req.body,
    );

    res.status(200).json({
      message: "Community post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    res.status(403).json({
      message: error.message,
    });
  }
};