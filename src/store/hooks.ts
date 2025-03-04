import {
  shallowEqual,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = selector =>
  useSelector(selector, shallowEqual);
