import { type ShowFlashMessage, useFlashMessageContext } from '../../context/FlashMessageContext';

export const useFlashMessage = (): ShowFlashMessage => useFlashMessageContext();
