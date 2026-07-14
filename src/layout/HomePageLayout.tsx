import { Outlet } from "react-router-dom";
import Header from "../pages/header/Header";
import Sidebar from "../pages/sidebar/Sidebar";
import WalletProvider from "../context/WalletProvider";

export default function HomePageLayout() {
  return (
    <WalletProvider>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />
        <div style={{ display: "flex", flex: 1 }}>
          <Sidebar />
          <main style={{ flex: 1, padding: 15 }}>
            <Outlet />
          </main>
        </div>
      </div>
    </WalletProvider>
  );
}
