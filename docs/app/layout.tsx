"use client";

// Types:
type LayoutType = {
  children: React.ReactNode;
};

// Libraries:
import { useEffect } from "react";
import { RecoilRoot } from "recoil";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";

// Styles:
import "../styles/globals.css";
const theme = extendTheme();

// Root Layout:
export default function RootLayout({ children }: LayoutType) {
  // useEffect(() => {
  //   setInterval(() => {
  //     console.log("theme = ", theme.config.initialColorMode);
  //   }, 5000);
  // }, []);
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />

        <ChakraProvider>
          <RecoilRoot>{children}</RecoilRoot>
        </ChakraProvider>
      </body>
    </html>
  );
}
