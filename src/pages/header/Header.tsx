import { useWallet } from "../../context/useWallet";
import "./Header.css";

const CURRENCY_SYMBOL = "₹";

export default function Header() {
  const { balance } = useWallet();

  return (
    <header className="header">
      <div className="header-inner">
        <span className="header-logo">
          <svg
            viewBox="0 0 24 24"
            width="28"
            height="28"
            fill="#6b6b45"
            className="header-icon"
          >
            <path d="M21 7H5a1 1 0 0 1 0-2h13a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1Zm-4 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
          </svg>
          <span className="header-title">WexWallet</span>
        </span>
        {balance !== null && (
          <span className="header-balance">
            {CURRENCY_SYMBOL}{balance.toFixed(2)}
          </span>
        )}
      </div>
    </header>
  );
}
