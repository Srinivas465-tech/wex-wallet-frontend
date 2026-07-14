import { api } from "../axios/axios";

export const login = async (userName: string, password: string) => {
  return api.post("/users", { userName, password });
};

export const addExpense = async (
  userId: string | number,
  category: string,
  amount: number,
) => {
  return api.post(`/users/${userId}/expenditures`, { category, amount });
};

export const addAllExpenses = async (userId: string | number) => {
  return api.get(`/users/${userId}/expenditures`);
};

export const addMoney = async (userId: string | number, amount: number) => {
  return api.post(`/users/${userId}/wallets`, { amount });
};

export const getWalletMoney = async (userId: string | number) => {
  return api.get(`/users/${userId}/wallets/total`);
};

export const getWalletHistory = async (userId: string | number) => {
  return api.get(`/users/${userId}/wallets`);
};

export const getUserProfile = async (userId: string | number) => {
  return api.get(`/users/${userId}`);
};
