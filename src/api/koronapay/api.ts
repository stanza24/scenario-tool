import axios from 'axios';

export const koronaPayApi = axios.create({
  baseURL: 'https://koronapay.com/',
});

koronaPayApi.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {};

  config.headers['Accept'] = 'application/vnd.cft-data.v2.86+json';
  config.headers['Accept-Language'] = 'en';

  return config;
});
