export type Token = string | null;

export type TokenStateType = {
  token: Token;
  setToken: (token: Token) => void;
  clearToken: () => void;
};
