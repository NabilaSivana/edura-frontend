import "../../../styles/style.css"; // jika pakai tailwind
import navbar from "../../component/navbar.js";

const LandingPage = {
  async render() {
    return `
      <div>
      <div id="navbar-container" class="shrink-0"></div>
        <!-- Hero Section -->
        <section class="relative z-50 pt-12 bg-white">
          <div class="py-6 px-4 sm:px-6 md:px-8 mx-auto max-w-screen-lg">
            <div class="flex flex-wrap lg:flex-nowrap items-center justify-between gap-6">
              <div class="flex-1 min-w-[280px] text-center lg:text-left">
                <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
                  LMS Berbasis AI - 
                  <span class="text-blue-600">Personalisasi Pembelajaran</span>
                </h1>
                <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
                  Mandiri
                </h1>
                <p class="text-base sm:text-lg md:text-xl text-gray-600 mb-6">
                  Sahabat Belajarmu: Belajar Bebas, Cerdas Tanpa Batas
                </p>
                <div class="flex justify-center lg:justify-start">
                  <a href="#/dashboard" class="inline-flex items-center px-6 py-3 text-base md:text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started Now →
                  </a>
                </div>
              </div>

              <div class="flex-1 flex justify-center items-start">
                <img src="maskot1.png" alt="Robot mascot" class="w-auto h-auto max-w-[240px]">
              </div>
            </div>
          </div>
        </section>

        <!-- Tentang EduraApp -->
        <section class="relative py-20 px-4 mx-auto max-w-screen-lg">
          <div class="relative">
            <div class="absolute left-4 sm:left-10 md:left-20 lg:left-32 bottom-0 z-10">
              <img src="maskot2.png" alt="Robot mascot" class="w-20 md:w-24 h-auto" />
            </div>
            <div class="text-center">
              <h2 class="text-3xl font-bold text-gray-900 mb-10">Tentang EduraApp</h2>
              <div class="bg-blue-50 p-6 sm:p-12 md:p-24 rounded-lg max-w-2xl mx-auto relative">
                <p class="text-gray-600 text-base sm:text-lg">
                  EduraApp merupakan sebuah platform kerangka kerja AI yang dapat terintegrasi dengan LMS, sehingga mampu menyusun rekomendasi materi secara otomatis yang diharapkan platform ini dapat menambah pengetahuan mahasiswa di samping materi kurikulum.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Fitur -->
        <section class="py-12 px-4 mx-auto max-w-screen-lg">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Fitur EduraApp</h2>
            <p class="text-lg sm:text-xl text-gray-600 mb-8">Platform pembelajaran yang disesuaikan minat belajarmu</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${[
                {
                  number: 1,
                  title: "Generative Study Material",
                  description:
                    "Rancang topik dan level yang disesuaikan dengan rencana belajarmu maka automatisasi akan dibuat oleh AI",
                },
                {
                  number: 2,
                  title: "Chapter Material-AI",
                  description:
                    "Bikin materi belajar yang pas buat kamu, cepat dan gampang dan pantau progres belajarmu melalui chartbar",
                },
                {
                  number: 3,
                  title: "Flashcard",
                  description:
                    "Terdapat alat bantu belajar berupa flashcard untuk membantumu menghafal atau mempelajari materi dengan cepat",
                },
                {
                  number: 4,
                  title: "Quiz",
                  description:
                    "Mengakses ujian dengan mudah dan dapatkan hasil dengan cepat untuk evaluasi belajarmu",
                },
              ]
                .map(
                  (feature) => `
                <div class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <h3 class="text-xl font-bold mb-3 text-gray-900 flex items-center">
                    <span class="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                      ${feature.number}
                    </span>
                    ${feature.title}
                  </h3>
                  <p class="text-gray-600 pl-11">${feature.description}</p>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </section>

        <!-- Video -->
        <div class="text-center px-4 sm:px-6 md:px-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Panduan Penggunaan</h2>
          <p class="text-gray-600 mb-8">Akses Video tutorial di bawah ini untuk membantumu dalam menggunakan platform Edura</p>
          <div class="flex justify-center">
            <iframe
              width="760"
              height="415"
              src="https://www.youtube.com/embed/bB-dovQnBk4"
              title="Panduan EduraApp"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              class="rounded-2xl w-full max-w-4xl aspect-video"
            ></iframe>
          </div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    const navbarModule = (await import("../../component/navbar.js")).default;
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.innerHTML = navbarModule().render();
    navbarModule().afterRender(); // Tidak ada interaksi dinamis untuk saat ini
  },
};

export default LandingPage;
