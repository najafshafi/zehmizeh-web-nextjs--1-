"use client";

import { ReactNode } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import { myTheme } from "@/styles/theme";
import { CssUtils } from "@/styles/CssUtils";

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <StyledThemeProvider theme={myTheme}>
      {children}
      <CssUtils theme={myTheme} />
    </StyledThemeProvider>
  );
}
