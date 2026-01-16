import clsx from "clsx";

// 產生頁碼陣列，包含數字和省略號 "..."
const getPageNumbers = (totalPages, currentPage) => {
  // 5 頁以下，直接顯示全部
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 6 頁以上，需要處理省略號
  if (currentPage <= 3) {
    // 靠近開頭：1 2 3 4 ... lastPage
    return [1, 2, 3, 4, "...", totalPages];
  } else if (currentPage >= totalPages - 2) {
    // 靠近結尾：1 ... (lastPage-3) (lastPage-2) (lastPage-1) lastPage
    return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  } else {
    // 在中間：1 ... (cur-1) cur (cur+1) ... lastPage
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  }
};

function Pagination({
  totalPages = 1,
  currentPage = 1,
  hasNext = false,
  hasPre = false,
  onPageChange,
  position = "start", // 'start' (default) | 'center' | 'end'
}) {
  const pages = getPageNumbers(totalPages, currentPage);

  return (
    <nav aria-label="Page navigation">
      <ul
        className={clsx(
          "pagination",
          position === "start" && "justify-content-start",
          position === "center" && "justify-content-center",
          position === "end" && "justify-content-end",
        )}
      >
        {/* 上一頁 */}
        <li className={clsx("page-item", !hasPre && "disabled")}>
          <a
            className="page-link"
            href="#"
            aria-label="Previous"
            onClick={(e) => {
              e.preventDefault();
              if (hasPre) onPageChange(currentPage - 1);
            }}
          >
            <span aria-hidden="true">&lt;</span>
          </a>
        </li>

        {/* 頁碼 */}
        {pages.map((page, index) => (
          <li
            key={index}
            className={clsx(
              "page-item",
              page === "..." && "disabled",
              currentPage === page && "active",
            )}
          >
            <a
              className="page-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page !== "...") onPageChange(page);
              }}
            >
              {page}
            </a>
          </li>
        ))}

        {/* 下一頁 */}
        <li className={clsx("page-item", !hasNext && "disabled")}>
          <a
            className="page-link"
            href="#"
            aria-label="Next"
            onClick={(e) => {
              e.preventDefault();
              if (hasNext) onPageChange(currentPage + 1);
            }}
          >
            <span aria-hidden="true">&gt;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;

// --- IGNORE ---
// 1 pages: < 1 >
// 2 pages: < 1 2 >
// 3 pages: < 1 2 3 >
// 4 pages: < 1 2 3 4 >
// 5 pages: < 1 2 3 4 5 >
// 6 pages, 1 cur: < 1 2 3 4 ... 6 >
// 6 pages, 2 cur: < 1 2 3 4 ... 6 >
// 6 pages, 3 cur: < 1 2 3 4 ... 6 >
// 6 pages, 4 cur: < 1 ... 3 4 5 6 >
// 6 pages, 5 cur: < 1 ... 3 4 5 6 >
// 6 pages, 6 cur: < 1 ... 3 4 5 6 >
// 7 pages, 1 cur: < 1 2 3 4 ... 7 >
// 7 pages, 2 cur: < 1 2 3 4 ... 7 >
// 7 pages, 3 cur: < 1 2 3 4 ... 7 >
// 7 pages, 4 cur: < 1 ... 3 4 5 ... 7 >
// 7 pages, 5 cur: < 1 ... 4 5 6 7 >
// 7 pages, 6 cur: < 1 ... 4 5 6 7 >
// 7 pages, 7 cur: < 1 ... 4 5 6 7 >
// --- IGNORE ---
