// Адрес API Google Gemini
const TARGET_URL = 'https://generativelanguage.googleapis.com';

// Стандартный экспорт для Vercel Serverless Functions
export default async function handler(request) {
    // Входящий URL уже содержит путь и параметры.
    const url = new URL(request.url, `https://${request.headers.host}`);
    // Убираем /api/proxy из начала
    const targetPath = url.pathname.replace(/^\/api\/proxy/, ''); 
    const targetUrl = TARGET_URL + targetPath + url.search;

    // Создаем новый запрос, копируя метод, заголовки и тело
    const proxyRequest = new Request(targetUrl, {
        method: request.method,
        headers: {
            'Content-Type': request.headers.get('Content-Type') || 'application/json',
        },
        body: request.body,
        redirect: 'follow'
    });
    
    try {
        // Выполняем запрос с помощью встроенного fetch
        const response = await fetch(proxyRequest);
        
        // Возвращаем ответ от Google как есть
        return response;

    } catch (error) {
        // Если что-то пошло не так, возвращаем ошибку в формате JSON
        return new Response(JSON.stringify({ 
            source: 'Vercel Proxy',
            error: 'Failed to fetch from Google API',
            details: error.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
