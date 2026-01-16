import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Dropdown from "react-bootstrap/Dropdown";
// api
import { fetchProducts, deteteProduct } from "./api.js";
// util
import { defaultProductData } from "./util.js";
// hooks
import { useAuth } from "@/hooks/task4/useAuth.js";
import { useLoading } from "@/hooks/task4/useLoading.js";
import { useToast } from "@/hooks/task4/useToast.js";
// components
import ModalComponent from "./components/ModalComponent.jsx";
import Pagination from "./components/Pagination.jsx";

function Products() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const { openLoading, closeLoading } = useLoading();
  const { openToast } = useToast();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [product, setProduct] = useState({});
  const [productModalShow, setProductModalShow] = useState(false);
  // Modal 是新增還是編輯
  const [modalIsNew, setModalIsNew] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      openLoading();
      try {
        const response = await fetchProducts(token);
        setProducts(response.data.products);
        setPagination(response.data.pagination);
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
  }, [openLoading, closeLoading, openToast, token]);

  const handleProductModalClose = () => setProductModalShow(false);

  const handleOpenModal = (isNew, product = {}) => {
    setModalIsNew(isNew);
    setProduct({
      ...defaultProductData(),
      ...product,
    });
    setProductModalShow(true);
  };

  const handleDeleteProduct = async (productId) => {
    openLoading();
    try {
      await deteteProduct(token, productId);
      const response = await fetchProducts(token, pagination.current_page);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      openToast({
        title: "錯誤",
        bodyMsg: error.response?.data?.message || "產品刪除失敗，請稍後再試",
        textColor: "danger",
      });
    }
    closeLoading();
  };

  const handleLogout = async () => {
    openLoading();
    const res = await logout();
    if (res.success) {
      navigate("/task4");
    } else {
      openToast({
        title: "錯誤",
        bodyMsg: res.message,
        textColor: "danger",
      });
    }
    closeLoading();
  };

  const handlePageChange = async (page) => {
    openLoading();
    try {
      const response = await fetchProducts(token, page);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
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

  return (
    <>
      <div className="container task4-products pt-4">
        <div className="text-end">
          <button
            className="btn btn-primary"
            onClick={() => handleOpenModal(true)}
          >
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
                  <div className="btn-group task4-btn-group">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm text-nowrap"
                      onClick={() => handleOpenModal(false, product)}
                    >
                      編輯
                    </button>
                    <Dropdown className="btn-group">
                      <Dropdown.Toggle
                        variant=""
                        className="btn-outline-danger btn-sm text-nowrap"
                      >
                        刪除
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end">
                        <Dropdown.Item eventKey="1">取消</Dropdown.Item>
                        <Dropdown.Item
                          eventKey="2"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          確認刪除
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
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
        <Pagination
          totalPages={pagination.total_pages}
          currentPage={pagination.current_page}
          hasNext={pagination.has_next}
          hasPre={pagination.has_pre}
          position="end"
          onPageChange={handlePageChange}
        />
      </div>
      {productModalShow && (
        <ModalComponent
          show={productModalShow}
          onClose={handleProductModalClose}
          isNew={modalIsNew}
          product={product}
          setProduct={setProduct}
          setProducts={setProducts}
          setPagination={setPagination}
          currentPage={pagination.current_page}
        />
      )}
    </>
  );
}

export default Products;
