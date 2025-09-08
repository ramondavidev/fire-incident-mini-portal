export { LoadingState, ErrorState, EmptyState } from './UIStates';

// Export as namespaced components for easier testing
import { LoadingState, ErrorState, EmptyState } from './UIStates';

export const UIStates = {
  Loading: LoadingState,
  Error: ErrorState,
  Empty: EmptyState,
};

export default UIStates;
