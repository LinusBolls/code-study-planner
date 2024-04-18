import { writeToCache } from "@/services/caching";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ConfigProvider, ThemeConfig } from "antd";
import { ReactNode } from "react";

export default function withProviders(Component: () => ReactNode) {
  return function WithProviders() {
    const queryClient = new QueryClient({
      queryCache: new QueryCache({
        onSuccess: writeToCache,
      }),
    });

    const theme: ThemeConfig = {
      token: {
        borderRadius: 2,
      },
      components: {
        Button: {
          borderRadius: 0,
        },
      },
    };

    return (
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={theme}>
          <Component />
        </ConfigProvider>
      </QueryClientProvider>
    );
  };
}
