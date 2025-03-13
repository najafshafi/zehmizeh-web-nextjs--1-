"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/redux/store";
import { login, logout } from "@/store/redux/authSlice";

const AuthStatus = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Auth Status: {isAuthenticated ? "Logged In" : "Logged Out"}</h2>
      <button onClick={() => dispatch(login())} className="bg-blue-500 px-4 py-2 rounded">
        Login
      </button>
      <button onClick={() => dispatch(logout())} className="bg-red-500 px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
};

export default AuthStatus;