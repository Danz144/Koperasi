import React, { useEffect, useState, useRef } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import { isTokenValid, clearAuthData, parseJwt } from "../utils/authToken";

const PrivateRoute = () => {
  const [isValid, setIsValid] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      if (!isTokenValid(token)) {
        await Swal.fire({
          icon: "warning",
          title: "Session expired",
          text: "Token is invalid or expired. Please re-login.",
          confirmButtonText: "OK",
        });
        clearAuthData();
        setIsValid(false);
        return;
      }

      const decoded = parseJwt(token);
      const currentTime = Math.floor(Date.now() / 1000);
      const timeout = (decoded.exp - currentTime) * 1000;

      timerRef.current = setTimeout(async () => {
        await Swal.fire({
          icon: "info",
          title: "Session timeout",
          text: "Token expires. You will be logged out.",
          confirmButtonText: "OK",
        });
        clearAuthData();
        setIsValid(false);
      }, timeout);

      setIsValid(true);
    };

    checkToken();

    return () => clearTimeout(timerRef.current);
  }, []);

  if (isValid === null) return <div>Loading...</div>;
  return isValid ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
