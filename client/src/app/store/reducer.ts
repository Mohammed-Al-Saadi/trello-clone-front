import { createReducer, on } from '@ngrx/store';
import * as UserActions from './actions';

export interface UserState {
  user: any | null;
}

export const initialState: UserState = {
  user: null,
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.setUser, (state, { user }) => ({ ...state, user })),
  on(UserActions.clearUser, () => initialState)
);
