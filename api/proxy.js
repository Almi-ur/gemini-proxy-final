const TARGET_URL = 'https://generativelanguage.googleapis.com';

// Используем стандартный синтаксис Node.js для Vercel
module.exports = async (req, res) => {
    // req.url уже содержит путь и параметры
    const targetPath = req.url.replace('/api/proxy', '');
    const targetUrl = TARGET_URL + targetPath;

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: {
                'Content-Type': req.headers['content-type'] || 'application/json',
            },
            // req.body - это уже объект, его нужно превратить в строку
            body: JSON.stringify(req.body),
            redirect: 'follow'
        });

        const data = await response.json();
        // Отправляем ответ
        res.status(response.status).json(data);

    } catch (error) {
        res.status(500).json({ error: 'Proxy Error: ' + error.message });
    }
};
