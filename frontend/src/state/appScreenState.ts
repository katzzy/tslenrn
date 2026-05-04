export type AppScreenState =
  | { view: 'user-select' }
  | { view: 'workspace' };

export type AppScreenAction =
  | { type: 'OPEN_USER_SELECT' }
  | { type: 'ENTER_WORKSPACE' };

export const initialAppScreenState: AppScreenState = { view: 'user-select' };

export const appScreenReducer = (
  _state: AppScreenState,
  action: AppScreenAction
): AppScreenState => {
  if (action.type === 'OPEN_USER_SELECT') return { view: 'user-select' };
  return { view: 'workspace' };
};
