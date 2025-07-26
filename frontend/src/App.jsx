import React, { useState, useEffect } from "react";
import AppRouter from "./routers/AppRouter";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Cek session ke backend saat pertama load
    fetch("http://localhost:4000/api/profile", {
      credentials: "include", // ⬅️ Wajib agar cookie terkirim
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          setUser(data.user); // ✅ Set user jika masih login
        }
      })
      .catch((err) => {
        console.log("Session check failed:", err.message);
        setUser(null); // Optional: reset user to null
      });
  }, []);

  return <AppRouter user={user} setUser={setUser} />;
};

export default App;
