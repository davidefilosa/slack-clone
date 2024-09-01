import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const usePreferenceModal = () => {
  return useAtom(modalState);
};
