import "./Sidebar.css";
import { NavLink } from "react-router-dom";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#2f7dd1" />
      <path d="M12 5.5 18 11h-1.8v6.2h-3.3v-4h-1.8v4H7.8V11H6z" fill="#fff" />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#2aa14f" />
      <path d="M11 6.5h2v4h4v2h-4v4h-2v-4H7v-2h4z" fill="#fff" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#7b5cd6" />
      <circle cx="12" cy="9.5" r="2.8" fill="#fff" />
      <path d="M6 18.5a6 6 0 0 1 12 0z" fill="#fff" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#f4b400" />
      <path
        d="M6 8.5a2 2 0 0 1 2-2h8a1 1 0 0 1 0 2H8v8h9a1 1 0 0 0 1-1v-5h-4a2 2 0 1 1 0-4h4V8a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1.5"
        fill="#fff"
      />
      <circle cx="15.5" cy="10.5" r="1" fill="#fff" />
    </svg>
  );
}

const navItems = [
  { to: "/home", label: "Home", icon: <HomeIcon />, end: true },
  { to: "/home/wallet", label: "Wallet", icon: <WalletIcon /> },
  { to: "/home/add", label: "Expenses", icon: <AddIcon /> },
  { to: "/home/profile", label: "Profile", icon: <ProfileIcon /> },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? "sidebar-item sidebar-item-active" : "sidebar-item"
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
