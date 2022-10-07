// Превращает абсолютный URL в относительный ("http://example.com/imgs" -> "/imgs")
export const makeRelativeURL = (absoluteUrl: string) =>
  absoluteUrl.replace(/^.*\/\/[^/]+/, '');

// Если приложение запущено на локалке, меняет URL чтобы не было проблем с CORS. Иначе оставляет без изменений
export const makeCORSSafeURL = (url: string) => {
  const isRunningOnLocalhost = ['localhost', '127.0.0.1', ''].includes(
    window.location.hostname
  );

  return isRunningOnLocalhost || process.env.NODE_ENV === 'development'
    ? makeRelativeURL(url)
    : url;
};

// Наша обёртка над fetch. Изменяет URL запроса если приложение на локалхосте, в остальном идентично обычному
export const fetchThroughProxy = (
  url: string,
  options: Record<string, any> = {}
) => fetch(makeCORSSafeURL(url), options);
