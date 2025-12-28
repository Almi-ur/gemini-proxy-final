// Импортируем node-fetch, так как нам нужна его гибкость
const fetch = require('node-fetch');

// Адрес API Google Gemini
const TARGET_URL = 'https://generativelanguage.googleapis.com';

// Вспомогательная функция для чтения "сырого" тела запроса
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
}

// Основной обработчик
module.exports = async (req, res) => {
    // Формируем целевой URL
    const targetPath = req.url.replace(/^\/api\/proxy/, '');
    const targetUrl = TARGET_URL + targetPath;
    
    try {
        // Получаем "сырое" тело запроса, как оно пришло от PHP
        const rawBody = await getRawBody(req);

        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                // Передаем только самый важный заголовок
                'Content-Type': 'application/json',
            },
            // Отправляем в Google "сырое" тело без изменений
            body: rawBody,
        });

        // Получаем ответ от Google и пересылаем его клиенту
        const responseText = await response.text();
        res.status(response.status).send(responseText);

    } catch (error) {
        res.status(500).json({ 
            source: 'Vercel Proxy',
            error: 'Internal Server Error',
            details: error.message 
        });
    }
};
