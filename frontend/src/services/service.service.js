import api from "./api";

// Get services of a community
const getByCommunity = async (communityId) => {
  const res = await api.get(`/services/community/${communityId}/service`);
  return res.data;
};

// Create service
const createService = async (data, token) => {
  const res = await api.post(
    `/services/community/${data.communityId}/service`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

// Update service
const updateService = async (id, data, token) => {
  const res = await api.put(`/services/service/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Delete service
const deleteService = async (id, token) => {
  const res = await api.delete(`/services/service/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export default {
  getByCommunity,
  createService,
  updateService,
  deleteService,
};
