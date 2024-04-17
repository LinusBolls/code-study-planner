import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import { ReactNode } from "react";

export default function withProviders(Component: () => ReactNode) {
  return function WithProviders() {
    const queryClient = new QueryClient({
      queryCache: new QueryCache({}),
    });

    return (
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            token: {
              borderRadius: 2,
            },
            components: {
              Button: {
                borderRadius: 0,
              },
            },
          }}
        >
          <Component />
        </ConfigProvider>
      </QueryClientProvider>
    );
  };
}
