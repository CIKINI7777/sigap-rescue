// KONFIGURASI (GANTI DENGAN DATA DARI NOTEPAD ANDA)
const SUPABASE_URL = 'PASTE_SUPABASE_URL';
const SUPABASE_KEY = 'PASTE_SUPABASE_ANON_KEY';
const FIREBASE_CONFIG = { /* PASTE FIREBASE CONFIG DISINI */ };
const VAPID_KEY = 'PASTE_VAPID_KEY';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js";

// Inisialisasi Firebase
const app = initializeApp(FIREBASE_CONFIG);
const messaging = getMessaging(app);

// Fungsi Ganti Mode
window.switchMode = function(mode) {
    document.body.className = `mode-${mode}`;
    document.getElementById('siaga-screen').style.display = mode === 'siaga' ? 'flex' : 'none';
    document.getElementById('darurat-screen').style.display = mode === 'darurat' ? 'flex' : 'none';
    
    if (mode === 'darurat') initCompass();
};

// Request Izin Notifikasi & Simpan Token
async function initNotifications() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        // Kirim token ke Supabase (nanti kita buat tabel tokens)
        console.log('Token FCM:', token);
    }
}

// Listener Notifikasi Saat App Terbuka
onMessage(messaging, (payload) => {
    showAlert(payload.notification.title, payload.notification.body);
});

function showAlert(title, desc) {
    document.getElementById('alert-box').style.display = 'block';
    document.getElementById('alert-title').innerText = title;
    document.getElementById('alert-desc').innerText = desc;
    document.getElementById('status-text').innerText = 'BAHAYA TERDETEKSI';
    document.getElementById('status-text').style.color = 'red';
}

// Test Button
window.testNotification = function() {
    showAlert('TEST PERINGATAN', 'Ini adalah simulasi. Tidak ada bahaya nyata.');
};

// Jalankan saat load
initNotifications();
