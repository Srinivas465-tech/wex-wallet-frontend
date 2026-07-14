import { Navigate } from "react-router-dom";
import { getId } from "../utils/storage";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const token = getId();
  return token ? children : <Navigate to="/" replace />;
}
