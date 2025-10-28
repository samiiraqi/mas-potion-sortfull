/**
 * POTION SORT AUTO-ENHANCEMENTS (SVG VERSION)
 * ============================================
 * Optimized for SVG-based bottle games
 * Works with your existing game without code changes!
 * 
 * USAGE: <script src="potion-auto-enhancements-svg.js"></script>
 */

(function() {
    'use strict';

    console.log('🎉 Potion Auto-Enhancements (SVG) Loading...');

    // Configuration
    const CONFIG = {
        particlesEnabled: true,
        animationsEnabled: true,
        statsEnabled: true,
        comboEnabled: true,
        achievementsEnabled: true,
        confettiEnabled: true,
        soundEnabled: true
    };

    // State
    let state = {
        moves: 0,
        score: 0,
        combo: 0,
        timeStarted: null,
        lastClickTime: 0,
        achievements: [],
        currentLevel: null,
        lastLevel: null
    };

    // Audio Context
    let audioContext = null;

    // Initialize
    function init() {
        try {
            // Initialize audio
            initAudio();
            
            createUI();
            setupEventListeners();
            state.timeStarted = Date.now();
            updateTimer();
            
            console.log('✅ Potion Auto-Enhancements (SVG) Active!');
            
            setTimeout(() => {
                showAchievement('Enhanced Mode!', 'Visual effects are now active! 🎉', '✨');
                sounds.achievement();
            }, 1000);
            
        } catch (e) {
            console.error('Failed to initialize enhancements:', e);
        }
    }

    // Initialize Audio
    function initAudio() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🔊 Audio system initialized!');
        } catch (e) {
            console.warn('Web Audio API not supported');
            CONFIG.soundEnabled = false;
        }
    }

    // Sound System - Web Audio API
    function playTone(frequency, duration, type = 'sine', volume = 0.3) {
        if (!CONFIG.soundEnabled || !audioContext) return;
        
        try {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            // Silently fail if audio doesn't work
        }
    }

    const sounds = {
        click: () => {
            playTone(800, 0.05, 'square', 0.2);
        },
        
        pour: () => {
            playTone(400, 0.3, 'sine');
            setTimeout(() => playTone(350, 0.3, 'sine'), 100);
        },
        
        bottleComplete: () => {
            playTone(523.25, 0.15); // C
            setTimeout(() => playTone(659.25, 0.15), 150); // E
            setTimeout(() => playTone(783.99, 0.3), 300); // G
        },
        
        levelComplete: () => {
            const notes = [523.25, 587.33, 659.25, 783.99, 880.00];
            notes.forEach((note, i) => {
                setTimeout(() => playTone(note, 0.2), i * 100);
            });
        },
        
        combo: (comboLevel) => {
            for (let i = 0; i < Math.min(comboLevel, 5); i++) {
                setTimeout(() => playTone(400 + i * 100, 0.1), i * 50);
            }
        },
        
        achievement: () => {
            playTone(523.25, 0.1);
            setTimeout(() => playTone(659.25, 0.1), 100);
            setTimeout(() => playTone(783.99, 0.2), 200);
            setTimeout(() => playTone(1046.50, 0.3), 350);
        }
    };

    // Event Listeners
    function setupEventListeners() {
        // Listen for SVG bottle clicks
        document.addEventListener('click', handleBottleClick, true);
        
        // Watch for DOM changes (bottle completion, level complete)
        const observer = new MutationObserver(checkGameState);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
        
        // Also check periodically for level changes
        setInterval(detectLevelCompletion, 1000);
    }

    function handleBottleClick(e) {
        const target = e.target;
        
        // Check if clicked on SVG bottle elements
        if (target.tagName === 'svg' || target.tagName === 'rect' || 
            target.tagName === 'g' || target.tagName === 'ellipse' ||
            target.closest('svg')) {
            
            // Play click sound
            sounds.click();
            
            // Get position for particles
            const element = target.getBoundingClientRect ? target : target.closest('svg');
            if (!element) return;
            
            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            // Track moves and combo
            const now = Date.now();
            if (now - state.lastClickTime < 2000) {
                state.combo++;
                if (state.combo >= 3) {
                    sounds.combo(state.combo);
                }
            } else {
                state.combo = 1;
            }
            state.lastClickTime = now;
            
            state.moves++;
            updateStat('moves', state.moves);
            
            // Score
            state.score += 10;
            updateStat('score', state.score);
            
            // Show combo
            if (state.combo >= 3) {
                showCombo(state.combo);
            }
            
            // Create particles with pour sound occasionally
            if (state.moves % 2 === 0) {
                sounds.pour();
            }
            
            createParticles(x, y, {
                count: 20,
                colors: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94']
            });
            
            // Check achievements
            checkAchievements();
        }
    }

    function checkGameState() {
        // Detect level completion by watching for level changes
        detectLevelCompletion();
    }

    function detectLevelCompletion() {
        // Look for level indicators in the page
        const bodyText = document.body.innerText;
        const levelMatch = bodyText.match(/Level\s*[:\s]*(\d+)/i) || 
                          bodyText.match(/Niveau\s*[:\s]*(\d+)/i) ||
                          bodyText.match(/(\d+)\s*\/\s*\d+/); // Match "4/100" style
        
        if (levelMatch) {
            const currentLevel = parseInt(levelMatch[1]);
            
            // Initialize on first detection
            if (state.lastLevel === null) {
                state.lastLevel = currentLevel;
                state.currentLevel = currentLevel;
                return;
            }
            
            // Level increased = previous level completed!
            if (currentLevel > state.lastLevel) {
                console.log(`🎊 Level ${state.lastLevel} Complete! Moving to Level ${currentLevel}!`);
                
                // SOUNDS!
                sounds.levelComplete();
                
                // CONFETTI TIME! 🎊
                createConfetti({ count: 200 });
                
                // Big achievement popup
                setTimeout(() => {
                    showAchievement(
                        `Level ${state.lastLevel} Complete! 🎉`,
                        `Great job! Starting Level ${currentLevel}!`,
                        '🏆'
                    );
                }, 500);
                
                // Bonus score
                state.score += 500;
                updateStat('score', state.score);
                
                // Reset for new level
                state.lastLevel = currentLevel;
                state.currentLevel = currentLevel;
                state.combo = 0;
            }
        }
    }

    // Particle System
    function createParticles(x, y, options = {}) {
        if (!CONFIG.particlesEnabled) return;

        const {
            count = 20,
            colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94'],
            size = { min: 5, max: 12 },
            duration = 800
        } = options;

        const container = document.getElementById('potion-particles');
        if (!container) return;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            const particleSize = Math.random() * (size.max - size.min) + size.min;
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: ${particleSize}px;
                height: ${particleSize}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
            `;

            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 80 + 40;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'ease-out'
            });

            container.appendChild(particle);
            setTimeout(() => particle.remove(), duration);
        }
    }

    function createConfetti(options = {}) {
        if (!CONFIG.confettiEnabled) return;
        
        const canvas = document.getElementById('potion-confetti');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { count = 150, colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94'] } = options;

        const particles = [];

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 5 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 3 + 2,
                speedX: Math.random() * 2 - 1,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 10 - 5
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, index) => {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();

                p.y += p.speedY;
                p.x += p.speedX;
                p.rotation += p.rotationSpeed;

                if (p.y > canvas.height) {
                    particles.splice(index, 1);
                }
            });

            if (particles.length > 0) {
                requestAnimationFrame(animate);
            }
        }

        animate();
    }

    // UI Components
    function createUI() {
        createParticleContainer();
        createConfettiCanvas();
        if (CONFIG.statsEnabled) createStatsPanel();
        if (CONFIG.comboEnabled) createComboDisplay();
        if (CONFIG.achievementsEnabled) createAchievementPopup();
        injectStyles();
    }

    function createParticleContainer() {
        const container = document.createElement('div');
        container.id = 'potion-particles';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
        `;
        document.body.appendChild(container);
    }

    function createConfettiCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'potion-confetti';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(canvas);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    function createStatsPanel() {
        const panel = document.createElement('div');
        panel.id = 'potion-stats-panel';
        panel.innerHTML = `
            <div class="potion-stat">
                <div class="potion-stat-value" id="potion-moves-count">0</div>
                <div class="potion-stat-label">Moves</div>
            </div>
            <div class="potion-stat">
                <div class="potion-stat-value" id="potion-time-count">0:00</div>
                <div class="potion-stat-label">Time</div>
            </div>
            <div class="potion-stat">
                <div class="potion-stat-value" id="potion-score-count">0</div>
                <div class="potion-stat-label">Score</div>
            </div>
        `;
        document.body.appendChild(panel);
    }

    function createComboDisplay() {
        const display = document.createElement('div');
        display.id = 'potion-combo-display';
        display.innerHTML = `
            <div class="potion-combo-number">0x</div>
            <div class="potion-combo-label">COMBO!</div>
        `;
        document.body.appendChild(display);
    }

    function createAchievementPopup() {
        const popup = document.createElement('div');
        popup.id = 'potion-achievement-popup';
        popup.innerHTML = `
            <div class="potion-achievement-icon">🏆</div>
            <div class="potion-achievement-title">Achievement Unlocked!</div>
            <div class="potion-achievement-desc">Great job!</div>
        `;
        document.body.appendChild(popup);
    }

    function updateStat(statName, value) {
        const element = document.getElementById(`potion-${statName}-count`);
        if (element) {
            const current = parseInt(element.textContent) || 0;
            animateNumber(element, current, value, 300);
        }
    }

    function animateNumber(element, from, to, duration) {
        const start = Date.now();
        
        function update() {
            const progress = Math.min((Date.now() - start) / duration, 1);
            const current = Math.floor(from + (to - from) * progress);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        update();
    }

    function updateTimer() {
        if (!state.timeStarted) return;

        const elapsed = Math.floor((Date.now() - state.timeStarted) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        const timeEl = document.getElementById('potion-time-count');
        if (timeEl) {
            timeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            setTimeout(updateTimer, 1000);
        }
    }

    function showCombo(level) {
        const display = document.getElementById('potion-combo-display');
        if (!display) return;

        const number = display.querySelector('.potion-combo-number');
        if (number) {
            number.textContent = level + 'x';
        }

        display.classList.add('potion-show');

        setTimeout(() => {
            display.classList.remove('potion-show');
        }, 3000);
    }

    function showAchievement(title, description, icon = '🏆') {
        const popup = document.getElementById('potion-achievement-popup');
        if (!popup) return;

        const iconEl = popup.querySelector('.potion-achievement-icon');
        const titleEl = popup.querySelector('.potion-achievement-title');
        const descEl = popup.querySelector('.potion-achievement-desc');

        if (iconEl) iconEl.textContent = icon;
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = description;

        popup.classList.add('potion-show');
        
        setTimeout(() => {
            popup.classList.remove('potion-show');
        }, 4000);
    }

    function checkAchievements() {
        if (state.moves === 10 && !state.achievements.includes('10moves')) {
            state.achievements.push('10moves');
            showAchievement('Getting Started!', 'Made 10 moves!', '🎯');
        }
        
        if (state.combo >= 5 && !state.achievements.includes('combo5')) {
            state.achievements.push('combo5');
            showAchievement('Combo Master!', `${state.combo}x combo!`, '🔥');
        }
        
        if (state.score >= 500 && !state.achievements.includes('score500')) {
            state.achievements.push('score500');
            showAchievement('Score Milestone!', 'Reached 500 points!', '💎');
        }
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #potion-stats-panel {
                position: fixed;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 255, 255, 0.95);
                border-radius: 15px;
                padding: 15px 25px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                display: flex;
                gap: 30px;
                z-index: 100000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }

            .potion-stat {
                text-align: center;
            }

            .potion-stat-value {
                font-size: 2em;
                font-weight: bold;
                color: #667eea;
            }

            .potion-stat-label {
                font-size: 0.9em;
                color: #666;
                text-transform: uppercase;
                margin-top: 5px;
            }

            #potion-combo-display {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.95);
                padding: 20px 30px;
                border-radius: 15px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                transform: scale(0);
                transition: transform 0.3s ease;
                z-index: 100000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }

            #potion-combo-display.potion-show {
                transform: scale(1);
                animation: potion-combo-bounce 0.5s ease;
            }

            @keyframes potion-combo-bounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            .potion-combo-number {
                font-size: 3em;
                font-weight: bold;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-align: center;
            }

            .potion-combo-label {
                text-align: center;
                color: #666;
                font-weight: bold;
                text-transform: uppercase;
                margin-top: 5px;
            }

            #potion-achievement-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0);
                background: white;
                padding: 40px 50px;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.4);
                text-align: center;
                z-index: 100001;
                transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }

            #potion-achievement-popup.potion-show {
                transform: translate(-50%, -50%) scale(1);
            }

            .potion-achievement-icon {
                font-size: 4em;
                margin-bottom: 15px;
            }

            .potion-achievement-title {
                font-size: 1.8em;
                color: #667eea;
                margin-bottom: 10px;
                font-weight: bold;
            }

            .potion-achievement-desc {
                color: #666;
                font-size: 1.1em;
            }

            @media (max-width: 768px) {
                #potion-stats-panel {
                    top: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    flex-direction: row;
                    gap: 15px;
                    padding: 10px 15px;
                    max-width: 90%;
                }

                .potion-stat {
                    min-width: 60px;
                }

                .potion-stat-value {
                    font-size: 1.3em;
                }

                .potion-stat-label {
                    font-size: 0.7em;
                }

                #potion-combo-display {
                    top: 140px;
                    right: 10px;
                    padding: 10px 15px;
                }

                .potion-combo-number {
                    font-size: 1.8em;
                }

                .potion-combo-label {
                    font-size: 0.8em;
                }

                #potion-achievement-popup {
                    padding: 30px 40px;
                    max-width: 85%;
                }

                .potion-achievement-title {
                    font-size: 1.4em;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Public API
    window.PotionAutoEnhancements = {
        triggerConfetti: () => createConfetti({ count: 200 }),
        triggerParticles: (x, y) => createParticles(x, y, { count: 50 }),
        showAchievement: showAchievement,
        toggleSound: () => { 
            CONFIG.soundEnabled = !CONFIG.soundEnabled;
            console.log(`🔊 Sound ${CONFIG.soundEnabled ? 'enabled' : 'disabled'}`);
        },
        enableSound: () => { CONFIG.soundEnabled = true; },
        disableSound: () => { CONFIG.soundEnabled = false; },
        playSound: (soundName) => {
            if (sounds[soundName]) sounds[soundName]();
        },
        getStats: () => ({
            moves: state.moves,
            score: state.score,
            combo: state.combo,
            timeElapsed: state.timeStarted ? Math.floor((Date.now() - state.timeStarted) / 1000) : 0
        }),
        reset: () => {
            state.moves = 0;
            state.score = 0;
            state.combo = 0;
            state.timeStarted = Date.now();
            updateStat('moves', 0);
            updateStat('score', 0);
        }
    };

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();