import { useEffect, useMemo, useState } from "react";
import { getId } from "../../utils/storage";
import {
  addAllExpenses,
  getWalletHistory,
  getWalletMoney,
} from "../../service/service";
import "./Home.css";

const CURRENCY_SYMBOL = "₹";

interface Expenditure {
  id: number;
  category: string;
  amount: number;
  remainingAmount: number;
  dateTime: string;
}

interface WalletEntry {
  id: number;
  amount: number;
  dateTime: string;
}

interface Slice {
  key: string;
  label: string;
  amount: number;
  percent: number;
  color: string;
}

const PALETTE = [
  "#2a78d6",
  "#1baf7a",
  "#eda100",
  "#008300",
  "#4a3aa7",
  "#e34948",
  "#e87ba4",
];
const OTHER_COLOR = "#898781";
const OTHER_KEY = "__OTHER__";

const SIZE = 260;
const STROKE = 30;
const HOVER_GROW = 8;
const RADIUS = (SIZE - STROKE - HOVER_GROW) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 2;

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

function formatDay(dateStr: string) {
  const d = new Date(dateStr);
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function formatMoney(value: number) {
  return `${CURRENCY_SYMBOL}${value.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function toLabel(category: string) {
  return category
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function sumBy<T>(items: T[], pick: (item: T) => number) {
  return items.reduce((total, item) => total + pick(item), 0);
}

export default function Home() {
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [deposits, setDeposits] = useState<WalletEntry[]>([]);
  const [walletTotal, setWalletTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const userId = getId();
    if (!userId) {
      setLoading(false);
      return;
    }

    Promise.all([
      addAllExpenses(userId),
      getWalletHistory(userId),
      getWalletMoney(userId),
    ])
      .then(([expRes, histRes, totalRes]) => {
        setExpenditures(expRes.data);
        setDeposits(histRes.data);
        setWalletTotal(totalRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const colorByCategory = useMemo(() => {
    const totals = new Map<string, number>();
    for (const e of expenditures) {
      totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
    }

    const ranked = [...totals.entries()].sort((a, b) => b[1] - a[1]);
    const colors = new Map<string, string>();
    ranked.forEach(([category], i) => {
      colors.set(category, i < PALETTE.length ? PALETTE[i] : OTHER_COLOR);
    });
    return colors;
  }, [expenditures]);

  const totalSpent = sumBy(expenditures, (e) => e.amount);
  const income = sumBy(deposits, (d) => d.amount);
  const balance = walletTotal;
  const transactions = expenditures.length;

  const slices = useMemo<Slice[]>(() => {
    const totals = new Map<string, number>();
    for (const e of expenditures) {
      totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
    }

    const total = sumBy([...totals.values()], (v) => v);
    if (total === 0) return [];

    const named: Slice[] = [];
    let otherAmount = 0;

    for (const [category, amount] of totals) {
      const color = colorByCategory.get(category) ?? OTHER_COLOR;
      if (color === OTHER_COLOR) {
        otherAmount += amount;
        continue;
      }
      named.push({
        key: category,
        label: toLabel(category),
        amount,
        percent: (amount / total) * 100,
        color,
      });
    }

    named.sort((a, b) => b.amount - a.amount);

    if (otherAmount > 0) {
      named.push({
        key: OTHER_KEY,
        label: "Others",
        amount: otherAmount,
        percent: (otherAmount / total) * 100,
        color: OTHER_COLOR,
      });
    }

    return named;
  }, [expenditures, colorByCategory]);

  const dates = expenditures.map((e) => e.dateTime).sort();
  const rangeLabel = dates.length
    ? `${formatDay(dates[0])} - ${formatDay(dates[dates.length - 1])}`
    : "No expenses yet";

  const activeSlice = slices.find((s) => s.key === active) ?? null;

  let cursor = 0;

  return (
    <div className="dash">
      <div className="dash-topbar">
        <h1 className="dash-crumb">Dashboard</h1>
      </div>

      <div className="dash-kpis">
        <div className="dash-kpi">
          <span className="dash-kpi-value dash-kpi-income">
            {formatMoney(income)}
          </span>
          <span className="dash-kpi-label">Income</span>
        </div>
        <div className="dash-kpi">
          <span className="dash-kpi-value dash-kpi-expense">
            {formatMoney(totalSpent)}
          </span>
          <span className="dash-kpi-label">Expenses</span>
        </div>
        <div className="dash-kpi">
          <span className="dash-kpi-value dash-kpi-balance">
            {formatMoney(balance)}
          </span>
          <span className="dash-kpi-label">Balance</span>
        </div>
        <div className="dash-kpi">
          <span className="dash-kpi-value dash-kpi-count">
            {transactions.toLocaleString("en-IN")}
          </span>
          <span className="dash-kpi-label">Transactions</span>
        </div>
      </div>

      <section className="dash-panel">
        <header className="dash-panel-head">
          <h2 className="dash-panel-title">Total Expenses</h2>
          <p className="dash-panel-sub">{rangeLabel}</p>
        </header>

        {loading ? (
          <p className="dash-empty">Loading...</p>
        ) : slices.length === 0 ? (
          <p className="dash-empty">No expenses to chart yet.</p>
        ) : (
          <div className="dash-chart-row">
            <div className="dash-donut-wrap">
              <svg
                className="dash-donut"
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                role="img"
                aria-label={`Expenses by category, total ${formatMoney(totalSpent)}`}
              >
                <g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
                  {slices.map((slice) => {
                    const length = (slice.amount / totalSpent) * CIRCUMFERENCE;
                    const dash = Math.max(length - GAP, 1);
                    const offset = -cursor;
                    cursor += length;
                    const isActive = active === slice.key;

                    return (
                      <circle
                        key={slice.key}
                        className="dash-arc"
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={RADIUS}
                        fill="none"
                        stroke={slice.color}
                        strokeWidth={isActive ? STROKE + HOVER_GROW : STROKE}
                        strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
                        strokeDashoffset={offset}
                        opacity={active && !isActive ? 0.35 : 1}
                        onMouseEnter={() => setActive(slice.key)}
                        onMouseLeave={() => setActive(null)}
                      >
                        <title>
                          {slice.label}: {formatMoney(slice.amount)} (
                          {slice.percent.toFixed(2)}%)
                        </title>
                      </circle>
                    );
                  })}
                </g>
              </svg>

              <div className="dash-donut-center" aria-hidden="true">
                {activeSlice ? (
                  <>
                    <span className="dash-center-label">
                      {activeSlice.label}
                    </span>
                    <span className="dash-center-value">
                      {formatMoney(activeSlice.amount)}
                    </span>
                    <span className="dash-center-note">
                      {activeSlice.percent.toFixed(2)}% of spend
                    </span>
                  </>
                ) : (
                  <>
                    <span className="dash-center-label">Total spent</span>
                    <span className="dash-center-value">
                      {formatMoney(totalSpent)}
                    </span>
                    <span className="dash-center-note">
                      {slices.length} categories
                    </span>
                  </>
                )}
              </div>
            </div>

            <ul className="dash-legend">
              {slices.map((slice) => (
                <li
                  key={slice.key}
                  className={
                    active && active !== slice.key
                      ? "dash-legend-row dash-legend-dim"
                      : "dash-legend-row"
                  }
                  tabIndex={0}
                  onMouseEnter={() => setActive(slice.key)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(slice.key)}
                  onBlur={() => setActive(null)}
                >
                  <span
                    className="dash-legend-dot"
                    style={{ background: slice.color }}
                    aria-hidden="true"
                  />
                  <span className="dash-legend-name">{slice.label}</span>
                  <span className="dash-legend-amount">
                    {formatMoney(slice.amount)}
                  </span>
                  <span className="dash-legend-pct">
                    {slice.percent.toFixed(2)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
