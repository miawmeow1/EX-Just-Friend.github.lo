// === PENGATUR PESAN & KLIK LAYAR ===
const messages = [
    "Tap Tap Tap Layare",
    "Hi Kamu",
    "Aku duwe sesuatu nih...",
    "Nanging ojo Kepedean dhisik ya 😅",
    "Dipencet Maneh Mouse seh",
    "Iya, Awakmu ojok lali wae ngak bok delok😒",
    "sing tenang, iki kudu pesen penting",
    "sanajan rada absurd",
    "mbiyen awake dhewe eroh duwe crita, kan",
    "kulo ora arep ngungkit masa lalu maneh🙂‍↔️",
    "kulo ya ora tau blas cemburuan kok",
    "orah ana niatan ngganggu urimu blas kuwi dudu hakku",
    "lan aku ngajeni kuwi",
    "lucu lan aneh yo nek kelingan chat biyen🤣🤣",
    "merga awake dhewe eroh cedhak minangka kanca🤪",
    "dadi ya isok wae salah paham maksud ku",
    "kulo mung ngomong",
    "Matur nuwun wis tau dadi bagean saka crita irupku lan ero duwe rasa seneng☺️",
    "muga-muga kowe tansah bahagia karo pilihamu",
    "kulo ora ana rasa sengit, mung kenangan apik opo-opo",
    "saka kanca lawas soko wis patang taun kepungkur awak dhewe kaca cedhak🫪",
    "COKKKK astaghfirullah al azim KOK DADI SERIUS TENAN NGENE ANJINGGGG!!!",
    "wis, anggep we iki pesen ora penting. ati-ati waeee cahh👇",
];

let currentPage = 0;
let isLastPage = false;

function showMessage() {
    // Ubah teks pesan sesuai array
    $('.message h1').text(messages[currentPage]);
    
    isLastPage = currentPage === messages.length - 1;
    
    if (isLastPage) {
        $('.next-button').fadeIn(); // Munculkan tombol di halaman terakhir
        $('.bg_heart').css('cursor', 'default');
    } else {
        $('.next-button').hide(); // Sembunyikan tombol selama belum halaman terakhir
        $('.bg_heart').css('cursor', 'pointer');
    }
}

// Klik di mana saja untuk lanjut pesan berikutnya
$('.bg_heart').on('click', function(e) {
    // Supaya kalau klik tombol "pencet aku" tidak mentrigger ganti teks pesan
    if ($(e.target).closest('.next-button').length) return;

    if (!isLastPage) {
        currentPage++;
        showMessage();
    }
});

// === EFEK KELOPAK BUNGA SAKURA / MAWAR & HATI MELAYANG ===
document.addEventListener('DOMContentLoaded', () => {
    createPetals();
    setupMusic();
    showMessage(); // Tampilkan pesan pertama kali
});

function createPetals() {
    const container = document.getElementById('sakuraContainer');
    if (!container) return;

    const petalTypes = ['🌸', '🌺', '🌹', '💖', '✨'];
    const totalPetals = 30;

    for (let i = 0; i < totalPetals; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        petal.innerHTML = petalTypes[Math.floor(Math.random() * petalTypes.length)];
        
        const size = Math.random() * 18 + 14; 
        const left = Math.random() * 100; 
        const duration = Math.random() * 5 + 4; 
        const delay = Math.random() * 5;

        petal.style.fontSize = `${size}px`;
        petal.style.left = `${left}%`;
        petal.style.animationDuration = `${duration}s`;
        petal.style.animationDelay = `${delay}s`;

        container.appendChild(petal);
    }
}

// === PENGATUR MUSIK & LOCALSTORAGE ===
function clearMusicState() {
    localStorage.removeItem('musicPlaying');
    localStorage.removeItem('musicCurrentTime');
}

function setupMusic() {
    const music = document.getElementById('backgroundMusic');
    if (!music) return;
    
    if (!localStorage.getItem('initialLoad')) {
        clearMusicState();
        localStorage.setItem('initialLoad', 'true');
        music.currentTime = 0;
    }

    const isMusicPlaying = localStorage.getItem('musicPlaying') === 'true';
    const musicCurrentTime = localStorage.getItem('musicCurrentTime') || 0;

    if (isMusicPlaying) {
        music.currentTime = parseFloat(musicCurrentTime);
        music.play().catch(error => console.log('Playback failed', error));
    }

    music.addEventListener('play', () => {
        localStorage.setItem('musicPlaying', 'true');
    });

    music.addEventListener('pause', () => {
        localStorage.setItem('musicPlaying', 'false');
    });

    setInterval(() => {
        if (!music.paused) {
            localStorage.setItem('musicCurrentTime', music.currentTime);
        }
    }, 1000);

    document.addEventListener('click', function startMusic() {
        music.play().catch(error => {
            console.log('Autoplay prevented', error);
        });
        document.removeEventListener('click', startMusic);
    }, { once: true });
}

// Proteksi klik kanan & copy
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
    }
});