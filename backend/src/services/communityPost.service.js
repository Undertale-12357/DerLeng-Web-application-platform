import CommunityPost from "../models/CommunityPost.js";

const create = async ({
  admin_id,
  province_id,
  title,
  content,
  location_description,
  location_link,
  images,
}) => {
  return await CommunityPost.create({
    admin_id,
    province_id,
    title,
    content,
    location_description,
    location_link,
    images,
  });
};

const getAll = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const total = await CommunityPost.countDocuments();

  const posts = await CommunityPost.find()
    .populate("admin_id", "username email role")
    .populate("province_id", "province_name")
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit);

  return {
    posts,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  };
};

const getById = async (id) => {
  const post = await CommunityPost.findById(id)
    .populate("admin_id", "username email role")
    .populate("province_id", "province_name");

  if (!post) {
    throw new Error("Community post not found");
  }

  return post;
};

const remove = async (post_id, admin_id, role) => {
  const post = await CommunityPost.findById(post_id);

  if (!post) {
    throw new Error("Community post not found");
  }

  if (post.admin_id.toString() !== admin_id.toString() && role !== "admin") {
    throw new Error("Not authorized to delete this community post");
  }

  await CommunityPost.findByIdAndDelete(post_id);
};

const update = async (post_id, admin_id, role, updateData) => {
  const post = await CommunityPost.findById(post_id);

  if (!post) {
    throw new Error("Community post not found");
  }

  if (post.admin_id.toString() !== admin_id.toString() && role !== "admin") {
    throw new Error("Not authorized to edit this community post");
  }

  const updatedPost = await CommunityPost.findByIdAndUpdate(
    post_id,
    updateData,
    {
      new: true,
    },
  );

  return updatedPost;
};

export default {
  create,
  getAll,
  getById,
  remove,
  update,
};
