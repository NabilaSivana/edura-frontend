// src/scripts/utils/403.js
const ForbiddenPage = {
    render() {
        return `
      <div class="page-403 flex items-center justify-center px-4">
        <!-- Animated background elements -->
        <div class="floating-circles">
          <div class="floating-circle"></div>
          <div class="floating-circle"></div>
          <div class="floating-circle"></div>
        </div>

        <!-- Main content -->
        <div class="relative z-10 text-center max-w-lg mx-auto">
          <!-- 403 Text with glow effect -->
          <div class="mb-8 relative">
            <h1 class="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 leading-none glitch-text">
              403
            </h1>
            <div class="absolute inset-0 flex items-center justify-center">
              <h1 class="text-8xl md:text-9xl font-bold text-orange-500 opacity-20 blur-sm leading-none animate-pulse">
                403
              </h1>
            </div>
          </div>

          <!-- Warning icon -->
          <div class="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
           <svg height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#FF6465;" d="M256,0C114.615,0,0,114.615,0,256s114.615,256,256,256s256-114.615,256-256S397.385,0,256,0z"></path> <path style="opacity:0.1;enable-background:new ;" d="M70.382,256c0-129.443,96.079-236.43,220.809-253.581 C279.685,0.836,267.942,0,256,0C114.615,0,0,114.615,0,256s114.615,256,256,256c11.942,0,23.685-0.836,35.191-2.419 C166.461,492.429,70.382,385.443,70.382,256z"></path> <path style="fill:#FFFFFF;" d="M409.474,283.1c0,8.378-6.791,15.169-15.169,15.169H117.692c-8.378,0-15.169-6.791-15.169-15.169 v-54.2c0-8.378,6.791-15.169,15.169-15.169h276.614c8.378,0,15.169,6.791,15.169,15.169V283.1z"></path> </g></svg>
          </div>

          <!-- Error message -->
          <div class="mb-8 space-y-4">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-up">
              Akses Dilarang
            </h2>
            <p class="text-gray-300 text-lg leading-relaxed animate-fade-in-up animation-delay-300">
              Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
            </p>
          </div>

          <!-- User Info Card -->
          <div id="user-info" class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-4 mb-6 text-sm border border-gray-600 animate-fade-in-up animation-delay-500">
            <div class="flex items-center justify-center mb-2">
              <i class="fas fa-user-circle text-2xl text-orange-400 mr-3"></i>
              <div class="text-left">
                <p class="text-gray-300">
                  <span class="font-medium">User:</span> <span id="current-user" class="text-orange-300">Loading...</span>
                </p>
                <p class="text-gray-300 mt-1">
                  <span class="font-medium">Role:</span> <span id="current-role" class="text-orange-300">Loading...</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-700">
            <button 
              id="dashboard-btn" 
              class="btn-primary-403 px-8 py-4 text-white font-semibold rounded-xl shadow-lg group"
            >
              <span class="relative z-10 flex items-center gap-2">
                <i class="fas fa-tachometer-alt transition-transform group-hover:scale-110"></i>
                Kembali ke Dashboard
              </span>
            </button>
            
            <button 
              id="contact-admin-btn" 
              class="btn-secondary-403 px-8 py-4 font-semibold rounded-xl group"
            >
              <span class="flex items-center gap-2">
                <i class="fas fa-envelope transition-transform group-hover:scale-110"></i>
                Hubungi Administrator
              </span>
            </button>
          </div>

          <!-- Permission explanation -->
          <div class="mt-12 animate-fade-in-up animation-delay-1000">
            <div class="permission-shield" title="Izin akses diperlukan">
              ⚠️
            </div>
            <p class="text-gray-400 text-sm mt-2">Sistem melindungi konten berdasarkan peran pengguna</p>
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
          .page-403 {
            min-height: 100vh;
            background: linear-gradient(135deg, #92400e 0%, #dc2626 50%, #b45309 100%);
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
            background: rgba(255, 165, 0, 0.05);
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
          .btn-primary-403 {
            background: linear-gradient(135deg, #ea580c, #dc2626);
            border: 2px solid transparent;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .btn-primary-403::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
          }

          .btn-primary-403:hover::before {
            left: 100%;
          }

          .btn-primary-403:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(234, 88, 12, 0.3);
          }

          /* Secondary button styling */
          .btn-secondary-403 {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 2px solid rgba(255, 165, 0, 0.3);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }

          .btn-secondary-403:hover {
            background: rgba(255, 165, 0, 0.2);
            border-color: rgba(255, 165, 0, 0.5);
            transform: translateY(-2px);
          }

          /* Permission shield animation */
          .permission-shield {
            font-size: 3rem;
            animation: pulse-warning 2s ease-in-out infinite;
            cursor: pointer;
            transition: transform 0.3s ease;
          }

          .permission-shield:hover {
            transform: scale(1.2) rotate(-10deg);
          }

          @keyframes pulse-warning {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
          }

          /* Glitch effect for 403 text */
          .glitch-text {
            position: relative;
          }

          .glitch-text::before,
          .glitch-text::after {
            content: '403';
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
            color: #ff6600;
            z-index: -1;
          }

          .glitch-text::after {
            animation: glitch-2 3s infinite;
            color: #ffaa00;
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
            background: #ffa500;
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
        // Display current user info
        this.displayUserInfo();

        // Event listener untuk tombol dashboard
        const dashboardBtn = document.getElementById('dashboard-btn');
        if (dashboardBtn) {
            dashboardBtn.addEventListener('click', () => {
                window.location.hash = '#/dashboard';
            });
        }

        // Event listener untuk tombol contact admin
        const contactBtn = document.getElementById('contact-admin-btn');
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                this.showContactModal();
            });
        }

        // Interactive permission shield
        const shield = document.querySelector('.permission-shield');
        if (shield) {
            shield.addEventListener('click', () => {
                this.createPermissionParticles(shield);
            });
        }

        // Add floating particles effect
        this.createFloatingParticles();

        // Trigger staggered animations
        this.triggerStaggeredAnimations();
    },

    displayUserInfo() {
        try {
            // Try to decode JWT token to get user info
            const token = localStorage.getItem('token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));

                const userElement = document.getElementById('current-user');
                const roleElement = document.getElementById('current-role');

                if (userElement) {
                    userElement.textContent = payload.email || 'Unknown User';
                }

                if (roleElement) {
                    const role = payload.role || 'Unknown Role';
                    roleElement.textContent = role.charAt(0).toUpperCase() + role.slice(1);
                }
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            const userElement = document.getElementById('current-user');
            const roleElement = document.getElementById('current-role');

            if (userElement) userElement.textContent = 'Unknown User';
            if (roleElement) roleElement.textContent = 'Unknown Role';
        }
    },

    showContactModal() {
        // Create a simple modal for contact info
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 transform transition-all duration-300 scale-95">
                <div class="text-center">
                    <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-envelope text-2xl text-orange-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Hubungi Administrator</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-6">
                        Jika Anda merasa ini adalah kesalahan, silakan hubungi administrator sistem untuk bantuan lebih lanjut.
                    </p>
                    <div class="space-y-3">
                        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-left">
                            <p class="text-sm font-medium text-gray-800 dark:text-white">Email Support:</p>
                            <p class="text-sm text-orange-600">cs@edura.web.id</p>
                        </div>
                        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-left">
                            <p class="text-sm font-medium text-gray-800 dark:text-white">Help Desk:</p>
                            <p class="text-sm text-orange-600">+62-851-8408-4989</p>
                        </div>
                    </div>
                    <button 
                        onclick="this.closest('.fixed').remove()"
                        class="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Animate modal in
        setTimeout(() => {
            const modalContent = modal.querySelector('div > div');
            modalContent.classList.remove('scale-95');
            modalContent.classList.add('scale-100');
        }, 10);

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    },

    createPermissionParticles(shield) {
        const particles = ['⚠️', '🚫', '🔒', '❌'];

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

        const particles = ['⚠️', '🚫', '❌', '🔒'];

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

export default ForbiddenPage;