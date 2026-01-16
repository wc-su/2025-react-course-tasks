# Task2 開發筆記

**日期：2026 年 1 月 2 日**

---

## 問題 1：Loading 一直跑的原因

### 症狀

Products 頁面的 loading 畫面一直顯示，無法停止。

### 根本原因

`checkAuth` 函式在 `Task2.jsx` 中**沒有用 `useCallback` 包裝**，導致每次 Task2 渲染時都會產生新的函式參考。

### 無限循環流程

```
Task2 渲染
→ checkAuth 是新函式
→ Products 的 useEffect 依賴改變
→ useEffect 重新執行
→ setIsLoading(true)
→ Task2 重新渲染
→ 迴圈...
```

### 解決方案

在 `Task2.jsx` 中用 `useCallback` 包裝 `checkAuth`：

```jsx
import { useCallback } from "react";

const checkAuth = useCallback(async (token) => {
  if (!token) return false;

  setIsLoading(true);
  try {
    await axios.post(
      `${API_BASE}/api/user/check`,
      {},
      { headers: { Authorization: token } }
    );
  } catch (err) {
    setShowToast(true);
    setToastInfo({
      title: "錯誤",
      bodyMsg: `驗證失敗: ${err?.response?.data?.message || "未知錯誤"}`,
      textColor: "danger",
    });
    return false;
  } finally {
    setIsLoading(false);
  }

  return true;
}, []); // 空依賴陣列，確保函式參考穩定
```

### 為什麼有效

- 函式參考保持穩定
- Products 的 useEffect 依賴不會改變
- useEffect 只執行一次
- loading 不會重複觸發

---

## 問題 2：需要用 React.memo 嗎？

### 答案

**不需要**。原因有兩個：

### 原因 1：Outlet 不是傳統的父子組件關係

傳統做法（需要考慮 React.memo）：

```jsx
function Parent() {
  return <Child data={data} />; // 通過 props 傳遞
}
```

目前的做法（不需要 React.memo）：

```jsx
function Task2() {
  return <Outlet context={{ ... }} />;  // 通過 context 傳遞
}
```

### 原因 2：即使用 React.memo 也無效

```jsx
// 即使這樣寫
const Products = React.memo(function Products() {
  const { checkAuth } = useOutletContext(); // 使用 context
  // ...
});

// 當 Task2 重新渲染時：
// 1. context 內容改變
// 2. useOutletContext() 偵測到改變
// 3. Products 還是會重新渲染
// React.memo 擋不住 context 的改變！
```

### React.memo 有效 vs 無效

| 情境                         | 有效？  | 說明                         |
| ---------------------------- | ------- | ---------------------------- |
| 通過 **props** 傳遞資料      | ✅ 有效 | React.memo 可以比對 props    |
| 通過 **context** 傳遞資料    | ❌ 無效 | Context 改變時會強制重新渲染 |
| 通過 **Outlet context** 傳遞 | ❌ 無效 | 同上                         |
| 使用 **useContext** hook     | ❌ 無效 | 同上                         |

### 目前的最佳做法

使用 `useCallback` 確保函式參考穩定：

```jsx
// Task2.jsx
const checkAuth = useCallback(async (token) => {
  // ...
}, []); // 確保函式參考穩定

// Products.jsx
const { checkAuth } = useOutletContext();
useEffect(() => {
  // ...
}, [checkAuth]); // 依賴穩定，不會無限循環
```

---

## 總結

**useCallback 的適用情境**

1. 函式會被傳給子組件，並放入 useEffect 依賴 ✅
2. 函式會被傳給 React.memo 包裝的子組件 ✅
3. 函式只在事件處理中使用 ❌ 不需要

**React.memo 的限制**

- 只對 props 有效
- Context 改變時無法阻止重新渲染
- 與 useContext 或 useOutletContext 搭配時無用

**本次應用**

- ✅ 使用 `useCallback` 包裝 `checkAuth`
- ❌ 不需要 `React.memo`
- ✅ 解決了 loading 無限循環的問題
