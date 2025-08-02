import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { Link, useNavigate } from "react-router-dom";

export function EngineerNavbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-800">
          Engineer Dashboard
        </Link>

        <nav className="space-x-6 hidden sm:flex">
          <Link
            to="/engineer/my-assignments"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            My Assignments
          </Link>
          <Link
            to="/engineer/profile"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Profile
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user?.name && (
            <span className="text-sm text-gray-600 hidden sm:inline">
              Welcome, <span className="font-semibold">{user.name}</span>
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
