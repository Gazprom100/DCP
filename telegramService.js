const axios = require('axios');

// Telegram bot configuration для отправки уведомлений (старый бот)
const TELEGRAM_BOT_TOKEN = '8006930667:AAHHpNFS3ySj8hzteC-mmg0YBtHnSf8jREs';
const CHAT_ID = '297810833';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

/**
 * Send notification about payment request creation
 * @param {Object} paymentData - Payment data object
 * @param {number} paymentData.amount - Payment amount
 * @param {string} paymentData.method - Payment method (card or sbp)
 */
async function sendPaymentRequestNotification(paymentData) {
  const methodText = paymentData.method === 'sbp' ? 'СБП' : 'Банковская карта';
  const message = `Заявка на оплату\nМетод ${methodText}\nСумма ${paymentData.amount}р`;
  
  try {
    await sendTelegramMessage(message);
    console.log('Telegram notification sent: Payment request created');
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
}

/**
 * Send notification about successful payment
 * @param {Object} paymentData - Payment data object
 * @param {number} paymentData.amount - Payment amount
 */
async function sendPaymentSuccessNotification(paymentData) {
  const message = `Отправлен донат\nСумма ${paymentData.amount} р`;
  
  try {
    await sendTelegramMessage(message);
    console.log('Telegram notification sent: Payment success');
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
}

/**
 * Send message to Telegram
 * @param {string} text - Message text
 */
async function sendTelegramMessage(text) {
  try {
    const response = await axios.post(TELEGRAM_API_URL, {
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending Telegram message:', error.message);
    throw error;
  }
}

module.exports = {
  sendPaymentRequestNotification,
  sendPaymentSuccessNotification
}; 