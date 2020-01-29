export const CLEAR_ERROR = 'CLEAR_ERROR';
export const CREATE_ERROR = 'CREATE_ERROR';

export const clearError = () => {
  return { type: CLEAR_ERROR };
};

export const createError = error => {
  return { type: CREATE_ERROR, error };
};
