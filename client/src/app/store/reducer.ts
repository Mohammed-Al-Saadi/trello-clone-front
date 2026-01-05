import { createReducer, on } from '@ngrx/store';
import * as UserActions from './actions';

export interface UserState {
  projectIds: any;
  user: any | null;
}

export const initialState: UserState = {
  user: null,
  projectIds: [],
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.setUser, (state, { user }) => ({ ...state, user })),
  on(UserActions.clearUser, () => initialState),
  on(UserActions.setProjectIds, (state, { projectIds }) => ({
    ...state,
    projectIds,
  }))
);
