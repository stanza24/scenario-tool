import { GetState } from 'zustand';

import { RootStore, StoreSet } from '../';
import { OP_COLORS } from 'const';

export interface ColorsSlice {
  colors: Record<string, boolean>;
  getFreeColor: () => string | undefined;
  releaseColor: (color: string, draft?: RootStore) => void;
}

export const createColorsSlice = (
  set: StoreSet,
  get: GetState<RootStore>
): ColorsSlice => ({
  colors: OP_COLORS.reduce((acc, color) => ({ ...acc, [color]: true }), {}),
  getFreeColor: () => {
    for (let color of Object.keys(get().colors)) {
      if (get().colors[color]) {
        return color;
      }
    }
  },
  releaseColor: (color: string, draft?: RootStore) => {
    set((state) => {
      (draft || state).colors[color] = true;
    });
  },
});
