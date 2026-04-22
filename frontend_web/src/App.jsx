import { useState } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDash from "./pages/UserDash";
import AdminDash from "./pages/AdminDash";

export default function App() {
  const [page, setPage] = useState("landing");

  return (
    <>
      {page === "landing" && <Landing setPage={setPage} />}
      {page === "login" && <Login setPage={setPage} />}
      {page === "register" && <Register setPage={setPage} />}
      {page === "userDash" && <UserDash setPage={setPage} />}
      {page === "adminDash" && <AdminDash setPage={setPage} />}
    </>
  );
}
