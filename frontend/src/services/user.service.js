// src/services/user.service.js
import api from "./api";

const uploadProfileImage = async (formData, token) => {
  const res = await api.post("/users/upload-profile", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; // contains { data: { avatar/cover } }
};
const updateUser = async (id, data, token) => {
  const res = await api.put(`/users/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
const changePassword = (id, data, token) => {
  return api.put("/users/change-password", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default {
    uploadProfileImage,
    updateUser,
    changePassword,
};
