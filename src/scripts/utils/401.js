// src/scripts/utils/401.js
const UnauthorizedPage = {
    render() {
        return `
      <div class="page-401 flex items-center justify-center px-4">
        <!-- Animated background elements -->
        <div class="floating-circles">
          <div class="floating-circle"></div>
          <div class="floating-circle"></div>
          <div class="floating-circle"></div>
        </div>

        <!-- Main content -->
        <div class="relative z-10 text-center max-w-lg mx-auto">
          <!-- 401 Text with glow effect -->
          <div class="mb-8 relative">
            <h1 class="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 leading-none glitch-text">
              401
            </h1>
            <div class="absolute inset-0 flex items-center justify-center">
              <h1 class="text-8xl md:text-9xl font-bold text-red-500 opacity-20 blur-sm leading-none animate-pulse">
                401
              </h1>
            </div>
          </div>

          <!-- Lock icon -->
          <div class="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg class="w-12 h-12 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>

          <!-- Error message -->
          <div class="mb-8 space-y-4">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
              Akses Tidak Diizinkan
            </h2>
            <p class="text-gray-300 text-lg leading-relaxed animate-fade-in-up animation-delay-300">
              Anda perlu login terlebih dahulu untuk mengakses halaman ini. Silakan masuk ke akun Anda untuk melanjutkan.
            </p>
            <p class="text-gray-400 text-sm font-mono bg-gray-800 bg-opacity-50 p-3 rounded-lg inline-block animate-fade-in-up animation-delay-500">
              Status: Unauthorized Access
            </p>
          </div>

          <!-- Action buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-700">
            <button 
              id="login-btn" 
              class="btn-primary-401 px-8 py-4 text-white font-semibold rounded-xl shadow-lg group"
            >
              <span class="relative z-10 flex items-center gap-2">
                <i class="fas fa-sign-in-alt transition-transform group-hover:scale-110"></i>
                Login Sekarang
              </span>
            </button>
            
            <button 
              id="home-btn" 
              class="btn-secondary-401 px-8 py-4 font-semibold rounded-xl group"
            >
              <span class="flex items-center gap-2">
                <i class="fas fa-home transition-transform group-hover:-translate-x-1"></i>
                Kembali ke Beranda
              </span>
            </button>
          </div>

          <!-- Security message -->
          <div class="mt-12 animate-fade-in-up animation-delay-1000">
            <div class="security-shield" title="Keamanan terjaga">
              🛡️
            </div>
            <p class="text-gray-400 text-sm mt-2">Sistem keamanan melindungi konten pribadi Anda</p>
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

        <style>
          .page-401 {
            min-height: 100vh;
            background: linear-gradient(135deg, #1e3a8a 0%, #991b1b 50%, #dc2626 100%);
            position: relative;
            overflow: hidden;
          }

          /* Floating circles background */
          .floating-circles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
          }

          .floating-circle {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            animation: float 8s ease-in-out infinite;
          }

          .floating-circle:nth-child(1) {
            width: 300px;
            height: 300px;
            top: -150px;
            right: -150px;
            animation-delay: 0s;
          }

          .floating-circle:nth-child(2) {
            width: 200px;
            height: 200px;
            bottom: -100px;
            left: -100px;
            animation-delay: 2s;
          }

          .floating-circle:nth-child(3) {
            width: 150px;
            height: 150px;
            top: 50%;
            left: -75px;
            animation-delay: 4s;
          }

          /* Primary button styling */
          .btn-primary-401 {
            background: linear-gradient(135deg, #dc2626, #991b1b);
            border: 2px solid transparent;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .btn-primary-401::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
          }

          .btn-primary-401:hover::before {
            left: 100%;
          }

          .btn-primary-401:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(220, 38, 38, 0.3);
          }

          /* Secondary button styling */
          .btn-secondary-401 {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }

          .btn-secondary-401:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.4);
            transform: translateY(-2px);
          }

          /* Security shield animation */
          .security-shield {
            font-size: 3rem;
            animation: pulse-shield 2s ease-in-out infinite;
            cursor: pointer;
            transition: transform 0.3s ease;
          }

          .security-shield:hover {
            transform: scale(1.2) rotate(10deg);
          }

          @keyframes pulse-shield {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
          }

          /* Glitch effect for 401 text */
          .glitch-text {
            position: relative;
          }

          .glitch-text::before,
          .glitch-text::after {
            content: '401';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: inherit;
            -webkit-background-clip: text;
            background-clip: text;
          }

          .glitch-text::before {
            animation: glitch-1 2s infinite;
            color: #ff0000;
            z-index: -1;
          }

          .glitch-text::after {
            animation: glitch-2 3s infinite;
            color: #00ff00;
            z-index: -2;
          }

          @keyframes glitch-1 {
            0%, 100% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
          }

          @keyframes glitch-2 {
            0%, 100% { transform: translate(0); }
            25% { transform: translate(2px, 0); }
            50% { transform: translate(-2px, 0); }
            75% { transform: translate(0, 2px); }
          }

          /* Float animation */
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-20px) rotate(5deg); }
            50% { transform: translateY(-10px) rotate(10deg); }
            75% { transform: translateY(-30px) rotate(5deg); }
          }

          /* Stars */
          .stars {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
          }

          .star {
            position: absolute;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            animation: twinkle 2s infinite;
          }

          .star:nth-child(1) { top: 20%; left: 20%; animation-delay: 0s; }
          .star:nth-child(2) { top: 40%; left: 80%; animation-delay: 0.5s; }
          .star:nth-child(3) { top: 80%; left: 30%; animation-delay: 1s; }
          .star:nth-child(4) { top: 30%; left: 70%; animation-delay: 1.5s; }
          .star:nth-child(5) { top: 70%; left: 60%; animation-delay: 2s; }

          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }

          /* Fade in up animation */
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
            opacity: 0;
          }

          .animation-delay-300 { animation-delay: 0.3s; }
          .animation-delay-500 { animation-delay: 0.5s; }
          .animation-delay-700 { animation-delay: 0.7s; }
          .animation-delay-1000 { animation-delay: 1s; }

          /* Floating particles */
          .floating-particle {
            position: absolute;
            pointer-events: none;
            animation: float-particle 3s ease-out forwards;
            z-index: 100;
          }

          @keyframes float-particle {
            0% {
              opacity: 0.8;
              transform: translateY(0) rotate(0deg) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-100px) rotate(180deg) scale(0.5);
            }
          }

          /* Responsive adjustments */
          @media (max-width: 640px) {
            .glitch-text, .glitch-text::before, .glitch-text::after {
              font-size: 4rem;
            }
            
            .floating-circle:nth-child(1) {
              width: 200px;
              height: 200px;
              top: -100px;
              right: -100px;
            }
            
            .floating-circle:nth-child(2) {
              width: 150px;
              height: 150px;
              bottom: -75px;
              left: -75px;
            }
          }
        </style>
      </div>
    `;
    },

    async afterRender() {
        // Event listener untuk tombol login
        const loginBtn = document.getElementById('login-btn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                // Store the intended destination before redirecting to login
                const currentPath = window.location.hash.replace('#', '');
                if (currentPath && currentPath !== '/login') {
                    sessionStorage.setItem('redirectAfterLogin', currentPath);
                }
                window.location.hash = '#/login';
            });
        }

        // Event listener untuk tombol home
        const homeBtn = document.getElementById('home-btn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                window.location.hash = '#/';
            });
        }

        // Interactive security shield
        const shield = document.querySelector('.security-shield');
        if (shield) {
            shield.addEventListener('click', () => {
                this.createSecurityParticles(shield);
            });
        }

        // Add floating particles effect
        this.createFloatingParticles();

        // Trigger staggered animations
        this.triggerStaggeredAnimations();
    },

    createSecurityParticles(shield) {
        const particles = ['🔒', '🛡️', '🔐', '⚡'];

        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
                particle.className = 'floating-particle';

                // Get shield position
                const rect = shield.getBoundingClientRect();
                particle.style.left = (rect.left + rect.width / 2) + 'px';
                particle.style.top = (rect.top + rect.height / 2) + 'px';
                particle.style.position = 'fixed';
                particle.style.fontSize = '1.5rem';
                particle.style.zIndex = '9999';

                document.body.appendChild(particle);

                // Remove after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                }, 3000);
            }, i * 200);
        }
    },

    createFloatingParticles() {
        const container = document.querySelector('.stars');
        if (!container) return;

        const particles = ['🔐', '🛡️', '⚡', '🔒'];

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
                particle.className = 'floating-particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.fontSize = (Math.random() * 0.8 + 0.6) + 'rem';
                particle.style.opacity = '0.6';

                container.appendChild(particle);

                // Animate particle
                particle.animate([
                    {
                        transform: 'translateY(0) rotate(0deg) scale(1)',
                        opacity: 0.6
                    },
                    {
                        transform: 'translateY(-80px) rotate(180deg) scale(0.5)',
                        opacity: 0
                    }
                ], {
                    duration: 4000 + Math.random() * 2000,
                    easing: 'ease-out'
                }).onfinish = () => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                };
            }, i * 800);
        }

        // Create new batch periodically
        setTimeout(() => {
            this.createFloatingParticles();
        }, 20000);
    },

    triggerStaggeredAnimations() {
        setTimeout(() => {
            const animatedElements = document.querySelectorAll('.animate-fade-in-up');
            animatedElements.forEach((element) => {
                element.style.animationPlayState = 'running';
            });
        }, 100);
    }
};

export default UnauthorizedPage;