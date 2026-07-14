import { Routes, Route } from "react-router-dom";
import Login from "../components/Login/Login";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import HomePageLayout from "../layout/HomePageLayout";
import Home from "../pages/home/Home";
import AddExpense from "../pages/addExpense/AddExpense";
import AddWallet from "../pages/addWallet/AddWallet";
import MyProfile from "../pages/myProfile/MyProfile";
import { ROUTES } from "./routes";
export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.HOME}
        element={
          <ProtectedRoute>
            <HomePageLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="add" element={<AddExpense />} />
        <Route path="wallet" element={<AddWallet />} />
        <Route path="profile" element={<MyProfile />} />
      </Route>
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}
