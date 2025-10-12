'use client';

import {
  ChakraProvider,
  extendTheme,
  type ThemeConfig,
  type StyleFunctionProps,
} from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading:
      "\"Segoe UI\", -apple-system, BlinkMacSystemFont, \"Hiragino Sans\", \"Hiragino Kaku Gothic ProN\", Meiryo, sans-serif",
    body:
      "\"Segoe UI\", -apple-system, BlinkMacSystemFont, \"Hiragino Sans\", \"Hiragino Kaku Gothic ProN\", Meiryo, sans-serif",
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      "html, body": {
        height: "100%",
      },
      body: {
        margin: 0,
        backgroundColor: props.colorMode === "dark" ? "gray.900" : "gray.100",
        color: props.colorMode === "dark" ? "gray.100" : "gray.800",
      },
      "#__next": {
        height: "100%",
      },
    }),
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "teal",
      },
      baseStyle: {
        borderRadius: "xl",
        fontWeight: "medium",
      },
    },
    Badge: {
      baseStyle: {
        borderRadius: "full",
      },
    },
    Textarea: {
      baseStyle: {
        borderRadius: "xl",
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
