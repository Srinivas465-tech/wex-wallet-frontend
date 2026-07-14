import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { getId } from "../../utils/storage";
import { addExpense, addAllExpenses } from "../../service/service";
import { useWallet } from "../../context/useWallet";
import "./AddExpense.css";

const CURRENCY_SYMBOL = "₹";

const CATEGORIES = [
  "FOOD",
  "GROCERIES",
  "TRANSPORT",
  "UTILITIES",
  "RENT",
  "ENTERTAINMENT",
  "HEALTHCARE",
  "SHOPPING",
  "EDUCATION",
  "TRAVEL",
  "INSURANCE",
  "PERSONAL_CARE",
  "SAVINGS",
  "OTHER",
];

interface Expenditure {
  id: number;
  category: string;
  amount: number;
  remainingAmount: number;
  dateTime: string;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${h}:${m}`;
}

function toLabel(category: string) {
  return category
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function AddExpense() {
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [fetching, setFetching] = useState(true);
  const [filterCat, setFilterCat] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const userId = getId();
  const { balance, refreshBalance } = useWallet();
  const totalAmount = balance ?? 0;

  const fetchData = () => {
    if (!userId) return;
    addAllExpenses(userId)
      .then((expRes) => setExpenditures(expRes.data))
      .catch(() => {})
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

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

    const totalParsedAmount = Number(totalAmount);
    if (
      !Number.isFinite(totalParsedAmount) ||
      totalParsedAmount < parsedAmount
    ) {
      setError(`Your wallet ${CURRENCY_SYMBOL}${totalParsedAmount} exceeds.`);
      return;
    }

    setError("");
    setLoading(true);

    try {
      await addExpense(userId, category, parsedAmount);
      setToast("Expense added successfully");
      setCategory("");
      setAmount("");
      setShowModal(false);
      fetchData();
      refreshBalance();
    } catch {
      setError("Couldn't save that expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setCategory("");
    setAmount("");
    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setError("");
  };

  const filtered = expenditures.filter((e) => {
    if (filterCat && e.category !== filterCat) return false;
    if (dateFrom && new Date(e.dateTime) < new Date(dateFrom)) return false;
    if (dateTo) {
      const toEnd = new Date(dateTo);
      toEnd.setHours(23, 59, 59, 999);
      if (new Date(e.dateTime) > toEnd) return false;
    }
    return true;
  });

  const totalSpent = filtered.reduce((sum, e) => sum + e.amount, 0);
  const totalCash = totalAmount + totalSpent;

  return (
    <div className="add-page">
      {toast && <div className="add-toast">{toast}</div>}

      <button className="add-fab" onClick={openModal}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add Expense
      </button>

      <div className="add-card">
        <div className="add-card-header">
          <div className="add-card-header-left">
            <span className="add-card-icon">
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M3 12h4l3-9 4 18 3-9h4" />
              </svg>
            </span>
            <div>
              <h2 className="add-card-title">Transaction History</h2>
              <p className="add-card-subtitle">All your past expenditures</p>
            </div>
          </div>
          <div className="add-filter-group">
            <div className="add-filter-wrap">
              <select
                className="add-filter-select"
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {toLabel(cat)}
                  </option>
                ))}
              </select>
              <svg
                className="add-filter-chevron"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
            <input
              className="add-filter-date"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="From"
            />
            <input
              className="add-filter-date"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="To"
            />
          </div>
        </div>

        <div className="add-card-body">
          <div className="add-summary">
            <div className="add-summary-card add-summary-spent">
              <span className="add-summary-label">Total Spent</span>
              <span className="add-summary-value">
                {CURRENCY_SYMBOL}
                {totalSpent.toFixed(2)}
              </span>
            </div>
            <div className="add-summary-card add-summary-total">
              <span className="add-summary-label">Total Amount</span>
              <span className="add-summary-value">
                {CURRENCY_SYMBOL}
                {totalCash.toFixed(2)}
              </span>
            </div>
          </div>

          {fetching ? (
            <p className="add-empty">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="add-empty">No transactions yet.</p>
          ) : (
            <table className="add-table add-table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Remaining</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e, i) => (
                  <tr key={e.id}>
                    <td className="add-seq">{i + 1}</td>
                    <td className="add-category-cell">
                      <span className="add-category">{e.category}</span>
                    </td>
                    <td className="add-amount-cell">
                      {CURRENCY_SYMBOL}
                      {e.amount.toFixed(2)}
                    </td>
                    <td className="add-remaining-cell">
                      {CURRENCY_SYMBOL}
                      {e.remainingAmount.toFixed(2)}
                    </td>
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
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
                New Expense
              </h3>
              <button
                className="add-modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
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
                <label className="add-field-label" htmlFor="modal-category">
                  Category
                </label>
                <div className="add-select-wrap">
                  <select
                    id="modal-category"
                    className="add-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={loading}
                    required
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {toLabel(cat)}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="add-select-chevron"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>

              <div className="add-field">
                <label className="add-field-label" htmlFor="modal-amount">
                  Amount
                </label>
                <div className="add-amount">
                  <span className="add-amount-symbol" aria-hidden="true">
                    {CURRENCY_SYMBOL}
                  </span>
                  <input
                    id="modal-amount"
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
                {loading ? "Adding..." : "Add Expense"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
