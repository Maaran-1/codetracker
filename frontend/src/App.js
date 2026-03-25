import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Friends from "./pages/Friends";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";

function App() {
  const user = localStorage.getItem("user");

  return (
    <Router>
      <Routes>

        {/* 🔐 LOGIN ROUTE */}
        <Route
          path="/"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* 🔒 PROTECTED ROUTES */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/friends"
          element={user ? <Friends /> : <Navigate to="/" />}
        />

        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to="/" />}
        />

        <Route
          path="/settings"
          element={user ? <Settings /> : <Navigate to="/" />}
        />

        {/* ❌ UNKNOWN ROUTES */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;
