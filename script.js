document.addEventListener('DOMContentLoaded', () => {
    // Константы
    const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQdWJsaWNJZCI6IjNhMTk0YmUzLWQ5NjgtZDRkNy0zNTIxLTFlMDZjNGJhYmJlOCIsIlRva2VuVmVyc2lvbiI6IjIiLCJleHAiOjE3NzY4NDk1NTcsImlzcyI6Imh0dHBzOi8vYXBpLndhdGEucHJvIiwiYXVkIjoiaHR0cHM6Ly9hcGkud2F0YS5wcm8vYXBpL2gyaCJ9.zXFcHWbgc1lS6miTjbuZ02_aB81cKd-WS1lsDAuYcEI';
    const API_URL = '/api/proxy/links'; // Используем наш прокси вместо прямого URL
    
    // DOM Элементы
    const donateBtn = document.getElementById('donate-btn');
    const amountInput = document.getElementById('amount');
    const statusMessage = document.getElementById('status-message');
    const wrapper = document.querySelector('.wrapper');
    
    // Инициализация эффектов
    initInteractiveEffects();
    
    // Обработчики событий
    donateBtn.addEventListener('click', handleDonateClick);
    
    // Обработка нажатия кнопки пожертвования
    async function handleDonateClick() {
        const amount = parseInt(amountInput.value);
        
        if (!amount || amount < 1) {
            showStatus('Пожалуйста, введите корректную сумму', 'error');
            return;
        }
        
        try {
            showStatus('<div class="loading"><div></div><div></div><div></div><div></div></div>', 'loading');
            const paymentLink = await createPaymentLink(amount);
            
            if (paymentLink && paymentLink.url) {
                showStatus('Ссылка для оплаты успешно создана!', 'success');
                setTimeout(() => {
                    window.location.href = paymentLink.url;
                }, 1000);
            } else {
                showStatus('Не удалось создать ссылку для оплаты', 'error');
            }
        } catch (error) {
            console.error('Ошибка при создании ссылки для оплаты:', error);
            showStatus('Ошибка при создании ссылки для оплаты', 'error');
        }
    }
    
    // Создание платежной ссылки через API WATA
    async function createPaymentLink(amount) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${AUTH_TOKEN}`
                },
                body: JSON.stringify({
                    amount: amount,
                    currency: 'RUB'
                })
            });
            
            if (!response.ok) {
                throw new Error(`Запрос к API завершился с ошибкой ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Ошибка API:', error);
            throw error;
        }
    }
    
    // Показать сообщение о статусе
    function showStatus(message, type) {
        statusMessage.innerHTML = message;
        statusMessage.className = 'status-message show';
        
        if (type) {
            statusMessage.classList.add(type);
        }
    }
    
    // Инициализация интерактивных эффектов
    function initInteractiveEffects() {
        // Эффект парения при движении мыши
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;
            
            wrapper.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
        });
        
        // Добавляем отклик на кнопку при клике
        donateBtn.addEventListener('mousedown', () => {
            donateBtn.style.transform = 'scale(0.95)';
        });
        
        donateBtn.addEventListener('mouseup', () => {
            donateBtn.style.transform = 'scale(1)';
        });
        
        donateBtn.addEventListener('mouseleave', () => {
            donateBtn.style.transform = 'scale(1)';
        });
    }
});