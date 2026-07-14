import { createContext } from "react";

export interface WalletContextValue {
  balance: number | null;
  refreshBalance: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextValue | null>(null);
