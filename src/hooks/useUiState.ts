import { useContext } from 'react';
import { UIContext } from 'context/ui';

export const useUiState = () => {
  return useContext(UIContext);
};
