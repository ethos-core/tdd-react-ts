import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { type ReactElement, type ReactNode } from "react";

function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
              retry: false,
              gcTime: 0,
              staleTime: 0,
            },
            mutations: {
              retry: false,
            },
          },
          logger: {
            log: console.log,
            warn: console.warn,
            error: () => {},
          },
    })
}

interface TestProviderProps {
    children: ReactNode;
}

function TestProvider({ children }: TestProviderProps) {
    const queryClient = createTestQueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}

function customRender(
    ui: ReactElement,
    options?: Omit<RenderOptions, "wrapper">
) {
    return render(ui, {
        wrapper: TestProvider,
        ...options,
    })
}

export * from "@testing-library/react";
export { customRender as render };