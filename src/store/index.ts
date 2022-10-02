import produce, { Draft } from 'immer';
import { WritableDraft } from 'immer/dist/internal';
import create, { GetState, StateCreator } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { debounce } from 'debounce';

import {
  createOperationsSlice,
  OperationsSlice,
} from './slices/operationsSlice';
import { createScenariosSlice, ScenariosSlice } from './slices/scenariosSlice';

export type RootStore = ScenariosSlice & OperationsSlice;

export type StoreSet = (fn: (draft: WritableDraft<RootStore>) => void) => void;

const store = (set: StoreSet, get: GetState<RootStore>) => ({
  ...createScenariosSlice(set, get),
  ...createOperationsSlice(set, get),
  ...JSON.parse(localStorage.getItem('state') || '{}'),
});

const immer =
  <T extends RootStore>(
    // @ts-ignore
    config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>
  ): StateCreator<T> =>
  (set, get, api) =>
    // @ts-ignore
    config((fn) => set(produce<T>(fn)), get, api);

export const useStore = create(
  subscribeWithSelector(
    // @ts-ignore
    process.env.REACT_APP_DEV_TOOLS ? devtools(immer(store)) : immer(store)
  )
);

const saveStoreToStorage = (store: string) =>
  localStorage.setItem('state', store);
const debouncedSaveStoreToStorage = debounce(saveStoreToStorage, 1000);

useStore.subscribe((state) => {
  const stateForSave: Record<string, any> = {};

  for (let key in state) {
    if (typeof state[key] !== 'function') stateForSave[key] = state[key];
  }

  debouncedSaveStoreToStorage(JSON.stringify(stateForSave));
});
