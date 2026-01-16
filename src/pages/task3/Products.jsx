import { useEffect, useState, useCallback } from "react";
import { getAPI_BASE, getAPI_PATH } from "./util.js";
import axios from "axios";
import clsx from "clsx";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/task3/useAuth.js";
import { useLoading } from "@/hooks/task3/useLoading.js";
import { useToast } from "@/hooks/task3/useToast.js";

const API_BASE = getAPI_BASE();
const API_PATH = getAPI_PATH();

function Products() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const { openLoading, closeLoading } = useLoading();
  const { openToast } = useToast();

  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [productModalShow, setProductModalShow] = useState(false);
  // Modal 是新增還是編輯
  const [modalIsNew, setModalIsNew] = useState(false);

  const fetchProductsApi = useCallback(async () => {
    return axios.get(`${API_BASE}/api/${API_PATH}/admin/products`, {
      headers: { Authorization: token },
    });
  }, [token]);

  useEffect(() => {
    const getProducts = async () => {
      openLoading();
      try {
        const response = await fetchProductsApi();
        setProducts(Object.values(response.data.products));
      } catch (error) {
        openToast({
          title: "錯誤",
          bodyMsg:
            error.response?.data?.message || "產品資料載入失敗，請稍後再試",
          textColor: "danger",
        });
        setProducts([]);
      }
      closeLoading();
    };
    getProducts();
  }, [openLoading, closeLoading, openToast, fetchProductsApi]);

  const handleProductModalClose = () => setProductModalShow(false);
  const handleProductModalShow = () => setProductModalShow(true);

  const handleAddNewProduct = () => {
    setModalIsNew(true);
    setProduct({});
    handleProductModalShow();
  };

  const handleEditProduct = (product) => {
    setModalIsNew(false);
    setProduct(product);
    handleProductModalShow();
  };

  const handleDeleteProduct = async (productId) => {
    openLoading();
    try {
      await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${productId}`,
        {
          headers: { Authorization: token },
        }
      );
      await fetchProductsApi();
      const response = await fetchProductsApi();
      setProducts(Object.values(response.data.products));
    } catch (error) {
      openToast({
        title: "錯誤",
        bodyMsg: error.response?.data?.message || "產品刪除失敗，請稍後再試",
        textColor: "danger",
      });
    }
    closeLoading();
  };

  const handleProduct = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    let isError = false;
    const data = {
      title: product.title,
      category: product.category,
      origin_price: Number(product.origin_price),
      price: Number(product.price),
      unit: product.unit,
      description: product.description,
      content: product.content,
      is_enabled: product.is_enabled,
      imageUrl: product.imageUrl,
      imagesUrl: product.imagesUrl || [],
    };
    openLoading();
    if (modalIsNew) {
      try {
        await axios.post(
          `${API_BASE}/api/${API_PATH}/admin/product`,
          { data },
          { headers: { Authorization: token } }
        );
      } catch (error) {
        isError = true;
        openToast({
          title: "錯誤",
          bodyMsg: error.response?.data?.message || "產品新增失敗，請稍後再試",
          textColor: "danger",
        });
      }
    } else {
      try {
        await axios.put(
          `${API_BASE}/api/${API_PATH}/admin/product/${product.id}`,
          { data },
          { headers: { Authorization: token } }
        );
      } catch (error) {
        isError = true;
        openToast({
          title: "錯誤",
          bodyMsg: error.response?.data?.message || "產品更新失敗，請稍後再試",
          textColor: "danger",
        });
      }
    }
    if (!isError) {
      try {
        const res = await fetchProductsApi();
        setProducts(Object.values(res.data.products));
      } catch (error) {
        openToast({
          title: "錯誤",
          bodyMsg:
            error.response?.data?.message || "產品資料載入失敗，請稍後再試",
          textColor: "danger",
        });
        setProducts([]);
      }
      handleProductModalClose();
    }
    closeLoading();
  };

  const handleLogout = async () => {
    openLoading();
    const res = await logout();
    if (res.success) {
      navigate("/task3");
    } else {
      openToast({
        title: "錯誤",
        bodyMsg: res.message,
        textColor: "danger",
      });
    }
    closeLoading();
  };

  // const handleDeleteImg = () => {
  //   setProduct((prev) => ({
  //     ...prev,
  //     imageUrl: "",
  //   }));
  // };

  // const handleAddNewImg = (imgUrl) => {
  //   if (!imgUrl) {
  //     openToast({
  //       title: "警告",
  //       bodyMsg: "請先輸入圖片網址",
  //       textColor: "warning",
  //     });
  //     return;
  //   }
  //   setProduct((prev) => ({
  //     ...prev,
  //     imagesUrl: imgUrl,
  //   }));
  // };

  return (
    <>
      <div className="container task3-products pt-4">
        <div className="text-end">
          <button className="btn btn-primary" onClick={handleAddNewProduct}>
            建立新的產品
          </button>
          <button
            className="btn btn-outline-primary ms-3"
            onClick={handleLogout}
          >
            登出
          </button>
        </div>
        <table className="table align-middle mt-4">
          <thead>
            <tr>
              <th width="120">分類</th>
              <th>產品名稱</th>
              <th width="120" className="text-end">
                原價
              </th>
              <th width="120" className="text-end">
                售價
              </th>
              <th width="100">是否啟用</th>
              <th width="120">編輯</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.category}</td>
                <td>{product.title}</td>
                <td className="text-end">NT${product.origin_price}</td>
                <td className="text-end">NT${product.price}</td>
                <td>
                  {product.is_enabled ? (
                    <span className="text-success">啟用</span>
                  ) : (
                    <span>未啟用</span>
                  )}
                </td>
                <td>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEditProduct(product)}
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">
                  尚無產品資料
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal show={productModalShow} onHide={handleProductModalClose} size="xl">
        <Modal.Header
          className="bg-dark text-white"
          closeButton
          closeVariant="white"
        >
          <h5 id="productModalLabel" className="modal-title">
            <span>{modalIsNew ? "新增產品" : "編輯產品"}</span>
          </h5>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-sm-4">
              <div className="mb-2 text-center">
                <div className="mb-3">
                  <label htmlFor="imageUrl" className="form-label">
                    輸入圖片網址
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    className="form-control"
                    placeholder="請輸入圖片連結"
                    value={product.imageUrl || ""}
                    onChange={handleProduct}
                  />
                </div>
                {product.imageUrl && (
                  <img
                    className={clsx(
                      "img-fluid",
                      product.imageUrl && "task3-primary-image"
                    )}
                    src={product.imageUrl}
                    alt={`${product.title} 主圖`}
                  />
                )}
              </div>
              {/* <div>
                <button
                  className="btn btn-outline-primary btn-sm d-block w-100"
                  onClick={() => handleAddNewImg(product.imageUrl)}
                >
                  新增圖片
                </button>
              </div>
              <div>
                <button
                  className="btn btn-outline-danger btn-sm d-block w-100"
                  onClick={handleDeleteImg}
                >
                  刪除圖片
                </button>
              </div> */}
            </div>
            <div className="col-sm-8">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  標題
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="form-control"
                  placeholder="請輸入標題"
                  value={product.title || ""}
                  onChange={handleProduct}
                />
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label htmlFor="category" className="form-label">
                    分類
                  </label>
                  <input
                    id="category"
                    name="category"
                    type="text"
                    className="form-control"
                    placeholder="請輸入分類"
                    value={product.category || ""}
                    onChange={handleProduct}
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="unit" className="form-label">
                    單位
                  </label>
                  <input
                    id="unit"
                    name="unit"
                    type="text"
                    className="form-control"
                    placeholder="請輸入單位"
                    value={product.unit || ""}
                    onChange={handleProduct}
                  />
                </div>
              </div>

              <div className="row">
                <div className="mb-3 col-md-6">
                  <label htmlFor="origin_price" className="form-label">
                    原價
                  </label>
                  <input
                    id="origin_price"
                    name="origin_price"
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="請輸入原價"
                    value={product.origin_price || 0}
                    onChange={handleProduct}
                  />
                </div>
                <div className="mb-3 col-md-6">
                  <label htmlFor="price" className="form-label">
                    售價
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="請輸入售價"
                    value={product.price || 0}
                    onChange={handleProduct}
                  />
                </div>
              </div>
              <hr />

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  產品描述
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  placeholder="請輸入產品描述"
                  value={product.description || ""}
                  onChange={handleProduct}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="content" className="form-label">
                  說明內容
                </label>
                <textarea
                  id="content"
                  name="content"
                  className="form-control"
                  placeholder="請輸入說明內容"
                  value={product.content || ""}
                  onChange={handleProduct}
                ></textarea>
              </div>
              <div className="mb-3">
                <div className="form-check">
                  <input
                    id="is_enabled"
                    name="is_enabled"
                    className="form-check-input"
                    type="checkbox"
                    checked={product.is_enabled || false}
                    onChange={handleProduct}
                  />
                  <label className="form-check-label" htmlFor="is_enabled">
                    是否啟用
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-dismiss="modal"
            onClick={handleProductModalClose}
          >
            取消
          </button>
          <button
            type="button"
            className="btn btn-primary ms-2"
            onClick={handleSubmit}
          >
            確認
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Products;
