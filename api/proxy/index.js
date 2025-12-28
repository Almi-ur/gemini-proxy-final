// Адрес API Google Gemini
const TARGET_URL = 'https://generativelanguage.googleapis.com';

// Этот код работает как "прозрачный" прокси
export default {
  async fetch(request) {
    // 1. Берем URL входящего запроса
    const url = new URL(request.url);

    // 2. Меняем в нем только имя хоста на адрес Google
    url.hostname = 'generativelanguage.googleapis.com';
    url.port = ''; // Убедимся, что порт стандартный (443 для https)

    // 3. Пересылаем в Google оригинальный запрос (с нетронутыми заголовками и телом)
    //    но уже с новым, измененным URL. Никакого анализа JSON, никаких искажений.
    return fetch(url.toString(), request);
  }
};
