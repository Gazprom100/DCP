// Инициализация Telegram Web App
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, открыто ли приложение в Telegram
    const isTelegramWebApp = window.Telegram && window.Telegram.WebApp;
    
    if (isTelegramWebApp) {
        console.log('Приложение запущено в Telegram Web App');
        
        // Получение экземпляра объекта WebApp
        const tg = window.Telegram.WebApp;
        
        // Инициализация WebApp
        tg.expand(); // Расширяем на весь экран
        tg.ready(); // Сообщаем Telegram, что приложение готово
        
        // Установка темы для соответствия теме Telegram
        const themeParams = tg.themeParams;
        if (themeParams.bg_color) {
            document.body.style.setProperty('--background-color', themeParams.bg_color);
        }
        if (themeParams.text_color) {
            document.body.style.setProperty('--text-color', themeParams.text_color);
        }
        if (themeParams.button_color) {
            document.body.style.setProperty('--accent-color', themeParams.button_color);
        }
        
        // Отображение информации о пользователе, если она доступна
        const user = tg.initDataUnsafe && tg.initDataUnsafe.user;
        if (user) {
            console.log('User:', user);
        }
        
        // Модифицируем функционал для отправки данных в Telegram при оплате
        document.addEventListener('payment-request-created', (event) => {
            const paymentData = event.detail;
            // Отправляем данные в Telegram
            tg.sendData(JSON.stringify({
                type: 'paymentRequest',
                amount: paymentData.amount,
                method: paymentData.method
            }));
        });
        
        document.addEventListener('payment-success', (event) => {
            const paymentData = event.detail;
            // Отправляем данные в Telegram
            tg.sendData(JSON.stringify({
                type: 'paymentSuccess',
                amount: paymentData.amount
            }));
        });
        
        // Создаем кнопку "Назад" в главном интерфейсе WebApp (если это нужно)
        tg.BackButton.show();
        tg.BackButton.onClick(() => {
            // Вернуться на предыдущий экран или закрыть WebApp
            tg.close();
        });
    } else {
        console.log('Приложение запущено в обычном браузере');
    }
}); 