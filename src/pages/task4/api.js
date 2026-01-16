import axios from "axios";
import { getAPI_BASE, getAPI_PATH } from "@/utils/util.js";

const API_BASE = getAPI_BASE();
const API_PATH = getAPI_PATH();

// 產品
export const fetchProducts = (token, page = 1) =>
  axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`, {
    headers: { Authorization: token },
  });

export const deteteProduct = (token, productId) =>
  axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${productId}`, {
    headers: { Authorization: token },
  });

export const updateProduct = (token, productId, data) =>
  axios.put(
    `${API_BASE}/api/${API_PATH}/admin/product/${productId}`,
    { data },
    { headers: { Authorization: token } },
  );

export const createProduct = (token, data) =>
  axios.post(
    `${API_BASE}/api/${API_PATH}/admin/product`,
    { data },
    { headers: { Authorization: token } },
  );

// 上傳圖片
export const uploadImage = (token, formData) =>
  axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`, formData, {
    headers: {
      Authorization: token,
      "Content-Type": "multipart/form-data",
    },
  });
