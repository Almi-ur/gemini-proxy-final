// Адрес API Google Gemini
const TARGET_URL = 'https://generativelanguage.googleapis.com';

// Используем самый современный и надежный способ проксирования
export default async function handler(request) {
    // 1. Берем URL входящего запроса
    const url = new URL(request.url);

    // 2. Меняем в нем только имя хоста на адрес Google
    url.hostname = 'generativelanguage.googleapis.com';
    url.port = ''; // Убедимся, что порт стандартный

    // 3. Пересылаем в Google оригинальный запрос (с нетронутыми заголовками и телом)
    //    но уже с новым, измененным URL
    return fetch(url.toString(), request);
}
