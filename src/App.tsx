import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import { UserProvider, useUser } from "@/context/UserContext";
import EngineerDashboard from "./pages/EngineerDashboard";
import { ManagerDashboard } from "./pages/ManagerDashboard";
import { Login } from "./pages/Login";
import { useEffect, useState } from "react";
import { fetchProfile } from "./services/authService";
import { toast, Toaster } from "sonner";
import Projects from "./pages/Projects";
import Team from "./pages/Team";
import AddProject from "./pages/AddProject";
import AssignEngineer from "./pages/AssignEngineer";
import MyAssignments from "./pages/MyAssignments";
import MyProfile from "./pages/MyProfile";

function AppContent() {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      setLoading(false);
      return;
    }

    const getProfile = async () => {
      try {
        const user = await fetchProfile();
        setUser(user);
        if (location.pathname === "/") {
          navigate(`/${user.role}`);
        }

      } catch (error: any) {
        toast.error(error.message || "Failed to fetch profile");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [setUser, navigate, location.pathname]);

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/manager" element={<ManagerDashboard />}>
        <Route index element={<Projects />} />
        <Route path="team" element={<Team />} />
        <Route path="create-project" element={<AddProject />} />
        <Route path="assign-engineer" element={<AssignEngineer/>} />
      </Route>

      <Route path="/engineer" element={<EngineerDashboard />}>
        <Route index element={<MyAssignments />} />
        <Route path="profile" element={<MyProfile />} />
      </Route>
      <Route path="*" element={<Navigate to={user?.role ? `/${user.role}` : "/login"} />} />
    </Routes>
  );
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <AppContent />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
