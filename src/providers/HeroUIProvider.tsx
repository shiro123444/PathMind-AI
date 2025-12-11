import { HeroUIProvider as Provider } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface AppProviderProps {
  children: ReactNode;
}

export function HeroUIProvider({ children }: AppProviderProps) {
  const navigate = useNavigate();

  return (
    <Provider navigate={navigate}>
      {children}
    </Provider>
  );
}

export default HeroUIProvider;
