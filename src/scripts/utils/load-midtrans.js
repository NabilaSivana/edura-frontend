// src/utils/load-midtrans.js
export const loadMidtransSnap = () => {
    return new Promise((resolve, reject) => {
        // Cek apakah script sudah dimuat sebelumnya
        if (window.snap) return resolve(window.snap);

        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', 'SB-Mid-client-3jCGi9tkqV7JPO3e');
        script.onload = () => resolve(window.snap);
        script.onerror = () => reject(new Error('Gagal memuat Snap.js'));

        document.body.appendChild(script);
    });
};
