document.addEventListener('DOMContentLoaded', () => {
    const photoContainer = document.getElementById('photoContainer');
    const photoCover = document.getElementById('photoCover');
    const photo = document.getElementById('photo');
    let isRevealed = false;
    let isAnimating = false;

    // Verifica se a foto já foi revelada em sessões anteriores
    if (localStorage.getItem('photoRevealed') === 'true') {
        revealPhoto(true);
    }

    // Adiciona event listeners para clique e tecla Enter
    photoContainer.addEventListener('click', handleReveal);
    photoContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleReveal();
    });

    function handleReveal() {
        if (!isRevealed && !isAnimating) {
            revealPhoto();
            localStorage.setItem('photoRevealed', 'true');
        }
    }

    function revealPhoto(instant = false) {
        if (isAnimating) return;
        
        isAnimating = true;
        isRevealed = true;

        // Play sound effect
        playCrowSound();

        // Configure transitions based on instant reveal or animated
        if (instant) {
            photoCover.style.transition = 'none';
            photo.style.transition = 'none';
            photoCover.style.opacity = '0';
            photoCover.style.pointerEvents = 'none';
            photoCover.style.transform = 'scale(1.1)';
            photo.style.opacity = '1';
            photo.classList.add('revealed');
            isAnimating = false;
        } else {
            photoCover.style.transition = 'opacity 1.2s ease-out, transform 1.5s cubic-bezier(0.19, 1, 0.22, 1)';
            photo.style.transition = 'opacity 1.8s ease-out 0.3s, filter 1.8s ease-out 0.3s';
            photoCover.style.opacity = '0';
            photoCover.style.pointerEvents = 'none';
            photoCover.style.transform = 'scale(1.1)';
            photo.style.opacity = '1';
            photo.classList.add('revealed');

            // Create visual effects
            createCrackEffect();
            createBloodParticles();

            // Reset animation flag after effects complete
            setTimeout(() => {
                isAnimating = false;
            }, 2000);
        }
    }

    function playCrowSound() {
        try {
            const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-creaky-crow-ambience-266.mp3');
            audio.volume = 0.25;
            audio.play().catch(e => console.log("Audio playback prevented:", e.message));
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    }

    function createCrackEffect() {
        const cracks = document.createElement('div');
        cracks.className = 'crack-effect';
        
        // Create SVG with crack paths
        cracks.innerHTML = `
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="crack-svg">
                <path d="M10,10 Q30,15 50,5 T90,20" stroke="rgba(94,0,0,0.7)" stroke-width="0.8" fill="none" stroke-linecap="round"/>
                <path d="M20,80 Q40,70 60,90 T80,60" stroke="rgba(94,0,0,0.7)" stroke-width="0.6" fill="none" stroke-linecap="round"/>
                <path d="M5,50 Q25,30 45,60 T95,30" stroke="rgba(94,0,0,0.7)" stroke-width="0.5" fill="none" stroke-linecap="round"/>
            </svg>
        `;
        
        photoContainer.appendChild(cracks);

        // Animate cracks
        cracks.style.opacity = '1';
        setTimeout(() => {
            cracks.style.transition = 'opacity 1s ease-out';
            cracks.style.opacity = '0';
            setTimeout(() => cracks.remove(), 1000);
        }, 1000);
    }

    function createBloodParticles() {
        const particleCount = 50;
        const containerRect = photoContainer.getBoundingClientRect();
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random starting position
            const startX = Math.random() * containerRect.width;
            const startY = Math.random() * containerRect.height;
            
            // Random movement direction and distance
            const angle = Math.random() * Math.PI * 2;
            const distance = 20 + Math.random() * 40;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            // Random size and appearance
            const size = 1 + Math.random() * 3;
            const hue = 350 + Math.random() * 10;
            const saturation = 70 + Math.random() * 20;
            const lightness = 20 + Math.random() * 15;
            const opacity = 0.7 + Math.random() * 0.3;
            
            // Apply styles
            particle.style.cssText = `
                --tx: ${tx}px;
                --ty: ${ty}px;
                width: ${size}px;
                height: ${size}px;
                background: hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity});
                left: ${startX}px;
                top: ${startY}px;
                border-radius: ${Math.random() > 0.7 ? '0' : '50%'};
                transform: rotate(${Math.random() * 360}deg);
                animation-delay: ${Math.random() * 0.5}s;
            `;
            
            photoContainer.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => {
                particle.remove();
            }, 1500);
        }
    }
});
