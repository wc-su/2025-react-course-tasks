import Modal from "react-bootstrap/Modal";
import ImgComponent from "./ImgComponent.jsx";
import { useLoading } from "@/hooks/task4/useLoading.js";
import { useToast } from "@/hooks/task4/useToast.js";
import { useAuth } from "@/hooks/task4/useAuth.js";
import { fetchProducts, updateProduct, createProduct } from "../api.js";
import { Fragment, useState } from "react";

function ModalComponent({
  show,
  onClose,
  isNew,
  product,
  setProducts,
  setPagination,
  currentPage = 1,
}) {
  const [draftProduct, setDraftProduct] = useState({ ...product });
  const [uploadingUrls, setUploadingUrls] = useState(new Set());

  // Loading helpers - 追蹤正在上傳的 URL
  const startLoading = (url) => {
    setUploadingUrls((prev) => new Set(prev).add(url));
  };

  const stopLoading = (url) => {
    setUploadingUrls((prev) => {
      const next = new Set(prev);
      next.delete(url);
      return next;
    });
  };

  const { token } = useAuth();
  const { openLoading, closeLoading } = useLoading();
  const { openToast } = useToast();

  const handleSubmit = async () => {
    let isError = false;
    const data = {
      title: draftProduct.title,
      category: draftProduct.category,
      origin_price: Number(draftProduct.origin_price),
      price: Number(draftProduct.price),
      unit: draftProduct.unit,
      description: draftProduct.description,
      content: draftProduct.content,
      is_enabled: draftProduct.is_enabled ? 1 : 0,
      imageUrl: draftProduct.imageUrl,
      imagesUrl: draftProduct.imagesUrl || [],
      starRating: Number(draftProduct.starRating),
    };
    openLoading();
    if (isNew) {
      try {
        await createProduct(token, data);
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
        await updateProduct(token, draftProduct.id, data);
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
        const res = await fetchProducts(token, currentPage);
        setProducts(res.data.products);
        setPagination(res.data.pagination);
      } catch (error) {
        openToast({
          title: "錯誤",
          bodyMsg:
            error.response?.data?.message || "產品資料載入失敗，請稍後再試",
          textColor: "danger",
        });
        setProducts([]);
      }
      onClose();
    }
    closeLoading();
  };

  const handleProduct = (e) => {
    const { name, value, type, checked, dataset } = e.target;
    const dataIndex = dataset.index;
    setDraftProduct((prev) => {
      if (name === "imagesUrl") {
        const imagesUrl = prev.imagesUrl ? [...prev.imagesUrl] : [];
        if (dataIndex !== undefined) {
          // 編輯已有圖片：若 value 為空則移除，否則更新
          if (value.trim() === "") {
            imagesUrl.splice(dataIndex, 1);
          } else {
            imagesUrl[dataIndex] = value;
          }
        } else {
          // 新增圖片：只有非空值才加入
          if (value.trim() !== "") {
            imagesUrl.push(value);
          }
        }
        return { ...prev, [name]: imagesUrl };
      }
      return { ...prev, [name]: type === "checkbox" ? checked : value };
    });
  };

  return (
    <Modal show={show} onHide={onClose} size="xl">
      <Modal.Header
        className="bg-dark text-white"
        closeButton
        closeVariant="white"
      >
        <h5 id="productModalLabel" className="modal-title">
          <span>{isNew ? "新增產品" : "編輯產品"}</span>
        </h5>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-lg-4">
            <div className="mb-2 mt-2 text-center">
              <ImgComponent
                id="imageUrl"
                name="imageUrl"
                imgUrl={draftProduct.imageUrl}
                wrapperClass="task4-primary-image-wrapper"
                className="task4-primary-image img-fluid object-fit-contain mb-2"
                altText={`${draftProduct.title} 主圖`}
                needDelete={draftProduct.imageUrl !== ""}
                onChange={handleProduct}
                onDelete={() =>
                  setDraftProduct((prev) => ({ ...prev, imageUrl: "" }))
                }
                setDraftProduct={setDraftProduct}
                isLoading={uploadingUrls.has(draftProduct.imageUrl)}
                onUploadStart={startLoading}
                onUploadEnd={stopLoading}
              />
              <div className="border-top pt-3 mt-3">
                <p className="fw-bold">
                  更多圖片
                  <span
                    className="text-secondary fw-medium mt-1"
                    style={{ fontSize: "0.9rem" }}
                  >
                    ({draftProduct.imagesUrl?.length} / 5)
                  </span>
                </p>
                <div className="d-flex flex-wrap gap-3">
                  {draftProduct.imagesUrl?.length > 0 &&
                    draftProduct.imagesUrl.map((imgUrl, index) => (
                      <ImgComponent
                        key={index}
                        id={`imagesUrl-${index}`}
                        name="imagesUrl"
                        dataIndex={index}
                        imgUrl={imgUrl}
                        wrapperClass="task4-images-wrapper"
                        className="task4-images img-fluid object-fit-cover mb-1"
                        altText={`${draftProduct.title} 附圖-${index + 1}`}
                        needDelete={true}
                        onChange={handleProduct}
                        onDelete={() => {
                          setDraftProduct((prev) => {
                            const imagesUrl = prev.imagesUrl
                              ? [...prev.imagesUrl]
                              : [];
                            imagesUrl.splice(index, 1);
                            return { ...prev, imagesUrl };
                          });
                        }}
                        setDraftProduct={setDraftProduct}
                        isLoading={uploadingUrls.has(imgUrl)}
                        onUploadStart={startLoading}
                        onUploadEnd={stopLoading}
                      />
                    ))}
                  {/* 新增圖片 - imagesUrl 有圖片在上傳時隱藏 */}
                  {draftProduct.imagesUrl?.length < 5 &&
                    !draftProduct.imagesUrl?.some((url) =>
                      uploadingUrls.has(url),
                    ) && (
                      <ImgComponent
                        id="imagesUrl-temp"
                        name="imagesUrl"
                        dataIndex={draftProduct.imagesUrl?.length}
                        altText={`${draftProduct.title} 附圖-新增`}
                        imgUrl=""
                        wrapperClass="task4-images-wrapper"
                        className="task4-images object-fit-cover mb-1"
                        needDelete={false}
                        onChange={handleProduct}
                        setDraftProduct={setDraftProduct}
                        isLoading={false}
                        onUploadStart={startLoading}
                        onUploadEnd={stopLoading}
                      />
                    )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
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
                value={draftProduct.title || ""}
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
                  value={draftProduct.category || ""}
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
                  value={draftProduct.unit || ""}
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
                  value={draftProduct.origin_price || 0}
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
                  value={draftProduct.price || 0}
                  onChange={handleProduct}
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex mb-3">
                <p className="me-2 mb-0">評價星級</p>
                <div className="d-flex flex-row-reverse task4-star-rating">
                  {Array.from({ length: 5 }).map((_, idx) => {
                    const index = 5 - idx;
                    return (
                      <Fragment key={index}>
                        <input
                          id={`rating${index}`}
                          type="radio"
                          name="starRating"
                          className="d-none"
                          value={index}
                          onChange={handleProduct}
                          checked={Number(draftProduct.starRating) === index}
                        />
                        <label htmlFor={`rating${index}`}>
                          <i key={idx} className="bi bi-star-fill me-1"></i>
                        </label>
                      </Fragment>
                    );
                  })}
                </div>
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
                value={draftProduct.description || ""}
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
                value={draftProduct.content || ""}
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
                  checked={draftProduct.is_enabled || false}
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
          onClick={onClose}
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
  );
}

export default ModalComponent;
