import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import type { DebouncedFunc } from 'lodash';
import type { Dispatch, SetStateAction } from 'react';

export function useDebounce<T extends (...args: any) => any>(
  fnToDebounce: T,
  wait: number,
): DebouncedFunc<T> {
  return useCallback(debounce(fnToDebounce, wait), [fnToDebounce, wait]);
}

export function useDebouncedState<S>(
  initialState: S,
  wait: number,
): [S, DebouncedFunc<Dispatch<SetStateAction<S>>>, Dispatch<SetStateAction<S>>] {
  const [internalState, setInternalState] = useState(initialState);
  const debouncedFn = useDebounce(setInternalState, wait);
  return [internalState, debouncedFn, setInternalState];
}
