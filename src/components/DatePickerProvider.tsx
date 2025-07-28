"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

interface ClientLocalizationProviderProps {
  children: React.ReactNode;
}

export default function ClientLocalizationProvider({
  children,
}: ClientLocalizationProviderProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      {children}
    </LocalizationProvider>
  );
}
