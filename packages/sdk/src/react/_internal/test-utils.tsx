import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as rtlRender } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
    },
  });

export function renderWithClient(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = rtlRender(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
    ),
    ...options,
  });

  return {
    ...result,
    rerender: (rerenderUi: ReactElement) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          {rerenderUi}
        </QueryClientProvider>,
      ),
  };
}

export * from '@testing-library/react';

export { renderWithClient as render };