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

        updateBirthdayCountdown();
        setInterval(updateBirthdayCountdown, 86400000);
