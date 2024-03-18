import { ToastStatus } from '@components/Toast/Toast';
import { StoreSlice } from './store';

export interface UserSlice {
  userToken: string;
  setUserToken: (token: string) => void;
}

export const createUserSlice: StoreSlice<UserSlice> = (set, get) => ({
  userToken: '',
  setUserToken: (userToken: string) => {
    set((prev) => ({ ...prev, userToken }));
  },
});
