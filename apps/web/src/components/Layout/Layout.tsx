import { Box, Container } from "@mui/material";
import { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
  fullWidth?: boolean;
}

export function Layout({
  children,
  maxWidth = "lg",
  fullWidth = false,
}: LayoutProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Header />

      <Box component="main" sx={{ flex: 1, py: 3 }}>
        {fullWidth ? (
          <Box sx={{ width: "100%" }}>{children}</Box>
        ) : (
          <Container maxWidth={maxWidth}>{children}</Container>
        )}
      </Box>

      <Footer />
    </Box>
  );
}
