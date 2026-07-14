export const setId = (id: string | number): void => {
  localStorage.setItem("userId", String(id));
};

export const getId = (): string | null => {
  return localStorage.getItem("userId");
};

export const removeId = (): void => {
  localStorage.removeItem("userId");
};
