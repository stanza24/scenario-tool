import { GetState } from 'zustand';

import { RootStore, StoreSet } from '../';
import { TLanguage } from 'translation/i18next';

export interface UiSettingsSlice {
  language: TLanguage;
  setLanguage: (language: TLanguage) => void;
}

export const uiSettingsSlice = (
  set: StoreSet,
  get: GetState<RootStore>
): UiSettingsSlice => ({
  language: 'ru',
  setLanguage: (language: TLanguage) => {
    set((state) => {
      state.language = language;
    });
  },
});
