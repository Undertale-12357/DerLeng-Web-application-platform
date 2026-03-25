//frontend\src\services\place.service.js
import axios from "axios";

const API = "http://localhost:5000/api";

export const getCategories = async () => {
  const res = await axios.get(`${API}/categories`);
  return res.data;
};

export const getProvinces = async () => {
  const res = await axios.get(`${API}/provinces`);
  return res.data;
};