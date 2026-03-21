import { useAuth } from "../../context/AuthContext";
import UserDashboard from "../../pages/dashboards/UserDashboard";
import LawyerDashboard from "../../pages/dashboards/LawyerDashboard";
import NgoDashboard from "../../pages/dashboards/NgoDashboard";
import Admin from "../../pages/admin/Admin";

const RoleBasedDashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case "ADMIN":
      return <Admin />;

    case "LAWYER":
      return <LawyerDashboard />;

    case "NGO":
      return <NgoDashboard />;

    default:
      return <UserDashboard />;
  }
};

export default RoleBasedDashboard;