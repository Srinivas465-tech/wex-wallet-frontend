import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { getId } from "../utils/storage";
import { getWalletMoney } from "../service/service";
import { WalletContext } from "./WalletContext";

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number | null>(null);

  const refreshBalance = useCallback(() => {
    const userId = getId();
    if (!userId) return Promise.resolve();
    return getWalletMoney(userId)
      .then((res) => setBalance(res.data))
      .catch(() => {
        // keep the last known balance
      });
  }, []);

  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  const value = useMemo(
    () => ({ balance, refreshBalance }),
    [balance, refreshBalance],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
