import { useStore } from 'store';

const getStore = () => useStore.getState();

const apiObject = {
  getStore,
};

if (process.env.NODE_ENV === 'development') {
  //@ts-ignore
  window['debug'] = apiObject;
}
