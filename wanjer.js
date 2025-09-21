const buttons = document.querySelectorAll(".card-buttons button");
const sections = document.querySelectorAll(".card-section");
const card = document.querySelector(".card");
const backgroundMusic = document.getElementById('backgroundMusic');
let musicPlayed = false;

function calculateBirthdayCountdown() {
    const now = new Date();
    const year = now.getFullYear();
    let bDay = new Date(year, 11, 20, 0, 0, 0);
    if (now >= bDay) bDay.setFullYear(year + 1);
    const diff = bDay - now;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return {days, hours, mins, secs, prevDay: null};
}
let cdData = calculateBirthdayCountdown();
function updateBirthdayCountdown() {
    const el = document.getElementById('birthdayCountdown');
    if (!el) return;
    cdData = calculateBirthdayCountdown();
    const newDay = cdData.days;
    el.textContent = `${cdData.days} hari ${String(cdData.hours).padStart(2,'0')}:${String(cdData.mins).padStart(2,'0')}:${String(cdData.secs).padStart(2,'0')}`;
    if (cdData.prevDay !== null && newDay < cdData.prevDay) {
        el.classList.remove('pulse');
        void el.offsetWidth;
        el.classList.add('pulse');
    }
    cdData.prevDay = newDay;
}
updateBirthdayCountdown();
setInterval(updateBirthdayCountdown, 1000);

function closePopup() {
    const popup = document.getElementById('popupWelcome');
    const content = document.querySelector('.popup-content');
    popup.classList.add('popup-exit');
    content.classList.add('popup-content-exit');
    if (!musicPlayed) {
        backgroundMusic.play().then(() => musicPlayed = true).catch(() => {});
    }
    setTimeout(() => popup.style.display = 'none', 600);
}

const handleButtonClick = e => {
    const target = e.target.getAttribute("data-section");
    const section = document.querySelector(target);
    target !== "#about" ? card.classList.add("is-active") : card.classList.remove("is-active");
    card.setAttribute("data-state", target);
    sections.forEach(s => s.classList.remove("is-active"));
    buttons.forEach(b => b.classList.remove("is-active"));
    e.target.classList.add("is-active");
    section.classList.add("is-active");
};
buttons.forEach(btn => btn.addEventListener("click", handleButtonClick));

backgroundMusic.volume = 0.9;
document.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
        const popup = document.getElementById('popupWelcome');
        if (popup && popup.style.display !== 'none') closePopup();
    }
});

const sendForm = document.getElementById('sendMessageForm');
const notifBox = document.getElementById('notif');
function showNotif(msg, success = true) {
    notifBox.textContent = msg;
    notifBox.style.display = 'block';
    notifBox.style.background = success ? 'rgba(40,167,69,.15)' : 'rgba(220,53,69,.15)';
    notifBox.style.border = `1px solid ${success ? 'rgba(40,167,69,.4)' : 'rgba(220,53,69,.4)'}`;
    notifBox.style.color = success ? '#28a745' : '#dc3545';
    setTimeout(() => notifBox.style.display = 'none', 4000);
}
if (sendForm) {
    sendForm.addEventListener('submit', async e => {
        e.preventDefault();
        const name = document.getElementById('senderName').value.trim();
        const message = document.getElementById('senderMessage').value.trim();
        if (!name || !message) { showNotif('Nama & pesan wajib diisi!', false); return; }
        const params = new URLSearchParams({
            to: 'fikxzmodss@gmail.com',
            subject: `Pesan dari ${name}`,
            message: message
        });
        showNotif('Mengirim...', true);
        try {
            const r = await fetch(`https://api.fikmydomainsz.xyz/tools/sendmail/send?${params}`);
            const res = await r.json();
            if (res.success) {
                showNotif('Pesan berhasil terkirim! Terima kasih 😊', true);
                sendForm.reset();
            } else {
                showNotif(res.error || 'Gagal mengirim, coba lagi.', false);
            }
        } catch {
            showNotif('Error jaringan, cek koneksi Anda.', false);
        }
    });
}
