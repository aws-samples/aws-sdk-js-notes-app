import React from "react";
import { createContext, useContext, ReactElement } from "react";
import usePersistedState from "./usePersistedState";

type ThemeContextValue = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

// register the context
const ThemeContext = createContext<ThemeContextValue>(undefined as any);

type Props = {
  children: React.ReactNode;
};

export const ThemeProvider = ({ children }: Props): ReactElement => {
  /** usePersistedState for storing state in local store */
  const [darkMode, setDarkMode] = usePersistedState("darkmode", false);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// export a custom hook to use this specific context
export const useThemeContext = (): ThemeContextValue => {
  return useContext(ThemeContext);
}

