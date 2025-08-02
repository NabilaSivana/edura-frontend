import "../../../styles/style.css";

const TermsConditionsPage = {
    async render() {
        return `
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Navbar Container -->
        <nav id="navbar-container" class="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50"></nav>
        
        <!-- Main Content -->
        <div class="pt-20 pb-16">
          <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="text-center mb-12 animate-fade-in-up">
              <h1 class="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                Syarat dan <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Ketentuan</span>
              </h1>
              <div class="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
              <p class="text-lg text-gray-600 dark:text-gray-300">
                Terakhir diperbarui: <span class="font-semibold">${new Date().toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}</span>
              </p>
            </div>

            <!-- Table of Contents -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in-up">
              <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
                Daftar Isi
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                ${[
                { id: 'penerimaan', title: '1. Penerimaan Syarat dan Ketentuan' },
                { id: 'definisi', title: '2. Definisi' },
                { id: 'layanan', title: '3. Layanan EduraApp' },
                { id: 'registrasi', title: '4. Registrasi dan Akun Pengguna' },
                { id: 'penggunaan', title: '5. Penggunaan Layanan' },
                { id: 'konten', title: '6. Konten dan Hak Kekayaan Intelektual' },
                { id: 'privasi', title: '7. Privasi dan Perlindungan Data' },
                { id: 'pembayaran', title: '8. Pembayaran dan Penagihan' },
                { id: 'tanggung-jawab', title: '9. Tanggung Jawab dan Batasan' },
                { id: 'pelanggaran', title: '10. Pelanggaran dan Sanksi' },
                { id: 'penghentian', title: '11. Penghentian Layanan' },
                { id: 'perubahan', title: '12. Perubahan Syarat dan Ketentuan' },
                { id: 'hukum', title: '13. Hukum yang Berlaku' },
                { id: 'kontak', title: '14. Kontak dan Dukungan' },
                { id: 'tambahan', title: '15. Ketentuan Tambahan' }
            ].map(item => `
                  <a href="#${item.id}" class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 text-sm py-1 px-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    ${item.title}
                  </a>
                `).join('')}
              </div>
            </div>

            <!-- Content -->
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in-up">
              <div class="p-6 md:p-8 space-y-8">
                
                <!-- Section 1 -->
                <section id="penerimaan" class="scroll-mt-24">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                    Penerimaan Syarat dan Ketentuan
                  </h2>
                  <div class="prose dark:prose-invert max-w-none">
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      Dengan mengakses dan menggunakan platform EduraApp ("Aplikasi", "Platform", "Layanan"), Anda ("Pengguna", "Anda") menyetujui untuk terikat oleh Syarat dan Ketentuan ini ("S&K"). Jika Anda tidak menyetujui seluruh ketentuan ini, mohon untuk tidak menggunakan layanan kami.
                    </p>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                      EduraApp adalah platform pembelajaran berbasis <strong class="text-blue-600 dark:text-blue-400">Artificial Intelligence (AI)</strong> yang menyediakan Learning Management System (LMS) dengan fitur personalisasi pembelajaran mandiri.
                    </p>
                  </div>
                </section>

                <!-- Section 2 -->
                <section id="definisi" class="scroll-mt-24">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                    Definisi
                  </h2>
                  <div class="space-y-4">
                    ${[
                { term: 'EduraApp', definition: 'Platform pembelajaran berbasis AI dan penyedia layanan.' },
                { term: 'Pengguna', definition: 'Individu yang mengakses dan menggunakan layanan EduraApp, termasuk namun tidak terbatas pada mahasiswa, dosen, dan administrator.' },
                { term: 'Konten', definition: 'Seluruh materi pembelajaran, video, teks, gambar, audio, kuis, flashcard, dan data lainnya yang tersedia di platform.' },
                { term: 'AI', definition: 'Teknologi Artificial Intelligence yang digunakan untuk memberikan rekomendasi pembelajaran yang dipersonalisasi.' },
                { term: 'Akun', definition: 'Profil pengguna yang dibuat untuk mengakses layanan EduraApp.' }
            ].map(item => `
                      <div class="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
                        <strong class="text-blue-700 dark:text-blue-300">"${item.term}"</strong>
                        <span class="text-gray-700 dark:text-gray-300"> merujuk pada ${item.definition}</span>
                      </div>
                    `).join('')}
                  </div>
                </section>

                <!-- Section 3 -->
                <section id="layanan" class="scroll-mt-24">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                    Layanan EduraApp
                  </h2>
                  
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.1 Fitur Utama</h3>
                  <p class="text-gray-700 dark:text-gray-300 mb-4">EduraApp menyediakan layanan berikut:</p>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    ${[
                {
                    icon: '🤖',
                    title: 'Generative Study Material',
                    desc: 'Pembuatan materi pembelajaran otomatis menggunakan AI berdasarkan topik dan level yang ditentukan pengguna'
                },
                {
                    icon: '📚',
                    title: 'Chapter Material-AI',
                    desc: 'Pembuatan dan personalisasi materi belajar dengan monitoring progres melalui chart'
                },
                {
                    icon: '🎴',
                    title: 'Flashcard',
                    desc: 'Alat bantu belajar untuk menghafal dan mempelajari materi dengan cepat'
                },
                {
                    icon: '🎯',
                    title: 'Quiz',
                    desc: 'Sistem ujian dan evaluasi dengan hasil instan'
                },
                {
                    icon: '🔗',
                    title: 'LMS Integration',
                    desc: 'Integrasi dengan Learning Management System'
                },
                {
                    icon: '💡',
                    title: 'Rekomendasi AI',
                    desc: 'Sistem rekomendasi materi pembelajaran otomatis'
                }
            ].map(feature => `
                      <div class="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                        <div class="flex items-start space-x-3">
                          <span class="text-2xl">${feature.icon}</span>
                          <div>
                            <h4 class="font-semibold text-gray-900 dark:text-white">${feature.title}</h4>
                            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">${feature.desc}</p>
                          </div>
                        </div>
                      </div>
                    `).join('')}
                  </div>

                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.2 Akses Layanan</h3>
                  <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                    <li>Layanan tersedia 24/7 dengan kemungkinan gangguan untuk pemeliharaan</li>
                    <li>Akses memerlukan koneksi internet yang stabil</li>
                    <li>Beberapa fitur mungkin memerlukan verifikasi identitas atau status pendidikan</li>
                  </ul>
                </section>

                <!-- Section 4 -->
                <section id="registrasi" class="scroll-mt-24">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                    Registrasi dan Akun Pengguna
                  </h2>
                  
                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.1 Persyaratan Registrasi</h3>
                  <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                    <li>Pengguna harus berusia minimal 17 tahun atau memiliki izin dari orang tua/wali</li>
                    <li>Menyediakan informasi yang akurat, lengkap, dan terkini</li>
                    <li>Menjaga kerahasiaan kredensial login</li>
                    <li>Bertanggung jawab atas semua aktivitas yang terjadi di akun</li>
                  </ul>

                  <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.2 Jenis Akun</h3>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${[
                { type: 'Mahasiswa', desc: 'Akses ke materi pembelajaran dan fitur AI', color: 'blue' },
                { type: 'Dosen', desc: 'Akses tambahan untuk membuat dan mengelola konten', color: 'purple' },
                { type: 'Administrator', desc: 'Akses penuh untuk manajemen platform', color: 'green' }
            ].map(account => `
                      <div class="bg-${account.color}-50 dark:bg-${account.color}-900/20 p-4 rounded-xl border border-${account.color}-200 dark:border-${account.color}-700">
                        <h4 class="font-semibold text-${account.color}-700 dark:text-${account.color}-300">${account.type}</h4>
                        <p class="text-sm text-${account.color}-600 dark:text-${account.color}-400 mt-1">${account.desc}</p>
                      </div>
                    `).join('')}
                  </div>
                </section>

                <!-- Section 5 -->
                <section id="penggunaan" class="scroll-mt-24">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                    Penggunaan Layanan
                  </h2>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 class="text-xl font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Penggunaan yang Diizinkan
                      </h3>
                      <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                        <li>Mengakses materi pembelajaran sesuai dengan level dan program studi</li>
                        <li>Menggunakan fitur AI untuk personalisasi pembelajaran</li>
                        <li>Membuat dan menyimpan flashcard</li>
                        <li>Mengikuti kuis dan evaluasi</li>
                        <li>Memantau progres pembelajaran</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 class="text-xl font-semibold text-red-700 dark:text-red-400 mb-3 flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Penggunaan yang Dilarang
                      </h3>
                      <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                        <li>Menyalahgunakan teknologi AI untuk tujuan yang tidak etis</li>
                        <li>Membagikan akun atau kredensial login</li>
                        <li>Mengganggu sistem atau server</li>
                        <li>Melakukan reverse engineering atau dekompilasi</li>
                        <li>Menggunakan bot atau automated script</li>
                        <li>Menyebarkan konten yang melanggar hak cipta</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <!-- Section 6 -->
                <section id="konten" class="scroll-mt-24">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">6</span>
                    Konten dan Hak Kekayaan Intelektual
                  </h2>
                  
                  <div class="space-y-6">
                    <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
                      <h3 class="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">6.1 Konten Platform</h3>
                      <ul class="list-disc list-inside text-blue-800 dark:text-blue-200 space-y-2">
                        <li>Seluruh konten yang disediakan EduraApp dilindungi hak cipta</li>
                        <li>Konten yang dihasilkan AI tetap menjadi bagian dari layanan platform</li>
                        <li>Pengguna mendapat lisensi terbatas untuk menggunakan konten untuk tujuan pembelajaran pribadi</li>
                      </ul>
                    </div>
                    
                    <div class="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-700">
                      <h3 class="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-3">6.2 Konten Pengguna</h3>
                      <ul class="list-disc list-inside text-purple-800 dark:text-purple-200 space-y-2">
                        <li>Pengguna mempertahankan hak atas konten yang mereka buat</li>
                        <li>Dengan mengunggah konten, pengguna memberikan lisensi kepada EduraApp untuk menggunakan konten tersebut dalam operasional platform</li>
                        <li>Pengguna bertanggung jawab memastikan konten yang diunggah tidak melanggar hak pihak ketiga</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <!-- Section 7 -->
                <section id="privasi" class="scroll-mt-24">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">7</span>
                    Privasi dan Perlindungan Data
                  </h2>
                  
                  <div class="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-green-200 dark:border-green-700">
                    <div class="flex items-center mb-4">
                      <svg class="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                      <h3 class="text-xl font-semibold text-green-900 dark:text-green-100">Komitmen Perlindungan Data</h3>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 class="font-semibold text-green-800 dark:text-green-200 mb-2">Data yang Dikumpulkan:</h4>
                        <ul class="list-disc list-inside text-green-700 dark:text-green-300 space-y-1 text-sm">
                          <li>Informasi profil dan akademik</li>
                          <li>Data aktivitas pembelajaran</li>
                          <li>Preferensi dan pola belajar</li>
                          <li>Data interaksi dengan fitur AI</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 class="font-semibold text-green-800 dark:text-green-200 mb-2">Perlindungan yang Diterapkan:</h4>
                        <ul class="list-disc list-inside text-green-700 dark:text-green-300 space-y-1 text-sm">
                          <li>Enkripsi standar industri</li>
                          <li>Akses data terbatas (least privilege)</li>
                          <li>Tidak menjual data kepada pihak ketiga</li>
                          <li>Compliance dengan regulasi yang berlaku</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <!-- Section 8 -->
                <section id="pembayaran" class="scroll-mt-24">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">8</span>
                    Pembayaran dan Penagihan
                  </h2>
                  
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    ${[
                {
                    title: 'Model Pembayaran',
                    items: ['Layanan dasar gratis', 'Fitur premium berbayar', 'Berbagai metode pembayaran'],
                    color: 'blue'
                },
                {
                    title: 'Kebijakan Refund',
                    items: ['Mengikuti kebijakan yang berlaku', 'Periode pengajuan tertentu', 'Tidak berlaku untuk layanan terpakai'],
                    color: 'purple'
                },
                {
                    title: 'Perubahan Harga',
                    items: ['Pemberitahuan sebelumnya', 'Tidak berlaku retroaktif', 'Berlaku untuk langganan baru'],
                    color: 'green'
                }
            ].map(section => `
                      <div class="bg-${section.color}-50 dark:bg-${section.color}-900/20 p-4 rounded-xl border border-${section.color}-200 dark:border-${section.color}-700">
                        <h3 class="font-semibold text-${section.color}-900 dark:text-${section.color}-100 mb-3">${section.title}</h3>
                        <ul class="list-disc list-inside text-${section.color}-700 dark:text-${section.color}-300 space-y-1 text-sm">
                          ${section.items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                      </div>
                    `).join('')}
                  </div>
                </section>

                <!-- Remaining sections with similar structure but more concise -->
                ${[
                {
                    id: 'tanggung-jawab',
                    number: '9',
                    title: 'Tanggung Jawab dan Batasan',
                    content: `
                      <div class="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-700">
                        <h3 class="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">⚠️ Penting untuk Diperhatikan</h3>
                        <ul class="list-disc list-inside text-yellow-800 dark:text-yellow-200 space-y-2">
                          <li>Layanan disediakan "sebagaimana adanya" tanpa jaminan tertentu</li>
                          <li>Kami tidak menjamin akurasi 100% dari konten yang dihasilkan AI</li>
                          <li>Tanggung jawab maksimal terbatas pada nilai yang dibayarkan pengguna</li>
                          <li>Uptime target 99% dengan pemeliharaan rutin yang diinformasikan</li>
                        </ul>
                      </div>
                    `
                },
                {
                    id: 'pelanggaran',
                    number: '10',
                    title: 'Pelanggaran dan Sanksi',
                    content: `
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-700">
                          <h3 class="font-semibold text-red-900 dark:text-red-100 mb-3">Jenis Pelanggaran</h3>
                          <ul class="list-disc list-inside text-red-700 dark:text-red-300 space-y-1 text-sm">
                            <li>Penggunaan tidak sesuai ketentuan</li>
                            <li>Penyalahgunaan teknologi AI</li>
                            <li>Pelanggaran hak kekayaan intelektual</li>
                            <li>Gangguan terhadap pengguna lain</li>
                          </ul>
                        </div>
                        <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-200 dark:border-orange-700">
                          <h3 class="font-semibold text-orange-900 dark:text-orange-100 mb-3">Sanksi yang Dapat Diberikan</h3>
                          <ul class="list-disc list-inside text-orange-700 dark:text-orange-300 space-y-1 text-sm">
                            <li>Peringatan tertulis</li>
                            <li>Pembatasan akses fitur</li>
                            <li>Suspensi sementara</li>
                            <li>Penutupan akun permanen</li>
                          </ul>
                        </div>
                      </div>
                    `
                }
            ].map(section => `
                  <section id="${section.id}" class="scroll-mt-24">
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <span class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">${section.number}</span>
                      ${section.title}
                    </h2>
                    ${section.content}
                  </section>
                `).join('')}

                <!-- Final sections -->
                <section id="kontak" class="scroll-mt-24">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">14</span>
                    Kontak dan Dukungan
                  </h2>
                  
                  <div class="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-700">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                          Informasi Kontak
                        </h3>
                        <div class="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                          <p><strong>Email:</strong> support@eduraapp.com</p>
                          <p><strong>Website:</strong> www.eduraapp.com</p>
                          <p><strong>Alamat:</strong> [Alamat Lengkap]</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center">
                          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Jam Operasional
                        </h3>
                        <div class="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                          <p><strong>Senin - Jumat:</strong> 08.00 - 17.00 WIB</p>
                          <p><strong>Dukungan Darurat:</strong> 24/7</p>
                          <p><strong>Bahasa:</strong> Indonesia & English</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <!-- Final Section -->
                <section id="tambahan" class="scroll-mt-24">
                  <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <span class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">15</span>
                    Ketentuan Tambahan
                  </h2>
                  
                  <div class="space-y-4">
                    <div class="border-l-4 border-gray-400 pl-4 py-2">
                      <p class="text-gray-700 dark:text-gray-300">
                        <strong>Keabsahan Ketentuan:</strong> Jika ada bagian dari S&K ini yang dianggap tidak sah, bagian lainnya tetap berlaku.
                      </p>
                    </div>
                    <div class="border-l-4 border-gray-400 pl-4 py-2">
                      <p class="text-gray-700 dark:text-gray-300">
                        <strong>Penundaan Penegakan:</strong> Penundaan penegakan ketentuan tidak dianggap sebagai pengabaian hak.
                      </p>
                    </div>
                    <div class="border-l-4 border-gray-400 pl-4 py-2">
                      <p class="text-gray-700 dark:text-gray-300">
                        <strong>Pengalihan Hak:</strong> Pengguna tidak dapat mengalihkan hak dan kewajiban tanpa persetujuan tertulis dari EduraApp.
                      </p>
                    </div>
                  </div>
                </section>

                <!-- Agreement Statement -->
                <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl text-center">
                  <h3 class="text-xl font-bold mb-3">Pernyataan Persetujuan</h3>
                  <p class="text-blue-100 mb-4">
                    Dengan menggunakan EduraApp, Anda mengakui bahwa telah membaca, memahami, dan menyetujui seluruh Syarat dan Ketentuan ini.
                  </p>
                  <div class="text-sm text-blue-200">
                    © 2025 EduraApp. Semua hak dilindungi undang-undang.
                  </div>
                </div>

              </div>
            </div>

            <!-- Back to Top Button -->
            <div class="text-center mt-8">
              <button id="back-to-top" class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                </svg>
                Kembali ke Atas
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>
        /* Custom animations */
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
        
        .animate-fade-in-up { 
          animation: fadeInUp 1s ease-out forwards; 
        }
        
        /* Smooth scrolling */
        html { 
          scroll-behavior: smooth; 
        }
        
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

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
        
        .dark ::-webkit-scrollbar-track {
          background: #374151;
        }
        
        /* Section link hover effects */
        section:target {
          animation: highlight 2s ease-in-out;
        }
        
        @keyframes highlight {
          0% { background-color: rgba(59, 130, 246, 0.1); }
          100% { background-color: transparent; }
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

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute("href"));
                if (target) {
                    const navbarHeight = document.getElementById("navbar-container").offsetHeight;
                    const targetPosition = target.offsetTop - navbarHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth",
                    });
                }
            });
        });

        // Back to top functionality
        const backToTopButton = document.getElementById("back-to-top");
        backToTopButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        });

        // Show/hide back to top button based on scroll position
        const handleScroll = () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.remove("opacity-0");
                backToTopButton.classList.add("opacity-100");
            } else {
                backToTopButton.classList.add("opacity-0");
                backToTopButton.classList.remove("opacity-100");
            }
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

        // Add highlighting effect when section is in viewport
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const id = entry.target.getAttribute('id');
                const navLink = document.querySelector(`a[href="#${id}"]`);

                if (entry.isIntersecting) {
                    // Remove active class from all links
                    document.querySelectorAll('a[href^="#"]').forEach(link => {
                        link.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'font-semibold');
                    });

                    // Add active class to current section link
                    if (navLink) {
                        navLink.classList.add('bg-blue-100', 'dark:bg-blue-900', 'font-semibold');
                    }
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: "-20% 0px -20% 0px"
        });

        sections.forEach((section) => {
            sectionObserver.observe(section);
        });

        // Add page title
        document.title = "Syarat dan Ketentuan - EduraApp";

        // Cleanup function
        return () => {
            window.removeEventListener("scroll", handleScroll);
            observer.disconnect();
            sectionObserver.disconnect();
        };
    },
};

export default TermsConditionsPage;