import { useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDash from "./pages/UserDash";
import AdminDash from "./pages/AdminDash";
import Receipt from "./pages/Receipt"; // <-- 1. Import the new page

function AppRoutes() {
  const navigate = useNavigate();

  // <-- 2. Hold the receipt data in the router state
  const [receiptData, setReceiptData] = useState(null);

  const setPage = (pageName) => {
    if (pageName === "landing") navigate("/");
    else if (pageName === "login") navigate("/login");
    else if (pageName === "register") navigate("/register");
    else if (pageName === "userDash") navigate("/dashboard");
    else if (pageName === "adminDash") navigate("/admin");
    else if (pageName === "receipt")
      navigate("/receipt"); // <-- 3. Add receipt bridge
    else navigate(`/${pageName.toLowerCase()}`);
  };

  return (
    <Routes>
      <Route path="/" element={<Landing setPage={setPage} />} />
      <Route path="/login" element={<Login setPage={setPage} />} />
      <Route path="/register" element={<Register setPage={setPage} />} />

      {/* 4. Pass setReceiptData to UserDash so it can save the order */}
      <Route
        path="/dashboard"
        element={<UserDash setPage={setPage} setReceiptData={setReceiptData} />}
      />

      <Route path="/admin" element={<AdminDash setPage={setPage} />} />

      {/* 5. The new Receipt Route */}
      <Route
        path="/receipt"
        element={<Receipt setPage={setPage} data={receiptData} />}
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return <AppRoutes />;
}
