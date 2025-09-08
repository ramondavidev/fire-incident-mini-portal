import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: (props: { alt: string; [key: string]: unknown }) => {
    const { alt, ...restProps } = props;
    return `<img alt="${alt}" ${Object.keys(restProps)
      .map((key) => `${key}="${restProps[key]}"`)
      .join(' ')} />`;
  },
}));

// Setup fetch mock
global.fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});
