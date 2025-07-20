// src/utils/load-midtrans.js
export const loadMidtransSnap = () => {
    return new Promise((resolve, reject) => {
        // Cek apakah script sudah dimuat sebelumnya
        if (window.snap) return resolve(window.snap);

        const script = document.createElement('script');
        script.src = 'https://app.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', 'Mid-client-WU1AdP2rOPdocUgC'); // <- Ganti dengan production client key
        script.onload = () => resolve(window.snap);
        script.onerror = () => reject(new Error('Gagal memuat Snap.js'));

        document.body.appendChild(script);
    });
};
