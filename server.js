const express = require('express');
const path = require('path');
const https = require('https');
const app = express();
const PORT = process.env.PORT || 3000;

// Обслуживание статических файлов из текущей директории
app.use(express.static(__dirname));

// Парсинг JSON данных в теле запроса
app.use(express.json());

// Прокси-маршрут для запросов к API WATA
app.post('/api/proxy/links', (req, res) => {
  const apiOptions = {
    hostname: 'api.wata.pro',
    path: '/api/h2h/links',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': req.headers.authorization || ''
    }
  };

  const apiRequest = https.request(apiOptions, (apiResponse) => {
    let data = '';
    
    // Получаем данные от API WATA
    apiResponse.on('data', (chunk) => {
      data += chunk;
    });
    
    // Отправляем ответ клиенту
    apiResponse.on('end', () => {
      res.status(apiResponse.statusCode).send(data);
    });
  });
  
  // Обработка ошибок запроса
  apiRequest.on('error', (error) => {
    console.error('Ошибка при запросе к API WATA:', error);
    res.status(500).json({ error: 'Ошибка при запросе к API' });
  });
  
  // Отправляем тело запроса
  apiRequest.write(JSON.stringify(req.body));
  apiRequest.end();
});

// Прокси-маршрут для СБП запросов к API WATA
app.post('/api/proxy/sbp', (req, res) => {
  const apiOptions = {
    hostname: 'api.wata.pro',
    path: '/api/h2h/sbp',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': req.headers.authorization || ''
    }
  };

  const apiRequest = https.request(apiOptions, (apiResponse) => {
    let data = '';
    
    // Получаем данные от API WATA
    apiResponse.on('data', (chunk) => {
      data += chunk;
    });
    
    // Отправляем ответ клиенту
    apiResponse.on('end', () => {
      res.status(apiResponse.statusCode).send(data);
    });
  });
  
  // Обработка ошибок запроса
  apiRequest.on('error', (error) => {
    console.error('Ошибка при СБП запросе к API WATA:', error);
    res.status(500).json({ error: 'Ошибка при СБП запросе к API' });
  });
  
  // Отправляем тело запроса
  apiRequest.write(JSON.stringify(req.body));
  apiRequest.end();
});

// Маршрут для главной страницы
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
}); 