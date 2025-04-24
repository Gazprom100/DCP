const express = require('express');
const path = require('path');
const https = require('https');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;
const telegramService = require('./telegramService');

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

// Эндпоинт для отправки уведомления о создании заявки на оплату
app.post('/api/telegram/payment-request', async (req, res) => {
  try {
    const { amount, method } = req.body;
    
    await telegramService.sendPaymentRequestNotification({
      amount,
      method
    });
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка при отправке уведомления в Telegram:', error);
    res.status(500).json({ error: 'Ошибка при отправке уведомления' });
  }
});

// Вебхук для обработки успешных платежей от WATA API
app.post('/api/payment-callback', async (req, res) => {
  try {
    const paymentData = req.body;
    
    // Проверка на успешность платежа
    if (paymentData.status === 'success') {
      // Отправка уведомления в Telegram о успешном платеже
      await telegramService.sendPaymentSuccessNotification({
        amount: paymentData.amount
      });
      
      console.log('Успешный платеж:', paymentData);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка при обработке колбэка платежа:', error);
    res.status(500).json({ error: 'Ошибка при обработке колбэка' });
  }
});

// Маршрут для главной страницы
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
}); 