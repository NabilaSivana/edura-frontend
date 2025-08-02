// src/scripts/utils/404.js
const NotFoundPage = {
    render() {
        return `
      <div class="page-404 flex items-center justify-center px-4">
        <!-- Animated background elements -->
        <div class="floating-circles">
          <div class="floating-circle"></div>
          <div class="floating-circle"></div>
          <div class="floating-circle"></div>
        </div>

        <!-- Main content -->
        <div class="relative z-10 text-center max-w-lg mx-auto">
          <!-- 404 Text with glow effect -->
          <div class="mb-8 relative">
            <h1 class="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 leading-none glitch-text">
              404
            </h1>
            <div class="absolute inset-0 flex items-center justify-center">
              <h1 class="text-9xl md:text-[12rem] font-bold text-purple-500 opacity-20 blur-sm leading-none animate-pulse">
                404
              </h1>
            </div>
          </div>

          <!-- Error message -->
          <div class="mb-8 space-y-4">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
              Oops! Halaman Tidak Ditemukan
            </h2>
            <p class="text-gray-300 text-lg leading-relaxed animate-fade-in-up animation-delay-300">
              Sepertinya halaman yang Anda cari telah berpindah ke dimensi lain atau belum tersedia.
            </p>
            <p class="text-gray-400 text-sm font-mono bg-gray-800 bg-opacity-50 p-3 rounded-lg inline-block animate-fade-in-up animation-delay-500">
              ${window.location.hash || 'Unknown route'}
            </p>
          </div>

          <!-- Action buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-700">
            <button 
              id="back-home-btn" 
              class="btn-primary-404 px-8 py-4 text-white font-semibold rounded-xl shadow-lg"
            >
              <span class="relative z-10 flex items-center gap-2">
                <i class="fas fa-home transition-transform group-hover:-translate-x-1"></i>
                Kembali ke Beranda
              </span>
            </button>
            
            <button 
              id="go-back-btn" 
              class="btn-secondary-404 px-8 py-4 font-semibold rounded-xl"
            >
              <span class="flex items-center gap-2">
                <i class="fas fa-arrow-left transition-transform group-hover:-translate-x-1"></i>
                Halaman Sebelumnya
              </span>
            </button>
          </div>

          <!-- Fun interactive element -->
          <div class="mt-12 animate-fade-in-up animation-delay-1000">
            <div class="floating-astronaut" title="Klik untuk efek surprise!">
              🚀
            </div>
            <p class="text-gray-400 text-sm mt-2">Astronot kecil sedang mencari halaman yang hilang...</p>
          </div>
        </div>

        <!-- Particles/Stars background -->
        <div class="stars">
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
        </div>
      </div>
    `;
    },

    afterRender() {
        // Event listener untuk tombol kembali ke beranda
        const backHomeBtn = document.getElementById('back-home-btn');
        if (backHomeBtn) {
            backHomeBtn.addEventListener('click', () => {
                window.location.hash = '#/dashboard';
            });
        }

        // Event listener untuk tombol kembali ke halaman sebelumnya
        const goBackBtn = document.getElementById('go-back-btn');
        if (goBackBtn) {
            goBackBtn.addEventListener('click', () => {
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.hash = '#/dashboard';
                }
            });
        }

        // Fun interactive element - astronaut click effect
        const astronaut = document.querySelector('.floating-astronaut');
        if (astronaut) {
            astronaut.addEventListener('click', () => {
                this.createShootingStarEffect(astronaut);
                this.astronautBounceEffect(astronaut);
            });
        }

        // Add some dynamic particles
        this.createFloatingParticles();

        // Trigger staggered animations
        this.triggerStaggeredAnimations();
    },

    createShootingStarEffect(astronaut) {
        const shootingStar = document.createElement('div');
        shootingStar.innerHTML = '⭐';
        shootingStar.className = 'floating-particle animate-shooting-star';

        // Get astronaut position relative to viewport
        const rect = astronaut.getBoundingClientRect();
        shootingStar.style.left = rect.left + rect.width / 2 + 'px';
        shootingStar.style.top = rect.top + rect.height / 2 + 'px';
        shootingStar.style.position = 'fixed';
        shootingStar.style.zIndex = '9999';
        shootingStar.style.fontSize = '2rem';

        document.body.appendChild(shootingStar);

        // Remove after animation
        setTimeout(() => {
            if (shootingStar.parentNode) {
                shootingStar.remove();
            }
        }, 1000);
    },

    astronautBounceEffect(astronaut) {
        // Temporarily stop floating animation
        astronaut.style.animation = 'none';
        astronaut.style.transform = 'scale(1.2) rotate(360deg)';

        // Reset after bounce
        setTimeout(() => {
            astronaut.style.animation = '';
            astronaut.style.transform = '';
            astronaut.classList.add('animate-float');
        }, 600);
    },

    triggerStaggeredAnimations() {
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
            const animatedElements = document.querySelectorAll('.animate-fade-in-up');
            animatedElements.forEach((element, index) => {
                element.style.animationPlayState = 'running';
            });
        }, 100);
    },

    createFloatingParticles() {
        const container = document.querySelector('.stars');
        if (!container) return;

        const particles = ['✨', '⭐', '🌟', '💫'];

        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
                particle.className = 'floating-particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.fontSize = (Math.random() * 0.5 + 0.5) + 'rem';

                container.appendChild(particle);

                // Animate particle using CSS animation
                particle.animate([
                    {
                        transform: 'translateY(0) rotate(0deg)',
                        opacity: 0.6
                    },
                    {
                        transform: 'translateY(-50px) rotate(180deg)',
                        opacity: 0
                    }
                ], {
                    duration: 3000 + Math.random() * 2000,
                    easing: 'ease-out'
                }).onfinish = () => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                };
            }, i * 500);
        }

        // Continuously create new particles
        setTimeout(() => {
            this.createFloatingParticles();
        }, 15000); // Create new batch every 15 seconds
    }
};

export default NotFoundPage;