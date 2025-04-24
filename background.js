document.addEventListener('DOMContentLoaded', () => {
    // Canvas setup
    const canvas = document.getElementById('tech-background');
    const ctx = canvas.getContext('2d');
    
    // Resize canvas to window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Call resize initially and on window resize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Config
    const config = {
        particleCount: 200,
        connectionDistance: 150,
        particleSize: 2,
        particleSpeed: 0.2,
        baseColor: '#00ff41',
        blurSize: 20,
        blurCount: 3,
        hexagonsCount: 15,
        linesCount: 8
    };
    
    // Create particles
    let particles = [];
    
    function createParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                speedX: (Math.random() - 0.5) * config.particleSpeed,
                speedY: (Math.random() - 0.5) * config.particleSpeed,
                size: Math.random() * 2 + config.particleSize,
                alpha: Math.random() * 0.5 + 0.1,
                connected: false
            });
        }
    }
    
    // Create hexagons for tech effect
    let hexagons = [];
    
    function createHexagons() {
        hexagons = [];
        for (let i = 0; i < config.hexagonsCount; i++) {
            const size = Math.random() * 100 + 50;
            hexagons.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: size,
                rotation: Math.random() * Math.PI,
                speed: Math.random() * 0.001 + 0.0005,
                alpha: Math.random() * 0.1 + 0.02,
                pulseSpeed: Math.random() * 0.005 + 0.001,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }
    }
    
    // Create tech lines
    let techLines = [];
    
    function createTechLines() {
        techLines = [];
        for (let i = 0; i < config.linesCount; i++) {
            techLines.push({
                x1: Math.random() * canvas.width,
                y1: Math.random() * canvas.height,
                x2: Math.random() * canvas.width,
                y2: Math.random() * canvas.height,
                alpha: Math.random() * 0.2 + 0.05,
                width: Math.random() * 1 + 0.5,
                speed: Math.random() * 1 + 0.5,
                moveX: (Math.random() - 0.5) * 0.5,
                moveY: (Math.random() - 0.5) * 0.5
            });
        }
    }
    
    // Create blurred circles for glow effects
    let blurCircles = [];
    
    function createBlurCircles() {
        blurCircles = [];
        for (let i = 0; i < config.blurCount; i++) {
            blurCircles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 100 + config.blurSize,
                alpha: Math.random() * 0.2 + 0.05,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3
            });
        }
    }
    
    // Initialize all elements
    createParticles();
    createHexagons();
    createTechLines();
    createBlurCircles();
    
    // Animation loop
    function animate() {
        // Clear canvas
        ctx.fillStyle = '#040b18';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw blurred circles first for glow effect
        for (let i = 0; i < blurCircles.length; i++) {
            const circle = blurCircles[i];
            
            ctx.globalAlpha = circle.alpha;
            const gradient = ctx.createRadialGradient(
                circle.x, circle.y, 0,
                circle.x, circle.y, circle.size
            );
            gradient.addColorStop(0, 'rgba(0, 255, 65, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Move blur circles
            circle.x += circle.speedX;
            circle.y += circle.speedY;
            
            // Bounce off edges
            if (circle.x < 0 || circle.x > canvas.width) circle.speedX *= -1;
            if (circle.y < 0 || circle.y > canvas.height) circle.speedY *= -1;
        }
        
        // Draw tech grid
        ctx.globalAlpha = 0.05;
        ctx.strokeStyle = config.baseColor;
        ctx.lineWidth = 0.2;
        
        const gridSize = 40;
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Draw hexagons
        for (let i = 0; i < hexagons.length; i++) {
            const hex = hexagons[i];
            
            // Pulse effect for alpha
            hex.alpha = (Math.sin(Date.now() * hex.pulseSpeed + hex.pulseOffset) * 0.05) + 0.08;
            
            ctx.globalAlpha = hex.alpha;
            ctx.strokeStyle = config.baseColor;
            ctx.lineWidth = 1;
            
            // Draw hexagon
            ctx.beginPath();
            for (let j = 0; j < 6; j++) {
                const angle = (j * Math.PI / 3) + hex.rotation;
                const x = hex.x + hex.size * Math.cos(angle);
                const y = hex.y + hex.size * Math.sin(angle);
                
                if (j === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
            
            // Add some digital data inside hexagons
            if (Math.random() > 0.95) {
                ctx.globalAlpha = hex.alpha * 2;
                ctx.fillStyle = config.baseColor;
                ctx.font = '9px monospace';
                for (let k = 0; k < 3; k++) {
                    const text = Math.random() > 0.5 ? '0' : '1';
                    const randX = hex.x + (Math.random() - 0.5) * hex.size * 0.8;
                    const randY = hex.y + (Math.random() - 0.5) * hex.size * 0.8;
                    ctx.fillText(text, randX, randY);
                }
            }
            
            // Rotate hexagons
            hex.rotation += hex.speed;
        }
        
        // Draw tech lines
        for (let i = 0; i < techLines.length; i++) {
            const line = techLines[i];
            
            ctx.globalAlpha = line.alpha;
            ctx.strokeStyle = config.baseColor;
            ctx.lineWidth = line.width;
            
            // Data points on lines
            const pointsCount = Math.floor(Math.random() * 3) + 2;
            const points = [];
            
            // Create points along the line
            for (let j = 0; j < pointsCount; j++) {
                const t = j / (pointsCount - 1);
                points.push({
                    x: line.x1 + (line.x2 - line.x1) * t,
                    y: line.y1 + (line.y2 - line.y1) * t
                });
            }
            
            // Draw the main line
            ctx.beginPath();
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
            ctx.stroke();
            
            // Draw data points on the line
            ctx.fillStyle = config.baseColor;
            for (let j = 0; j < points.length; j++) {
                if (Math.random() > 0.3) {
                    ctx.beginPath();
                    ctx.arc(points[j].x, points[j].y, line.width * 2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw small data segments around points
                    if (Math.random() > 0.7) {
                        ctx.globalAlpha = line.alpha * 0.7;
                        ctx.font = '8px monospace';
                        const text = Math.random() > 0.5 ? '01' : '10';
                        ctx.fillText(text, points[j].x + 10, points[j].y - 5);
                    }
                }
            }
            
            // Move lines
            line.x1 += line.moveX;
            line.y1 += line.moveY;
            line.x2 += line.moveX;
            line.y2 += line.moveY;
            
            // Reset lines that go off screen
            if (line.x1 < -200 || line.x1 > canvas.width + 200 || 
                line.y1 < -200 || line.y1 > canvas.height + 200) {
                if (Math.random() > 0.5) {
                    line.x1 = Math.random() * canvas.width;
                    line.y1 = Math.random() > 0.5 ? -100 : canvas.height + 100;
                } else {
                    line.x1 = Math.random() > 0.5 ? -100 : canvas.width + 100;
                    line.y1 = Math.random() * canvas.height;
                }
                
                if (Math.random() > 0.5) {
                    line.x2 = Math.random() * canvas.width;
                    line.y2 = Math.random() > 0.5 ? -100 : canvas.height + 100;
                } else {
                    line.x2 = Math.random() > 0.5 ? -100 : canvas.width + 100;
                    line.y2 = Math.random() * canvas.height;
                }
            }
        }
        
        // Draw particles and their connections
        ctx.globalAlpha = 1;
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.connected = false;
            
            // Move particles
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
        }
        
        // Draw connections first (to be behind particles)
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = config.baseColor;
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < config.connectionDistance) {
                    ctx.globalAlpha = 0.2 * (1 - distance / config.connectionDistance);
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    
                    p1.connected = true;
                    p2.connected = true;
                }
            }
        }
        
        // Draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            ctx.globalAlpha = p.connected ? p.alpha * 1.5 : p.alpha;
            ctx.fillStyle = config.baseColor;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add scanline effect
        const scanY = (Date.now() % 10000) / 10000 * canvas.height;
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = config.baseColor;
        ctx.fillRect(0, scanY, canvas.width, 2);
        
        // Add subtle vignette effect
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Continue animation
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
}); 