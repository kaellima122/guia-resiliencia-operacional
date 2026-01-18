document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const audioPlayer = new Audio();
    let currentSlideIndex = 0;
    let hasInteracted = false; 

    // ======================================================
    // 1. CRIAÇÃO DA INTERFACE (BOTÕES)
    // ======================================================
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'presentation-controls';
    controlsContainer.innerHTML = `
        <button id="btn-prev">❮ Anterior</button>
        <div id="slide-counter">Parte 1 - 1 / ${slides.length}</div>
        <button id="btn-next">Próximo ❯</button>
    `;
    document.body.appendChild(controlsContainer);

    controlsContainer.style.cssText = `position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 20px; align-items: center; background: rgba(0,0,0,0.8); padding: 10px 20px; border-radius: 30px; z-index: 1000; color: white; font-family: sans-serif;`;
    
    const btnStyle = "background:none; border:none; color:white; font-size:16px; cursor:pointer; padding: 5px 10px;";
    document.getElementById('btn-prev').style.cssText = btnStyle;
    document.getElementById('btn-next').style.cssText = btnStyle;

    // ======================================================
    // 2. TELA DE INÍCIO (Obrigatório para Audio Automático)
    // ======================================================
    const startOverlay = document.createElement('div');
    startOverlay.id = 'start-overlay';
    startOverlay.innerHTML = '<button style="padding: 20px 40px; font-size: 20px; cursor: pointer; background: #00458b; color: white; border: none; border-radius: 8px;">▶ INICIAR APRESENTAÇÃO</button>';
    startOverlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.9); z-index: 2000; display: flex; justify-content: center; align-items: center;`;
    document.body.appendChild(startOverlay);

    // ======================================================
    // 3. LÓGICA DE FUNCIONAMENTO
    // ======================================================

    function updateSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
        document.getElementById('slide-counter').innerText = `Parte 1 - ${index + 1} / ${slides.length}`;
        playAudioForSlide(index);
    }

    function playAudioForSlide(index) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;

        // Pega o ID do slide (ex: "slide-1") e busca na pasta audios
        const slideId = slides[index].id; 
        const audioPath = `audios/${slideId}.mp3`;

        audioPlayer.src = audioPath;
        
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn(`Áudio da narração não encontrado ou bloqueado: ${slideId}`);
            });
        }
    }

    // --- LÓGICA DE AVANÇO E REDIRECIONAMENTO ---
    function nextSlide() {
        // Se NÃO É o último slide, avança normal
        if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
            updateSlide(currentSlideIndex);
        } 
        // Se É o último slide, pula para a Parte 2
        else {
            console.log("Fim da Parte 1. Indo para a Parte 2...");
            window.location.href = "parte2.html";
        }
    }

    function prevSlide() {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            updateSlide(currentSlideIndex);
        }
    }

    // ======================================================
    // 4. EVENTOS
    // ======================================================

    // Iniciar (Toca música de fundo e inicia narração)
    startOverlay.querySelector('button').addEventListener('click', () => {
        startOverlay.style.display = 'none';
        hasInteracted = true;

        // --- CÓDIGO DA MÚSICA DE FUNDO ---
        const bgMusic = document.getElementById('bg-music');
        if(bgMusic) {
            bgMusic.volume = 0.1; // Volume 10% (bem baixinho)
            bgMusic.play().catch(e => console.log("Erro ao tocar música de fundo:", e));
        }

        updateSlide(0); // Inicia o slide 1
    });

    // Botões
    document.getElementById('btn-prev').addEventListener('click', prevSlide);
    document.getElementById('btn-next').addEventListener('click', nextSlide);

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (!hasInteracted) return;
        if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    // Quando o áudio da narração acaba, chama o nextSlide automaticamente
    audioPlayer.addEventListener('ended', () => {
        setTimeout(() => {
            nextSlide();
        }, 1000); // Espera 1 segundo antes de trocar
    });
});