let state = false;

export const debugState = () => state;
export const toggleDebugState = () => (state = !state);
