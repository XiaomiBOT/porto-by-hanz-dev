        const buttons = document.querySelectorAll(".card-buttons button");
        const sections = document.querySelectorAll(".card-section");
        const card = document.querySelector(".card");
        const backgroundMusic = document.getElementById('backgroundMusic');
        let musicPlayed = false;

        function calculateBirthdayCountdown() {
            const today = new Date();
            const currentYear = today.getFullYear();
            let nextBirthday = new Date(currentYear, 11, 20);
            
            if (today > nextBirthday) {
                nextBirthday.setFullYear(currentYear + 1);
            }
            
            const diffTime = nextBirthday - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const diffMonths = Math.floor(diffDays / 30);
            const remainingDays = diffDays % 30;
            
            return `${diffMonths} bulan ${remainingDays} hari lagi`;
        }

        function updateBirthdayCountdown() {
            const countdownElement = document.getElementById('birthdayCountdown');
            if (countdownElement) {
                countdownElement.textContent = calculateBirthdayCountdown();
            }
        }

        function closePopup() {
            const popup = document.getElementById('popupWelcome');
            const popupContent = document.querySelector('.popup-content');
            
            popup.classList.add('popup-exit');
            popupContent.classList.add('popup-content-exit');
            
            if (!musicPlayed) {
                backgroundMusic.play()
                    .then(() => {
                        musicPlayed = true;
                    })
                    .catch(e => console.log('Music play failed:', e));
            }
            
            setTimeout(() => {
                popup.style.display = 'none';
            }, 600);
        }

        const handleButtonClick = e => {
            const targetSection = e.target.getAttribute("data-section");
            const section = document.querySelector(targetSection);
            
            targetSection !== "#about" 
                ? card.classList.add("is-active") 
                : card.classList.remove("is-active");
            
            card.setAttribute("data-state", targetSection);
            
            sections.forEach(s => s.classList.remove("is-active"));
            buttons.forEach(b => b.classList.remove("is-active"));
            
            e.target.classList.add("is-active");
            section.classList.add("is-active");
        };

        buttons.forEach(btn => {
            btn.addEventListener("click", handleButtonClick);
        });

        backgroundMusic.volume = 0.9;

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const popup = document.getElementById('popupWelcome');
                if (popup.style.display !== 'none') {
                    closePopup();
                }
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
                showNotif('Pesan berhasil terkirim. maksih kak', true);
                sendForm.reset();
            } else {
                showNotif(res.error || 'Gagal mengirim, coba lagi.', false);
            }
        } catch {
            showNotif('Error jaringan, cek koneksi Anda.', false);
        }
    });
}


        updateBirthdayCountdown();
        setInterval(updateBirthdayCountdown, 86400000);
