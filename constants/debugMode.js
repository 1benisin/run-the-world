let state = true;

export const debugState = () => state;
export const toggleDebugState = () => (state = !state);
