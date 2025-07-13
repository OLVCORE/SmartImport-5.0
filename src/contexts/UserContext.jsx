import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    id: "user-123",
    name: "Usuário Exemplo",
    premium: false,
    tokensUsed: 0,
    tokenLimit: 100000,
  });

  // Permite atualização global do saldo de tokens
  if (typeof window !== "undefined") {
    window.updateUserTokens = (tokensUsed) => {
      setUser((prev) => ({ ...prev, tokensUsed }));
    };
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 