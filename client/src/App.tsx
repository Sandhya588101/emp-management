
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import { UIProvider } from "./context/UiContext";
// import Employees from "./pages/Employees";
// import Departments from "./pages/Departments";
// import Attendance from "./pages/Attendance";
// import LeaveManagement from "./pages/LeaveManagement";
// import Payroll from "./pages/Payroll";
// import Performance from "./pages/Performance";
// import SettingsPage from "./pages/Settings";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(storedLoginStatus === "true");
  }, []);

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("accesslevel");
    localStorage.removeItem("rememberEmail");
    localStorage.removeItem("userName");
  };

  return (
    <UIProvider>
      <Router>
        {isLoggedIn ? (
          <>
            <Navbar onLogout={handleLogout}>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                {/* <Route path="/employees" element={<Employees />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/leave" element={<LeaveManagement />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/settings" element={<SettingsPage />} /> */}

                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </Navbar>
          </>
        ) : (
          <Routes>
            <Route
              path="/"
              element={<SignIn login={handleLogin} />}
            />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        )}
      </Router>
    </UIProvider>
  );
}

export default App;
