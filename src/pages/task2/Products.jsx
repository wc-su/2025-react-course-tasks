import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router";

function Products() {
  const navigate = useNavigate();
  const {
    API_BASE,
    API_PATH,
    setIsLoading,
    setShowToast,
    setToastInfo,
    checkAuth,
  } = useOutletContext();

  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);

  const getProducts = useCallback(async () => {
    const token = localStorage.getItem("hexToken");
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products/all`,
        {
          headers: { Authorization: token },
        }
      );
      setProducts(Object.values(res.data.products));
    } catch (err) {
      setShowToast(true);
      setToastInfo({
        title: "錯誤",
        bodyMsg: `取得產品失敗: ${err?.response?.data?.message || "未知錯誤"}`,
        textColor: "danger",
      });
      setProducts([]);
      setTempProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE, API_PATH, setIsLoading, setShowToast, setToastInfo]);

  useEffect(() => {
    const token = localStorage.getItem("hexToken");

    // 驗證 token 並取得產品
    const initProducts = async () => {
      const isAuth = await checkAuth(token);
      if (!isAuth) {
        navigate("/task2");
        return;
      }
      // 取得產品列表
      await getProducts();
    };

    initProducts();
  }, [navigate, API_BASE, getProducts, checkAuth]);

  return (
    <div className="container py-5 task2-products">
      <div className="row">
        <div className="col-12 text-end mb-5">
          <button
            type="button"
            className="btn btn-outline-primary me-2"
            onClick={() => {
              setProducts([]);
              setTempProduct(null);
            }}
          >
            清除產品列表
          </button>
          <button
            type="button"
            className="btn btn-outline-primary me-5"
            onClick={getProducts}
          >
            重新取得產品列表
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              localStorage.removeItem("hexToken");
              navigate("/task2");
            }}
          >
            登出
          </button>
        </div>
        <div className="col-md-6">
          <h2>產品列表</h2>
          <table className="table">
            <thead>
              <tr>
                <th>產品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>查看細節</th>
              </tr>
            </thead>
            <tbody>
              {products && products.length > 0 ? (
                products.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.origin_price}</td>
                    <td>{item.price}</td>
                    <td>{item.is_enabled ? "啟用" : "未啟用"}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => setTempProduct(item)}
                      >
                        查看細節
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">尚無產品資料</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="col-md-6">
          <h2>單一產品細節</h2>
          {tempProduct ? (
            <div className="card mb-3">
              <img
                src={tempProduct.imageUrl}
                className="card-img-top task2-primary-image"
                alt="主圖"
              />
              <div className="card-body">
                <h5 className="card-title">
                  {tempProduct.title}
                  <span className="badge bg-primary ms-2">
                    {tempProduct.category}
                  </span>
                </h5>
                <p className="card-text">商品描述：{tempProduct.description}</p>
                <p className="card-text">商品內容：{tempProduct.content}</p>
                <div className="d-flex">
                  <p className="card-text text-secondary">
                    <del>{tempProduct.origin_price}</del>
                  </p>
                  元 / {tempProduct.price} 元
                </div>
                <h5 className="mt-3">更多圖片：</h5>
                <div className="d-flex flex-wrap">
                  {tempProduct.imagesUrl?.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      className="task2-images"
                      alt="副圖"
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-secondary">請選擇一個商品查看</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Products;
