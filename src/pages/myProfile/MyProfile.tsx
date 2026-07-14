import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../../service/service";
import { getId, removeId } from "../../utils/storage";
import "./MyProfile.css";

interface UserProfile {
  id: number;
  userName: string;
  password: string;
}

export default function MyProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getId();
    if (!userId) return;
    getUserProfile(userId)
      .then((res: { data: UserProfile }) => setUser(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    removeId();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="profile-page">
        <p className="profile-loading">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <p className="profile-loading">User not found</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="profile-title">My Profile</h2>
            <p className="profile-subtitle">Your account details</p>
          </div>
        </div>

        <div className="profile-body">
          <div className="profile-field">
            <span className="profile-field-label">Username</span>
            <span className="profile-field-value">{user.userName}</span>
          </div>

          <div className="profile-field">
            <span className="profile-field-label">Password</span>
            <span className="profile-field-value">{user.password}</span>
          </div>

          <button className="profile-logout" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
