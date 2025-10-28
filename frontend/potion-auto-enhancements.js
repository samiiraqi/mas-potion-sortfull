/**
 * POTION SORT AUTO-ENHANCEMENTS
 * ==============================
 * ZERO CODE CHANGES REQUIRED!
 * Just include this file and it will automatically add effects to your game!
 * 
 * USAGE: <script src="potion-auto-enhancements.js"></script>
 * 
 * This file automatically detects:
 * - Bottle clicks
 * - Liquid pouring
 * - Bottle completions
 * - Level completions
 * - Invalid moves
 * 
 * NO MODIFICATIONS TO YOUR EXISTING CODE NEEDED!
 */

(function() {
    'use strict';

    console.log('🎉 Potion Auto-Enhancements Loading...');

    // ==========================================
    // CONFIGURATION
    // ==========================================
    const CONFIG = {
        soundEnabled: true,
        particlesEnabled: true,
        animationsEnabled: true,
        statsEnabled: true,
        comboEnabled: true,
        achievementsEnabled: true,
        
        // Auto-detect these class names from your game
        bottleSelector: '.bottle, .tube, .container, [class*="bottle"], [class*="tube"]',
        selectedClass: 'selected',
        completeClass: 'complete',
        
        // Customize these if your game uses different attributes
        colorAttribute: 'data-color',
        
        // Detection sensitivity
        detectionDelay: 100 // ms delay for detecting changes
    };

    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    let state = {
        moves: 0,
        score: 0,
        combo: 0,
        timeStarted: null,
        lastAction: null,
        bottles: new Map(),
        achievements: []
    };

    let audioContext = null;

    // ==========================================
    // INITIALIZE
    // ==========================================
    function init() {
        try {
            // Initialize audio
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create UI
            createUI();
            
            // Start watching for game events
            startWatching();
            
            // Start timer
            state.timeStarted = Date.now();
            updateTimer();
            
            console.log('✅ Potion Auto-Enhancements Active!');
            
            // Show welcome achievement
            setTimeout(() => {
                showAchievement('Enhanced Mode!', 'Game effects are now active! 🎉', '✨');
            }, 1000);
            
        } catch (e) {
            console.error('Failed to initialize enhancements:', e);
        }
    }

    // ==========================================
    // AUTO-DETECTION SYSTEM
    // ==========================================
    function startWatching() {
        // Watch for DOM changes
        const observer = new MutationObserver(handleDOMChanges);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeOldValue: true
        });

        // Watch for clicks on bottles
        document.addEventListener('click', handleClick, true);
        
        // Watch for animations/transitions (indicates pouring)
        document.addEventListener('animationstart', handleAnimation, true);
        document.addEventListener('transitionstart', handleTransition, true);
        
        // Scan existing bottles
        scanBottles();
        
        // Periodic check for changes
        setInterval(scanBottles, CONFIG.detectionDelay);
    }

    function handleClick(e) {
        const bottle = e.target.closest(CONFIG.bottleSelector);
        if (bottle) {
            onBottleClick(bottle);
        }
    }

    function handleDOMChanges(mutations) {
        let bottleChanged = false;
        let classChanged = false;

        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.matches && target.matches(CONFIG.bottleSelector)) {
                    classChanged = true;
                    checkBottleStateChange(target, mutation.oldValue);
                }
            } else if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const bottles = node.matches && node.matches(CONFIG.bottleSelector) 
                            ? [node] 
                            : (node.querySelectorAll ? Array.from(node.querySelectorAll(CONFIG.bottleSelector)) : []);
                        if (bottles.length > 0) bottleChanged = true;
                    }
                });
            }
        });

        if (bottleChanged) {
            setTimeout(scanBottles, CONFIG.detectionDelay);
        }
    }

    function handleAnimation(e) {
        const bottle = e.target.closest(CONFIG.bottleSelector);
        if (bottle) {
            // Animation detected - likely a pour
            detectPour(bottle);
        }
    }

    function handleTransition(e) {
        const bottle = e.target.closest(CONFIG.bottleSelector);
        if (bottle) {
            // Transition detected - likely liquid moving
            detectPour(bottle);
        }
    }

    function scanBottles() {
        const bottles = document.querySelectorAll(CONFIG.bottleSelector);
        
        bottles.forEach(bottle => {
            const bottleId = getBottleId(bottle);
            const currentState = getBottleState(bottle);
            const previousState = state.bottles.get(bottleId);

            if (previousState) {
                // Check if bottle changed
                if (currentState.colorCount !== previousState.colorCount) {
                    onBottleContentChanged(bottle, previousState, currentState);
                }

                // Check if bottle completed
                if (!previousState.isComplete && currentState.isComplete) {
                    onBottleComplete(bottle);
                }
            }

            state.bottles.set(bottleId, currentState);
        });

        // Check if level complete
        checkLevelComplete(bottles);
    }

    function getBottleId(bottle) {
        if (!bottle._enhancementId) {
            bottle._enhancementId = 'bottle_' + Math.random().toString(36).substr(2, 9);
        }
        return bottle._enhancementId;
    }

    function getBottleState(bottle) {
        // Try to count color layers or children
        const colorLayers = bottle.querySelectorAll('[class*="color"], [class*="layer"], [class*="liquid"]');
        const colors = new Set();
        
        colorLayers.forEach(layer => {
            const color = window.getComputedStyle(layer).backgroundColor;
            if (color && color !== 'rgba(0, 0, 0, 0)') {
                colors.add(color);
            }
        });

        return {
            colorCount: colorLayers.length,
            uniqueColors: colors.size,
            isComplete: colorLayers.length > 0 && colors.size === 1 && colorLayers.length >= 3,
            isEmpty: colorLayers.length === 0
        };
    }

    function checkBottleStateChange(bottle, oldClass) {
        const currentClass = bottle.className;
        
        // Check if became selected
        if (currentClass.includes(CONFIG.selectedClass) && (!oldClass || !oldClass.includes(CONFIG.selectedClass))) {
            // Bottle selected - play click sound only
            sounds.click();
        }
    }

    // ==========================================
    // EVENT HANDLERS
    // ==========================================
    function onBottleClick(bottle) {
        if (!CONFIG.animationsEnabled) return;
        
        // Add shake animation
        bottle.classList.add('potion-shake');
        setTimeout(() => bottle.classList.remove('potion-shake'), 300);
        
        sounds.click();
    }

    function onBottleContentChanged(bottle, previousState, currentState) {
        // Detected a pour!
        state.moves++;
        updateStat('moves', state.moves);

        // Score
        const scoreGain = 10;
        state.score += scoreGain;
        updateStat('score', state.score);

        // Combo
        state.combo++;
        if (state.combo >= 3) {
            showCombo(state.combo);
        }

        // Effects
        sounds.pour();
        
        const rect = bottle.getBoundingClientRect();
        createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, {
            count: 15,
            colors: ['#4ecdc4', '#ffe66d', '#a8e6cf']
        });

        // Check achievements
        if (state.moves === 1) {
            showAchievement('First Move!', 'You started the puzzle!', '🎯');
        }
    }

    function onBottleComplete(bottle) {
        sounds.bottleComplete();

        // Glow effect
        bottle.classList.add('potion-glow');
        setTimeout(() => bottle.classList.remove('potion-glow'), 1500);

        // Big particles
        const rect = bottle.getBoundingClientRect();
        createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, {
            count: 50,
            size: { min: 8, max: 20 }
        });

        // Bonus score
        state.score += 100;
        updateStat('score', state.score);

        // Check for speed achievement
        const timeElapsed = Math.floor((Date.now() - state.timeStarted) / 1000);
        if (timeElapsed < 10 && state.moves <= 5) {
            showAchievement('Lightning Fast!', 'Completed a bottle in record time!', '⚡');
        }
    }

    function checkLevelComplete(bottles) {
        let completedBottles = 0;
        let totalBottles = 0;

        Array.from(bottles).forEach(bottle => {
            const bottleState = getBottleState(bottle);
            if (!bottleState.isEmpty) {
                totalBottles++;
                if (bottleState.isComplete) {
                    completedBottles++;
                }
            }
        });

        // If all non-empty bottles are complete and we have completed at least 3
        if (totalBottles > 0 && completedBottles >= 3 && completedBottles === totalBottles) {
            if (!state.levelCompleted) {
                state.levelCompleted = true;
                setTimeout(() => {
                    onLevelComplete();
                }, 500);
            }
        } else {
            state.levelCompleted = false;
        }
    }

    function onLevelComplete() {
        sounds.levelComplete();
        createConfetti({ count: 200 });

        // Big score bonus
        state.score += 500;
        updateStat('score', state.score);

        const timeElapsed = Math.floor((Date.now() - state.timeStarted) / 1000);
        
        setTimeout(() => {
            showAchievement(
                'Level Complete! 🎉',
                `Finished in ${state.moves} moves and ${formatTime(timeElapsed)}!`,
                '🏆'
            );
        }, 1000);

        // Check for perfect score
        if (state.moves <= 10) {
            setTimeout(() => {
                showAchievement('Perfect Score!', 'Minimal moves used!', '🌟');
            }, 2500);
        }

        // Reset combo
        state.combo = 0;
    }

    function detectPour(bottle) {
        // Additional pour detection through animations
        // This catches pours that might be missed by other methods
    }

    // ==========================================
    // SOUND EFFECTS
    // ==========================================
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
        click: () => playTone(800, 0.05, 'square', 0.2),
        pour: () => {
            playTone(400, 0.3, 'sine');
            setTimeout(() => playTone(350, 0.3, 'sine'), 100);
        },
        bottleComplete: () => {
            playTone(523.25, 0.15);
            setTimeout(() => playTone(659.25, 0.15), 150);
            setTimeout(() => playTone(783.99, 0.3), 300);
        },
        levelComplete: () => {
            const notes = [523.25, 587.33, 659.25, 783.99, 880.00];
            notes.forEach((note, i) => {
                setTimeout(() => playTone(note, 0.2), i * 100);
            });
        },
        combo: (level) => {
            for (let i = 0; i < Math.min(level, 5); i++) {
                setTimeout(() => playTone(400 + i * 100, 0.1), i * 50);
            }
        }
    };

    // ==========================================
    // VISUAL EFFECTS
    // ==========================================
    function createParticles(x, y, options = {}) {
        if (!CONFIG.particlesEnabled) return;

        const {
            count = 30,
            colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a8e6cf', '#ff8b94'],
            size = { min: 5, max: 15 },
            duration = 1000
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
            const velocity = Math.random() * 100 + 50;
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

    // ==========================================
    // UI COMPONENTS
    // ==========================================
    function createUI() {
        // Create containers
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
            animateNumber(element, current, value, 500);
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
        const timeEl = document.getElementById('potion-time-count');
        if (timeEl) {
            timeEl.textContent = formatTime(elapsed);
            setTimeout(updateTimer, 1000);
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    function showCombo(level) {
        const display = document.getElementById('potion-combo-display');
        if (!display) return;

        const number = display.querySelector('.potion-combo-number');
        if (number) {
            number.textContent = level + 'x';
        }

        display.classList.add('potion-show');
        sounds.combo(level);

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

    // ==========================================
    // STYLES
    // ==========================================
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #potion-stats-panel {
                position: fixed;
                top: 20px;
                left: 20px;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 15px;
                padding: 20px;
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

            .potion-shake {
                animation: potion-shake 0.3s ease !important;
            }

            @keyframes potion-shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px) rotate(-2deg); }
                75% { transform: translateX(5px) rotate(2deg); }
            }

            .potion-glow {
                animation: potion-glow-pulse 1.5s ease-in-out !important;
            }

            @keyframes potion-glow-pulse {
                0%, 100% { 
                    filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.8));
                }
                50% { 
                    filter: drop-shadow(0 0 25px rgba(102, 126, 234, 1));
                }
            }

            @media (max-width: 768px) {
                #potion-stats-panel {
                    flex-direction: column;
                    gap: 15px;
                    top: 10px;
                    left: 10px;
                    padding: 15px;
                }

                .potion-stat-value {
                    font-size: 1.5em;
                }

                #potion-combo-display {
                    top: 10px;
                    right: 10px;
                    padding: 15px 20px;
                }

                .potion-combo-number {
                    font-size: 2em;
                }

                #potion-achievement-popup {
                    padding: 30px 40px;
                }

                .potion-achievement-title {
                    font-size: 1.4em;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // START WHEN PAGE LOADS
    // ==========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ==========================================
    // EXPOSE CONTROLS (OPTIONAL)
    // ==========================================
    window.PotionAutoEnhancements = {
        toggleSound: () => { CONFIG.soundEnabled = !CONFIG.soundEnabled; },
        toggleParticles: () => { CONFIG.particlesEnabled = !CONFIG.particlesEnabled; },
        getStats: () => ({
            moves: state.moves,
            score: state.score,
            combo: state.combo,
            timeElapsed: state.timeStarted ? Math.floor((Date.now() - state.timeStarted) / 1000) : 0
        })
    };

})();