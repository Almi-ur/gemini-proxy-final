const fetch = require('node-fetch'); // Vercel может потребовать явный импорт fetch

// Адрес API Google Gemini
const TARGET_URL = 'https://generativelanguage.googleapis.com';

// Стандартный экспорт для Node.js runtime на Vercel
module.exports = async (req, res) => {
    // req.url уже содержит путь с параметрами (например, /v1beta/models/...)
    // Убираем /api/proxy из начала, если он там есть
    const targetPath = req.url.replace(/^\/api\/proxy/, ''); 
    const targetUrl = TARGET_URL + targetPath;

    try {
        const response = await fetch(targetUrl, {
            method: req.method, // Просто передаем тот же метод (POST)
            headers: {
                // Передаем только самый важный заголовок
                'Content-Type': 'application/json',
            },
            // Тело запроса уже приходит как объект, превращаем его в строку
            body: JSON.stringify(req.body),
        });

        // Получаем ответ от Google и пересылаем его клиенту
        const data = await response.json();
        res.status(response.status).json(data);

    } catch (error) {
        // Если что-то пошло не так, возвращаем ошибку
        res.status(500).json({ 
            source: 'Vercel Proxy',
            error: 'Failed to fetch from Google API',
            details: error.message 
        });
    }
};
