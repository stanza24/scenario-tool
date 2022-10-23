import { useStore } from 'store';

const getStore = () => useStore.getState();

const apiObject = {
  getStore,
};

//@ts-ignore
window['debug'] = apiObject;
