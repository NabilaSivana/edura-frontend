import "../../../styles/style.css"; // jika pakai tailwind

const LandingPage = {
  async render() {
    return `
      <div class="dark:bg-gray-900">
        <!-- Navbar Container - Fixed positioning -->
        <nav id="navbar-container" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50"></nav>
        
        <!-- Hero Section -->
        <section class="relative pt-20 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
          <!-- Background decorative elements -->
          <div class="absolute inset-0 overflow-hidden">
            <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-30 animate-blob"></div>
            <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 dark:bg-purple-900/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-30 animate-blob animation-delay-2000"></div>
            <div class="absolute top-40 left-40 w-80 h-80 bg-pink-100 dark:bg-pink-900/50 rounded-full mix-blend-multiply filter blur-xl opacity-70 dark:opacity-30 animate-blob animation-delay-4000"></div>
          </div>

          <div class="relative py-12 px-4 sm:px-6 md:px-8 mx-auto max-w-screen-xl">
            <div class="flex flex-wrap lg:flex-nowrap items-center justify-between gap-8 min-h-[70vh]">
              <!-- Left Content -->
              <div class="flex-1 min-w-[320px] text-center lg:text-left animate-fade-in-up">
                <div class="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-6 animate-bounce-soft">
                  🚀 Platform Pembelajaran AI Terdepan
                </div>
                
                <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
                  LMS Berbasis 
                  <span class="relative">
                    <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI</span>
                    <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 animate-pulse"></div>
                  </span>
                </h1>
                
                <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-800 dark:text-gray-200 mb-6">
                  <span class="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Personalisasi</span> 
                  Pembelajaran Mandiri
                </h2>
                
                <p class="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl leading-relaxed">
                  <span class="font-semibold text-blue-600 dark:text-blue-400">Sahabat Belajarmu:</span> Belajar Bebas, Cerdas Tanpa Batas dengan kekuatan Artificial Intelligence
                </p>
                
                <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                  <a href="/#/login" class="group inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
                    <span>Mulai Belajar Sekarang</span>
                    <svg class="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                  </a>
                  
                  <a href="/#be-teacher" class="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border-2 border-blue-600 dark:border-blue-400 rounded-2xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                    Pengajuan Dosen
                  </a>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">1000+</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">Pengguna Aktif</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">50+</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">Materi Pembelajaran</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-pink-600 dark:text-pink-400">4.9★</div>
                    <div class="text-sm text-gray-600 dark:text-gray-300">Rating Pengguna</div>
                  </div>
                </div>
              </div>

              <!-- Right Content - Animated Mascot -->
              <div class="flex-1 flex justify-center items-center animate-fade-in-right">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-700/50 dark:to-purple-700/50 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                  <img src="maskot1.png" alt="Robot mascot" class="relative w-auto h-auto max-w-[320px] lg:max-w-[400px] animate-float drop-shadow-2xl">
                  
                  <!-- Floating elements around mascot -->
                  <div class="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 dark:bg-yellow-500 rounded-full animate-bounce-slow opacity-80"></div>
                  <div class="absolute top-1/4 -left-6 w-6 h-6 bg-pink-400 dark:bg-pink-500 rounded-full animate-bounce-slower opacity-80"></div>
                  <div class="absolute bottom-1/4 -right-8 w-4 h-4 bg-green-400 dark:bg-green-500 rounded-full animate-bounce-slowest opacity-80"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Tentang EduraApp -->
        <section id="about" class="relative py-20 px-4 mx-auto max-w-screen-xl dark:bg-gray-900">
          <div class="text-center animate-fade-in-up mb-12">
            <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Tentang <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EduraApp</span>
            </h2>
            <div class="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-12"></div>
          </div>

          <div class="relative max-w-6xl mx-auto">
            <!-- Content with robot -->
            <div class="flex flex-col lg:flex-row items-center gap-8">
              <!-- Left side - Robot mascot -->
              <div class="w-full lg:w-1/4 flex justify-center lg:justify-start animate-slide-in-left">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-700/50 dark:to-purple-700/50 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <img src="maskot2.png" alt="Robot mascot" class="relative w-32 md:w-40 lg:w-48 h-auto animate-wiggle drop-shadow-lg" />
                </div>
              </div>
              
              <!-- Right side - Content -->
              <div class="w-full lg:w-3/4">
                <div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 p-8 sm:p-12 rounded-3xl relative border border-blue-100 dark:border-gray-700 shadow-xl">
                  <div class="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20 dark:from-blue-900/10 dark:to-purple-900/10 rounded-3xl"></div>
                  <p class="relative text-gray-700 dark:text-gray-300 text-lg sm:text-xl md:text-2xl leading-relaxed font-medium text-left">
                    EduraApp merupakan sebuah platform kerangka kerja AI yang dapat terintegrasi dengan LMS, 
                    sehingga mampu <span class="font-bold text-blue-600 dark:text-blue-400">menyusun rekomendasi materi secara otomatis</span> 
                    yang diharapkan platform ini dapat menambah pengetahuan mahasiswa di samping materi kurikulum.
                  </p>
                  
                  <!-- Additional highlight points -->
                  <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="flex items-center space-x-3">
                      <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span class="text-gray-600 dark:text-gray-300 font-medium">AI-Powered Learning</span>
                    </div>
                    <div class="flex items-center space-x-3">
                      <div class="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style="animation-delay: 0.5s"></div>
                      <span class="text-gray-600 dark:text-gray-300 font-medium">Personalized Content</span>
                    </div>
                    <div class="flex items-center space-x-3">
                      <div class="w-3 h-3 bg-pink-500 rounded-full animate-pulse" style="animation-delay: 1s"></div>
                      <span class="text-gray-600 dark:text-gray-300 font-medium">LMS Integration</span>
                    </div>
                    <div class="flex items-center space-x-3">
                      <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse" style="animation-delay: 1.5s"></div>
                      <span class="text-gray-600 dark:text-gray-300 font-medium">Auto Recommendations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Fitur -->
        <section class="py-20 px-4 mx-auto max-w-screen-xl bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
          <div class="text-center mb-16 animate-fade-in-up">
            <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Fitur <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EduraApp</span>
            </h2>
            <div class="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
            <p class="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">Platform pembelajaran yang disesuaikan dengan minat dan gaya belajarmu</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              ${[
                {
                  number: 1,
                  title: "Generative Study Material",
                  description:
                    "Rancang topik dan level yang disesuaikan dengan rencana belajarmu maka automatisasi akan dibuat oleh AI",
                  icon: "🤖",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  number: 2,
                  title: "Chapter Material-AI",
                  description:
                    "Bikin materi belajar yang pas buat kamu, cepat dan gampang dan pantau progres belajarmu melalui chartbar",
                  icon: "📚",
                  color: "from-purple-500 to-purple-600",
                },
                {
                  number: 3,
                  title: "Flashcard",
                  description:
                    "Terdapat alat bantu belajar berupa flashcard untuk membantumu menghafal atau mempelajari materi dengan cepat",
                  icon: "🎴",
                  color: "from-pink-500 to-pink-600",
                },
                {
                  number: 4,
                  title: "Quiz",
                  description:
                    "Mengakses ujian dengan mudah dan dapatkan hasil dengan cepat untuk evaluasi belajarmu",
                  icon: "🎯",
                  color: "from-green-500 to-green-600",
                },
              ]
                .map(
                  (feature, index) => `
                <div class="group relative p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 animate-fade-in-up overflow-hidden" style="animation-delay: ${
                  index * 0.2
                }s">
                  <!-- Large Icon in top-right corner -->
                  <div class="absolute -top-4 -right-4 text-8xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 group-hover:scale-110 transform">${
                    feature.icon
                  }</div>
                  
                  <!-- Number badge -->
                  <div class="w-14 h-14 bg-gradient-to-r ${
                    feature.color
                  } rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <span class="text-white font-bold text-xl">${
                      feature.number
                    }</span>
                  </div>
                  
                  <!-- Content -->
                  <div class="relative z-10">
                    <h3 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      ${feature.title}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-base">${
                      feature.description
                    }</p>
                  </div>
                  
                  <!-- Hover effect overlay -->
                  <div class="absolute inset-0 bg-gradient-to-br ${
                    feature.color
                  } opacity-0 group-hover:opacity-5 dark:group-hover:opacity-10 transition-opacity duration-500 rounded-3xl"></div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </section>

        <!-- Video -->
        <section class="py-20 px-4 sm:px-6 md:px-8 bg-white dark:bg-gray-900">
          <div class="max-w-screen-xl mx-auto text-center animate-fade-in-up">
            <h2 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Panduan <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Penggunaan</span>
            </h2>
            <div class="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
            <p class="text-gray-600 dark:text-gray-300 text-lg mb-12 max-w-2xl mx-auto">Akses video tutorial di bawah ini untuk membantumu dalam menggunakan platform Edura</p>
            
            <div class="relative max-w-5xl mx-auto">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
              <div class="relative bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-2xl">
                <iframe
                  width="760"
                  height="415"
                  src="https://www.youtube.com/embed/bB-dovQnBk4"
                  title="Panduan EduraApp"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                  class="rounded-2xl w-full aspect-video"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>
        /* Custom animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(3deg); }
          75% { transform: rotate(-3deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bouncesoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-blob { animation: blob 7s infinite; }
        .animate-wiggle { animation: wiggle 3s ease-in-out infinite; }
        .animate-fade-in-up { animation: fadeInUp 1s ease-out forwards; }
        .animate-fade-in-right { animation: fadeInRight 1s ease-out forwards; }
        .animate-slide-in-left { animation: slideInLeft 1s ease-out forwards; }
        .animate-bounce-soft { animation: bouncesoft 2s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce 3s ease-in-out infinite; }
        .animate-bounce-slower { animation: bounce 4s ease-in-out infinite; }
        .animate-bounce-slowest { animation: bounce 5s ease-in-out infinite; }
        
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        /* Scroll-based navbar styling */
        .navbar-scrolled {
          background: rgba(255, 255, 255, 0.98) !important;
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
        }
        
        .dark .navbar-scrolled {
          background: rgba(17, 24, 39, 0.98) !important;
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
        }
        
        /* Smooth scrolling */
        html { scroll-behavior: smooth; }
        
        /* Intersection observer animations */
        .fade-in-section {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        .fade-in-section.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
      </style>
    `;
  },

  async afterRender() {
    // Render navbar
    const navbarModule = (await import("../../component/navbar.js")).default;
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.innerHTML = navbarModule().render();
    navbarModule().afterRender();

    // Navbar scroll effect
    const navbar = document.getElementById("navbar-container");
    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // Add/remove scrolled class based on scroll position
      if (scrollTop > 100) {
        navbar.classList.add("navbar-scrolled");
      } else {
        navbar.classList.remove("navbar-scrolled");
      }

      // Hide/show navbar based on scroll direction
      if (scrollTop > lastScrollTop && scrollTop > 200) {
        // Scrolling down & past threshold
        navbar.style.transform = "translateY(-100%)";
      } else {
        // Scrolling up
        navbar.style.transform = "translateY(0)";
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      section.classList.add("fade-in-section");
      observer.observe(section);
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          const navbarHeight = navbar.offsetHeight;
          const targetPosition = target.offsetTop - navbarHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });

    // Parallax effect for background elements
    const handleParallax = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll(".animate-blob");

      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + index * 0.1;
        element.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    window.addEventListener("scroll", handleParallax, { passive: true });

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleParallax);
      observer.disconnect();
    };
  },
};

export default LandingPage;