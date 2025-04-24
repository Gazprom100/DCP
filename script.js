document.addEventListener('DOMContentLoaded', () => {
    // Константы
    const CARD_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQdWJsaWNJZCI6IjNhMTk0YmUzLWQ5NjgtZDRkNy0zNTIxLTFlMDZjNGJhYmJlOCIsIlRva2VuVmVyc2lvbiI6IjIiLCJleHAiOjE3NzY4NDk1NTcsImlzcyI6Imh0dHBzOi8vYXBpLndhdGEucHJvIiwiYXVkIjoiaHR0cHM6Ly9hcGkud2F0YS5wcm8vYXBpL2gyaCJ9.zXFcHWbgc1lS6miTjbuZ02_aB81cKd-WS1lsDAuYcEI';
    const SBP_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQdWJsaWNJZCI6IjNhMTk3OWI5LTQ5MGEtMjQ4Mi0wNTNmLTQ4MTE1NTI1ZjFkYyIsIlRva2VuVmVyc2lvbiI6IjEiLCJleHAiOjE3NzcwMzc3MzMsImlzcyI6Imh0dHBzOi8vYXBpLndhdGEucHJvIiwiYXVkIjoiaHR0cHM6Ly9hcGkud2F0YS5wcm8vYXBpL2gyaCJ9.q0ha1xV9Avfsw74XZ68S-2WABHUCq-y_CMpJ-sPz1VA';
    const PAYMENT_LINKS_URL = '/api/proxy/links';
    
    // DOM Элементы
    const donateBtn = document.getElementById('donate-btn');
    const amountInput = document.getElementById('amount');
    const statusMessage = document.getElementById('status-message');
    const wrapper = document.querySelector('.wrapper');
    const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
    const amountPresets = document.querySelectorAll('.amount-preset');
    
    // Инициализация эффектов
    initInteractiveEffects();
    
    // Обработчики событий
    donateBtn.addEventListener('click', handleDonateClick);
    
    // Инициализация плашек выбора суммы
    amountPresets.forEach(preset => {
        preset.addEventListener('click', () => {
            // Установка суммы из плашки
            const amount = preset.getAttribute('data-amount');
            amountInput.value = amount;
            
            // Визуальный эффект выбора
            amountPresets.forEach(p => p.classList.remove('active'));
            preset.classList.add('active');
            
            // Анимация выбора
            animateAmountChange();
        });
    });
    
    // Сброс выделения плашек при ручном изменении суммы
    amountInput.addEventListener('input', () => {
        amountPresets.forEach(preset => {
            if (preset.getAttribute('data-amount') === amountInput.value) {
                preset.classList.add('active');
            } else {
                preset.classList.remove('active');
            }
        });
    });
    
    // Анимация изменения суммы
    function animateAmountChange() {
        amountInput.classList.add('pulse-animation');
        setTimeout(() => {
            amountInput.classList.remove('pulse-animation');
        }, 500);
    }
    
    // Получение выбранного метода оплаты
    function getSelectedPaymentMethod() {
        for (const radio of paymentMethodRadios) {
            if (radio.checked) {
                return radio.value;
            }
        }
        return 'card'; // По умолчанию карта
    }
    
    // Получение токена на основе выбранного метода оплаты
    function getAuthToken() {
        const method = getSelectedPaymentMethod();
        return method === 'sbp' ? SBP_TOKEN : CARD_TOKEN;
    }
    
    // Обработка нажатия кнопки пожертвования
    async function handleDonateClick() {
        const amount = parseInt(amountInput.value);
        const paymentMethod = getSelectedPaymentMethod();
        
        if (!amount || amount < 1) {
            showStatus('Пожалуйста, введите корректную сумму', 'error');
            return;
        }
        
        try {
            showStatus('<div class="loading"><div></div><div></div><div></div><div></div></div>', 'loading');
            
            let paymentLink;
            if (paymentMethod === 'sbp') {
                paymentLink = await createSbpPaymentLink(amount);
            } else {
                paymentLink = await createCardPaymentLink(amount);
            }
            
            if (paymentLink && paymentLink.url) {
                const methodText = paymentMethod === 'sbp' ? 'СБП' : 'картой';
                showStatus(`Ссылка для оплаты через ${methodText} успешно создана!`, 'success');
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
    
    // Создание платежной ссылки для оплаты картой
    async function createCardPaymentLink(amount) {
        try {
            const response = await fetch(PAYMENT_LINKS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CARD_TOKEN}`
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
            console.error('Ошибка API (карта):', error);
            throw error;
        }
    }
    
    // Создание платежной ссылки для оплаты через СБП
    async function createSbpPaymentLink(amount) {
        try {
            const response = await fetch(PAYMENT_LINKS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SBP_TOKEN}`
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
            console.error('Ошибка API (СБП):', error);
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
        
        // Добавляем анимацию при смене метода оплаты
        paymentMethodRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const method = getSelectedPaymentMethod();
                if (method === 'sbp') {
                    donateBtn.classList.add('sbp-selected');
                } else {
                    donateBtn.classList.remove('sbp-selected');
                }
            });
        });
    }
});