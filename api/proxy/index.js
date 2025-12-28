const TARGET_URL = 'https://generativelanguage.googleapis.com';

// Используем самый совместимый "классический" синтаксис для Vercel (Node.js)
module.exports = async (req, res) => {
    // req.url уже содержит путь с параметрами
    const targetPath = req.url.replace(/^\/api\/proxy/, ''); 
    const targetUrl = TARGET_URL + targetPath;

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                // ПРАВИЛЬНЫЙ способ получить заголовок в этом окружении
                'Content-Type': req.headers['content-type'] || 'application/json',
            },
            // Vercel автоматически парсит тело JSON-запроса в req.body
            body: JSON.stringify(req.body),
        });

        // Проверяем, что ответ от Google успешный, иначе он может быть не в формате JSON
        if (!response.ok) {
            const errorText = await response.text();
            res.status(response.status).send(errorText);
            return;
        }
        
        const data = await response.json();
        // Отправляем успешный ответ клиенту
        res.status(response.status).json(data);

    } catch (error) {
        // Отправляем ошибку, если что-то пошло не так
        res.status(500).json({ 
            source: 'Vercel Proxy',
            error: 'Internal Server Error',
            details: error.message 
        });
    }
}
