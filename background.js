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
        particleCount: 250,
        connectionDistance: 150,
        particleSize: 2,
        particleSpeed: 0.3,
        baseColor: '#00ff41',
        blurSize: 30,
        blurCount: 5,
        hexagonsCount: 20,
        linesCount: 12,
        dataNodesCount: 8
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
                connected: false,
                pulseSpeed: Math.random() * 0.005 + 0.002,
                pulseOffset: Math.random() * Math.PI * 2
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
                pulseOffset: Math.random() * Math.PI * 2,
                glowIntensity: Math.random() * 0.4 + 0.2
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
                moveY: (Math.random() - 0.5) * 0.5,
                dataPoints: Math.floor(Math.random() * 5) + 3,
                pulseAlpha: Math.random() * 0.01 + 0.005
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
                size: Math.random() * 120 + config.blurSize,
                alpha: Math.random() * 0.2 + 0.05,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                pulseSpeed: Math.random() * 0.002 + 0.001,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }
    }
    
    // Create data nodes
    let dataNodes = [];
    
    function createDataNodes() {
        dataNodes = [];
        for (let i = 0; i < config.dataNodesCount; i++) {
            dataNodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 20 + 10,
                alpha: Math.random() * 0.3 + 0.1,
                speedX: (Math.random() - 0.5) * 0.2,
                speedY: (Math.random() - 0.5) * 0.2,
                dataType: Math.random() > 0.5 ? 'binary' : 'hex',
                pulseSpeed: Math.random() * 0.01 + 0.005,
                pulseOffset: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.002
            });
        }
    }
    
    // Initialize all elements
    createParticles();
    createHexagons();
    createTechLines();
    createBlurCircles();
    createDataNodes();
    
    // Animation loop
    function animate() {
        // Clear canvas
        ctx.fillStyle = '#040b18';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add vignette effect
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width * 0.7
        );
        gradient.addColorStop(0, 'rgba(4, 11, 24, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw blurred circles for glow effect
        for (let i = 0; i < blurCircles.length; i++) {
            const circle = blurCircles[i];
            
            // Pulsing alpha
            circle.currentAlpha = circle.alpha * (0.7 + 0.3 * Math.sin(Date.now() * circle.pulseSpeed + circle.pulseOffset));
            
            ctx.globalAlpha = circle.currentAlpha;
            const gradient = ctx.createRadialGradient(
                circle.x, circle.y, 0,
                circle.x, circle.y, circle.size
            );
            gradient.addColorStop(0, 'rgba(0, 255, 65, 0.25)');
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
        
        // Draw particles and connections
        ctx.globalAlpha = 1;
        
        // Draw connections first
        ctx.strokeStyle = config.baseColor;
        ctx.lineWidth = 0.3;
        
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < config.connectionDistance) {
                    ctx.globalAlpha = (1 - distance / config.connectionDistance) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    
                    // Mark particles as connected
                    p1.connected = true;
                    p2.connected = true;
                }
            }
        }
        
        // Draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Pulsing size for connected particles
            const pulseAmount = p.connected ? Math.sin(Date.now() * p.pulseSpeed + p.pulseOffset) * 0.5 + 1 : 1;
            const finalSize = p.size * pulseAmount;
            
            ctx.globalAlpha = p.alpha * (p.connected ? 1.2 : 0.7);
            ctx.fillStyle = config.baseColor;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, finalSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Reset connection status for next frame
            p.connected = false;
            
            // Move particles
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Bounce off edges with slight randomness
            if (p.x < 0 || p.x > canvas.width) {
                p.speedX *= -1;
                p.speedX += (Math.random() - 0.5) * 0.1;
            }
            if (p.y < 0 || p.y > canvas.height) {
                p.speedY *= -1;
                p.speedY += (Math.random() - 0.5) * 0.1;
            }
            
            // Keep particle speed in check
            const maxSpeed = config.particleSpeed * 1.5;
            if (Math.abs(p.speedX) > maxSpeed) p.speedX = Math.sign(p.speedX) * maxSpeed;
            if (Math.abs(p.speedY) > maxSpeed) p.speedY = Math.sign(p.speedY) * maxSpeed;
        }
        
        // Draw hexagons
        for (let i = 0; i < hexagons.length; i++) {
            const hex = hexagons[i];
            
            // Pulse effect for alpha
            hex.alpha = (Math.sin(Date.now() * hex.pulseSpeed + hex.pulseOffset) * 0.05) + 0.08;
            
            // Draw glow
            const glowSize = hex.size * 1.1;
            ctx.globalAlpha = hex.alpha * hex.glowIntensity;
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(0, 255, 65, 0.3)';
            
            // Draw hexagon
            ctx.beginPath();
            for (let j = 0; j < 6; j++) {
                const angle = (j * Math.PI / 3) + hex.rotation;
                const x = hex.x + glowSize * Math.cos(angle);
                const y = hex.y + glowSize * Math.sin(angle);
                
                if (j === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
            ctx.shadowBlur = 0;
            
            // Draw actual hexagon
            ctx.globalAlpha = hex.alpha;
            ctx.strokeStyle = config.baseColor;
            ctx.lineWidth = 1;
            
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
        
        // Draw data nodes
        for (let i = 0; i < dataNodes.length; i++) {
            const node = dataNodes[i];
            
            // Pulsing effect
            node.currentAlpha = node.alpha * (0.7 + 0.3 * Math.sin(Date.now() * node.pulseSpeed + node.pulseOffset));
            
            // Draw node glow
            ctx.globalAlpha = node.currentAlpha * 0.5;
            const gradient = ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, node.size * 1.5
            );
            gradient.addColorStop(0, 'rgba(0, 255, 65, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 255, 65, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size * 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw node circle
            ctx.globalAlpha = node.currentAlpha;
            ctx.fillStyle = 'rgba(0, 20, 40, 0.8)';
            ctx.strokeStyle = config.baseColor;
            ctx.lineWidth = 1;
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Draw data inside node
            ctx.fillStyle = config.baseColor;
            ctx.font = '9px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            if (node.dataType === 'binary') {
                // Binary data
                for (let j = 0; j < 3; j++) {
                    const text = Math.random() > 0.5 ? '0' : '1';
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * node.size * 0.6;
                    const x = node.x + Math.cos(angle) * distance;
                    const y = node.y + Math.sin(angle) * distance;
                    ctx.fillText(text, x, y);
                }
            } else {
                // Hex data
                const text = Math.floor(Math.random() * 16).toString(16).toUpperCase();
                ctx.fillText(text, node.x, node.y);
            }
            
            // Move nodes
            node.x += node.speedX;
            node.y += node.speedY;
            
            // Bounce off edges
            if (node.x < node.size || node.x > canvas.width - node.size) node.speedX *= -1;
            if (node.y < node.size || node.y > canvas.height - node.size) node.speedY *= -1;
        }
        
        // Draw tech lines
        for (let i = 0; i < techLines.length; i++) {
            const line = techLines[i];
            
            // Pulsing alpha
            line.currentAlpha = line.alpha * (0.7 + 0.3 * Math.sin(Date.now() * line.pulseAlpha));
            
            ctx.globalAlpha = line.currentAlpha;
            ctx.strokeStyle = config.baseColor;
            ctx.lineWidth = line.width;
            
            // Data points on lines
            const pointsCount = line.dataPoints;
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
                        ctx.globalAlpha = line.currentAlpha * 0.7;
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
            
            // Bounce off edges
            if (line.x1 < 0 || line.x1 > canvas.width || line.x2 < 0 || line.x2 > canvas.width) {
                line.moveX *= -1;
            }
            if (line.y1 < 0 || line.y1 > canvas.height || line.y2 < 0 || line.y2 > canvas.height) {
                line.moveY *= -1;
            }
        }
        
        // Loop animation
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
}); 