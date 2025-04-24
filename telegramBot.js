const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const axios = require('axios');

// Конфигурация бота Telegram
const BOT_TOKEN = '8125435311:AAF418vsyh49i1aREKb2Raxh5P29dFraRIg';
const WEBSITE_URL = process.env.WEBSITE_URL || 'https://dcp-wk3n.onrender.com'; // URL вашего приложения на Render

// Инициализация бота
const bot = new Telegraf(BOT_TOKEN);

// Обработчик команды /start
bot.start((ctx) => {
  return ctx.reply('Добро пожаловать! Выберите действие:', 
    Markup.keyboard([
      [Markup.button.webApp('Открыть приложение', WEBSITE_URL)],
      ['Информация', 'Помощь']
    ]).resize()
  );
});

// Обработчик команды /webapp - альтернативный способ открыть веб-приложение через инлайн-кнопку
bot.command('webapp', (ctx) => {
  return ctx.reply('Нажмите кнопку ниже, чтобы открыть приложение:',
    Markup.inlineKeyboard([
      Markup.button.webApp('Открыть приложение', WEBSITE_URL)
    ])
  );
});

// Обработчик для кнопки "Информация"
bot.hears('Информация', (ctx) => {
  ctx.reply('Это бот для работы с системой пожертвований. Вы можете отправлять донаты через веб-приложение.');
});

// Обработчик для кнопки "Помощь"
bot.hears('Помощь', (ctx) => {
  ctx.reply('Если у вас возникли вопросы, напишите нам на почту support@example.com');
});

// Обработчик веб-данных (когда пользователь отправляет данные из веб-приложения)
bot.on('web_app_data', (ctx) => {
  try {
    // Получение данных от веб-приложения
    const data = JSON.parse(ctx.webAppData.data);
    
    // Обработка данных в зависимости от типа
    if (data.type === 'paymentRequest') {
      ctx.reply(`Заявка на оплату создана!\nМетод: ${data.method}\nСумма: ${data.amount}р`);
    } else if (data.type === 'paymentSuccess') {
      ctx.reply(`Оплата успешно завершена!\nСумма: ${data.amount}р`);
    } else {
      ctx.reply('Получены данные от веб-приложения');
    }
  } catch (error) {
    console.error('Ошибка при обработке данных веб-приложения:', error);
    ctx.reply('Произошла ошибка при обработке данных');
  }
});

// Обработка всех остальных сообщений
bot.on('message', (ctx) => {
  ctx.reply('Чтобы начать работу, используйте команду /start');
});

// Функция для запуска бота
async function startBot() {
  try {
    await bot.launch();
    console.log('Бот запущен!');
  } catch (error) {
    console.error('Ошибка при запуске бота:', error);
  }
}

module.exports = {
  startBot
}; 