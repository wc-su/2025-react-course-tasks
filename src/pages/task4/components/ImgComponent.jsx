import clsx from "clsx";
import { useState } from "react";
import { useToast } from "@/hooks/task4/useToast.js";
import { useAuth } from "@/hooks/task4/useAuth.js";
import { uploadImage } from "../api.js";

function ImgComponent({
  id,
  name,
  imgUrl = "",
  className,
  altText,
  wrapperClass,
  dataIndex = null,
  needDelete,
  onChange,
  onDelete,
  setDraftProduct,
  isLoading = false,
  onUploadStart,
  onUploadEnd,
}) {
  const { token } = useAuth();
  const { openToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  // 拖曳事件處理
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // 模擬 event 物件給 handleUploadImage 使用
      const fakeEvent = {
        target: {
          files: files,
          name: name,
        },
      };
      handleUploadImage(fakeEvent);
    }
  };

  const handleUploadImage = async (e) => {
    const { files, name } = e.target;
    const file = files[0];
    if (!file) return;

    // 檔案大小限制為 3MB 以下
    if (file.size > 3 * 1024 * 1024) {
      openToast({
        title: "錯誤",
        bodyMsg: "上傳圖片大小不可超過 3MB，請重新選擇圖片",
        textColor: "danger",
      });
      return;
    }

    // 建立本機預覽 URL
    const previewUrl = URL.createObjectURL(file);

    // 通知父元件開始上傳（傳入 previewUrl）
    onUploadStart?.(previewUrl);

    // 先顯示預覽
    setDraftProduct((prev) => ({
      ...prev,
      imageUrl: name === "imageUrl" ? previewUrl : prev.imageUrl,
      imagesUrl:
        name === "imagesUrl"
          ? [...(prev.imagesUrl || []), previewUrl]
          : prev.imagesUrl,
    }));

    const formData = new FormData();
    formData.append("file-to-upload", file);
    try {
      const response = await uploadImage(token, formData);
      const newImageUrl = response.data.imageUrl;

      // 上傳成功後，用伺服器回傳的 URL 取代本機預覽
      setDraftProduct((prev) => ({
        ...prev,
        imageUrl: name === "imageUrl" ? newImageUrl : prev.imageUrl,
        imagesUrl:
          name === "imagesUrl"
            ? prev.imagesUrl.map((url) =>
                url === previewUrl ? newImageUrl : url,
              )
            : prev.imagesUrl,
      }));

      // 釋放本機預覽 URL 的記憶體
      URL.revokeObjectURL(previewUrl);
    } catch (error) {
      // 上傳失敗，移除預覽
      setDraftProduct((prev) => ({
        ...prev,
        imageUrl: name === "imageUrl" ? "" : prev.imageUrl,
        imagesUrl:
          name === "imagesUrl"
            ? prev.imagesUrl.filter((url) => url !== previewUrl)
            : prev.imagesUrl,
      }));

      // 釋放本機預覽 URL 的記憶體
      URL.revokeObjectURL(previewUrl);

      openToast({
        title: "錯誤",
        bodyMsg: error.response?.data?.message || "圖片上傳失敗，請稍後再試",
        textColor: "danger",
      });
    }
    // 通知父元件上傳結束（傳入 previewUrl）
    onUploadEnd?.(previewUrl);
  };

  return (
    <div
      className={clsx(
        wrapperClass,
        "d-inline-flex flex-column position-relative",
      )}
    >
      {imgUrl ? (
        <img className={className} src={imgUrl} alt={`${altText}`} />
      ) : (
        <label
          htmlFor={`formFileInput-${id}`}
          role="button"
          className={clsx(
            className,
            "task4-upload-label d-flex justify-content-center align-items-center bg-white",
            isDragging && "dragging",
          )}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <i className="bi bi-images"></i>
          <input
            id={`formFileInput-${id}`}
            type="file"
            name={name}
            className="form-control visually-hidden"
            accept=".jpg, .jpeg, .png"
            onChange={handleUploadImage}
          ></input>
        </label>
      )}
      <div className="position-relative">
        <input
          id={id}
          type="text"
          name={name}
          data-index={dataIndex}
          style={{ minWidth: 0 }}
          className="form-control w-100"
          placeholder="請輸入圖片連結"
          value={imgUrl}
          onChange={onChange}
        />
        {isLoading && (
          <>
            <div
              className="position-absolute border rounded top-0 start-0 w-100 h-100 bg-white"
              style={{ "--bs-bg-opacity": 0.9 }}
            ></div>
            <div
              className="position-absolute top-50 start-50 translate-middle d-flex"
              style={{ zIndex: 1 }}
            >
              <div
                className="spinner-border text-primary"
                role="status"
                style={{ width: "1rem", height: "1rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <span style={{ fontSize: "0.75rem" }} className="text-nowrap">
                上傳中...
              </span>
            </div>
          </>
        )}
      </div>
      {/* 刪除圖片按鈕，放於右上 */}
      {needDelete && (
        <button
          type="button"
          className="task4-image-btn btn position-absolute top-0 start-100 lh-1"
          onClick={onDelete} // 外部傳入的 onDelete
        >
          <i className="bi bi-x-circle d-block"></i>
        </button>
      )}
    </div>
  );
}

export default ImgComponent;
