import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { getId } from "../../utils/storage";
import { addMoney, getWalletHistory } from "../../service/service";
import { useWallet } from "../../context/useWallet";
import "../addExpense/AddExpense.css";

const CURRENCY_SYMBOL = "₹";

interface WalletEntry {
  id: number;
  amount: number;
  dateTime: string;
}

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${h}:${m}`;
}

export default function AddWallet() {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletHistory, setWalletHistory] = useState<WalletEntry[]>([]);
  const [fetching, setFetching] = useState(true);

  const userId = getId();
  const { refreshBalance } = useWallet();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const fetchData = () => {
    if (!userId) return;
    getWalletHistory(userId)
      .then((histRes) => setWalletHistory(histRes.data))
      .catch(() => {})
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userId) {
      setError("You're not signed in. Please sign in again.");
      return;
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await addMoney(userId, parsedAmount);
      setToast(`Added ${CURRENCY_SYMBOL}${amount} to your account`);
      setAmount("");
      setShowModal(false);
      fetchData();
      refreshBalance();
    } catch {
      setError("Couldn't add money. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setAmount("");
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setError("");
  };

  const totalAdded = walletHistory.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="add-page">
      {toast && <div className="add-toast">{toast}</div>}

      <button className="add-fab" onClick={openModal}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add Money
      </button>

      <div className="add-card">
          <div className="add-card-header">
          <div className="add-card-header-left">
            <span className="add-card-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M3 12h4l3-9 4 18 3-9h4" />
              </svg>
            </span>
            <div>
              <h2 className="add-card-title">Wallet History</h2>
              <p className="add-card-subtitle">All your past deposits</p>
            </div>
          </div>
          <span className="add-total-badge">Total Added: {CURRENCY_SYMBOL}{totalAdded.toFixed(2)}</span>
        </div>

        <div className="add-card-body">

          {fetching ? (
            <p className="add-empty">Loading...</p>
          ) : walletHistory.length === 0 ? (
            <p className="add-empty">No deposits yet.</p>
          ) : (
            <table className="add-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {walletHistory.map((e, i) => (
                  <tr key={e.id}>
                    <td className="add-seq">{i + 1}</td>
                    <td className="add-amount-cell add-amount-income">{CURRENCY_SYMBOL}{e.amount.toFixed(2)}</td>
                    <td className="add-date-cell">{formatDate(e.dateTime)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="add-overlay" onClick={closeModal}>
          <div className="add-modal" onClick={(e) => e.stopPropagation()}>
            <div className="add-modal-header">
              <h3 className="add-modal-title">
                <span className="add-modal-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
                Add Money
              </h3>
              <button className="add-modal-close" onClick={closeModal} aria-label="Close">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="add-modal-form" onSubmit={handleSubmit}>
              {error && (
                <p className="add-alert add-alert-error" role="alert">
                  {error}
                </p>
              )}

              <div className="add-field">
                <label className="add-field-label" htmlFor="wallet-amount">Amount</label>
                <div className="add-amount">
                  <span className="add-amount-symbol" aria-hidden="true">{CURRENCY_SYMBOL}</span>
                  <input
                    id="wallet-amount"
                    className="add-amount-input"
                    type="number"
                    inputMode="decimal"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="add-submit" disabled={loading}>
                {loading && <span className="add-spinner" aria-hidden="true" />}
                {loading ? "Adding..." : "Add Money"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
