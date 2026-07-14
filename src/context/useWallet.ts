import { useContext } from "react";
import { WalletContext } from "./WalletContext";

export function useWallet() {
  const wallet = useContext(WalletContext);
  if (!wallet) {
    throw new Error("useWallet must be used inside a WalletProvider");
  }
  return wallet;
}
