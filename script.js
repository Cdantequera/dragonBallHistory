/*
 * JUEGO: DRAGON BALL 
 */

// 1. Elementos del DOM
const hoyos = document.querySelectorAll(".item");
const btnReiniciar = document.querySelector("#restart-game");
const mostrarTiempo = document.querySelector("#time-count");
const mostrarPuntos = document.querySelector("#score-count");
const levelSelectionContainer = document.querySelector("#level-selection");
const protagonistImage = document.querySelector("#protagonist-image");
const videoContainer = document.querySelector("#video-container");
const levelVideo = document.querySelector("#level-video");
const videoMessage = document.querySelector(".video-message");

// 2. Sonidos
const sonidoGolpe = new Audio("sound/whack.mp3");
const musicaFondo = new Audio("sound/music.mp3");
musicaFondo.loop = true;
musicaFondo.volume = 0.9;

// 3. Variables del juego
let tiempo;
let puntos;
let temporizador;
let aparicionOponentes;
let oponentesDelNivelActual = [];
let nivelActual;
let nivelActualIndex = 0;

// 4. CONFIGURACIÓN DE NIVELES
const NIVELES = [
    {
        nivel: 1,
        nombre: "Goku Niño vs Tao Pai Pai",
        duracion: 30,
        velocidad: 900,
        prota: "images/protagonists/gokuPequeño.png",
        oponentes: ["images/opponents/taopp.png"],
        puntosParaGanar: 10,
        videoVictoria: "videos/gokutao.mp4"
    },
    {
        nivel: 2,
        nombre: "Goku Niño vs Piccolo Rey Demonio",
        duracion: 30,
        velocidad: 800,
        prota: "images/protagonists/gokuPequeño.png",
        oponentes: ["images/opponents/reyDemonio.png"],
        puntosParaGanar: 10,
        videoVictoria: "videos/reyDemonio.mp4"
    },
    {
        nivel: 3,
        nombre: "Goku Adolescente vs Piccolo Jr",
        duracion: 40,
        velocidad: 750,
        prota: "images/protagonists/gokuAdole.png",
        oponentes: ["images/opponents/piccoloJr.png"],
        puntosParaGanar: 10,
        videoVictoria: "videos/piccoloJr.mp4"
    },
    {
        nivel: 4,
        nombre: "Goku Adulto vs Vegeta",
        duracion: 35,
        velocidad: 700,
        prota: "images/protagonists/gokuAdu.png",
        oponentes: ["images/opponents/vegeta1.png"],
        puntosParaGanar: 5,
        videoVictoria: "videos/gokuvegeta.mp4"
    },
    {
        nivel: 5,
        nombre: "Freezer vs Goku SSJ1",
        duracion: 35,
        velocidad: 650,
        prota: "images/protagonists/gokussj1.png",
        oponentes: ["images/opponents/freezer.png"],
        video: "videos/nivel5_intro.mp4",
        puntosParaGanar: 2,
        videoVictoria: "videos/gokuvsfree.mp4"
    },
    {
        nivel: 6,
        nombre: "Freezer y King Cold vs Trunks",
        duracion: 30,
        velocidad: 600,
        prota: "images/protagonists/trunks.png",
        oponentes: ["images/opponents/freezer.png", "images/opponents/kingCold.png"],
        video: "videos/nivel6_intro.mp4",
        puntosParaGanar: 1,
        videoVictoria: "videos/trunks-freezer.mp4"
    },
    {
        nivel: 7,
        nombre: "Androides 17 y 18 vs Vegeta SSJ1",
        duracion: 30,
        velocidad: 550,
        prota: "images/protagonists/vegeta_ssj1.png",
        oponentes: ["images/opponents/androide_17.png", "images/opponents/androide_18.png"],
        video: "videos/nivel7_intro.mp4",
        puntosParaGanar: 50,
        videoVictoria: "videos/vegeta-androides.mp4"
    },
    {
        nivel: 8,
        nombre: "Cell vs Goku SSJ1",
        duracion: 30,
        velocidad: 500,
        prota: "images/protagonists/goku_ssj1_cell.png",
        oponentes: ["images/opponents/cell.png"],
        video: "videos/nivel8_intro.mp4",
        puntosParaGanar: 55,
        videoVictoria: "videos/goku-cell.mp4"
    },
    {
        nivel: 9,
        nombre: "Cell vs Gohan SSJ2",
        duracion: 25,
        velocidad: 450,
        prota: "images/protagonists/gohan_ssj2.png",
        oponentes: ["images/opponents/cell.png"],
        video: "videos/nivel9_intro.mp4",
        puntosParaGanar: 60,
        videoVictoria: "videos/gohan-cell.mp4"
    },
    {
        nivel: 10,
        nombre: "Vegeta M vs Goku SSJ2",
        duracion: 25,
        velocidad: 400,
        prota: "images/protagonists/goku_ssj2.png",
        oponentes: ["images/opponents/majin_vegeta.png"],
        video: "videos/nivel10_intro.mp4",
        puntosParaGanar: 65,
        videoVictoria: "videos/goku-vegetam.mp4"
    },
    {
        nivel: 11,
        nombre: "Majin Buu vs Goku SSJ3",
        duracion: 20,
        velocidad: 350,
        prota: "images/protagonists/goku_ssj3.png",
        oponentes: ["images/opponents/majin_buu.png"],
        video: "videos/nivel11_intro.mp4",
        puntosParaGanar: 70,
        videoVictoria: "videos/goku-buu.mp4"
    },
    {
        nivel: 12,
        nombre: "Kid Buu vs Genkidama",
        duracion: 20,
        velocidad: 300,
        prota: "images/protagonists/goku_genkidama.png",
        oponentes: ["images/opponents/kid_buu.png"],
        video: "videos/nivel12_intro.mp4",
        puntosParaGanar: 75,
        videoVictoria: "videos/goku-kidbuu.mp4"
    }
];

// 5. Funciones del juego

// Función para generar los botones de nivel dinámicamente
function generarBotonesNivel() {
    NIVELES.forEach((level, index) => {
        const button = document.createElement('button');
        button.classList.add('level-btn');
        button.innerText = `Nivel ${level.nivel}`;
        button.title = level.nombre;
        button.addEventListener('click', () => {
            nivelActualIndex = index;
            reproducirVideoIntro(level);
        });
        levelSelectionContainer.appendChild(button);
    });
}

function reproducirVideoIntro(levelConfig) {
    levelSelectionContainer.style.display = "none";
    btnReiniciar.style.display = "none";
    
    videoContainer.style.display = "flex";
    videoMessage.textContent = "Introducción del nivel - Presiona PLAY";
    
    levelVideo.src = levelConfig.video;
    
    levelVideo.onended = () => {
        videoContainer.style.display = "none";
        iniciarJuego(levelConfig);
    };
    
    levelVideo.onerror = () => {
        console.error("Error cargando el video de introducción");
        videoContainer.style.display = "none";
        iniciarJuego(levelConfig);
    };
    
    levelVideo.play();
}

function reproducirVideoVictoria(levelConfig) {
    videoContainer.style.display = "flex";
    videoMessage.textContent = "¡Victoria! - Presiona PLAY";
    
    levelVideo.src = levelConfig.videoVictoria;
    
    levelVideo.onended = () => {
        videoContainer.style.display = "none";
        // Pasar al siguiente nivel si existe
        if (nivelActualIndex < NIVELES.length - 1) {
            nivelActualIndex++;
            reproducirVideoIntro(NIVELES[nivelActualIndex]);
        } else {
            // Último nivel completado
            alert("¡Felicidades! Has completado todos los niveles.");
            terminarJuego();
        }
    };
    
    levelVideo.onerror = () => {
        console.error("Error cargando el video de victoria");
        videoContainer.style.display = "none";
        terminarJuego();
    };
    
    levelVideo.play();
}

function iniciarJuego(levelConfig) {
    nivelActual = levelConfig;
    
    tiempo = levelConfig.duracion;
    puntos = 0;
    oponentesDelNivelActual = levelConfig.oponentes;
    
    mostrarPuntos.textContent = puntos;
    mostrarTiempo.textContent = tiempo;
    protagonistImage.src = levelConfig.prota;

    musicaFondo.play();

    // Iniciar cuenta regresiva
    temporizador = setInterval(() => {
        tiempo--;
        mostrarTiempo.textContent = tiempo;
        if (tiempo <= 0) {
            terminarJuego();
        }
    }, 1000);

    // Comienza a mostrar oponentes
    aparicionOponentes = setInterval(mostrarOponente, levelConfig.velocidad);
}

function mostrarOponente() {
    if (tiempo <= 0) return;

    // Ocultar cualquier oponente que ya esté visible
    document.querySelectorAll('.oponente-appear').forEach(op => {
        op.classList.remove('oponente-appear');
        op.classList.add('oponente-hide');
    });

    // Seleccionar un hoyo aleatorio
    const posicionAleatoria = Math.floor(Math.random() * hoyos.length);
    const oponenteDiv = hoyos[posicionAleatoria].querySelector(".oponente");
    const oponenteImg = oponenteDiv.querySelector("img");
    
    // Seleccionar un oponente aleatorio del array del nivel actual
    const oponenteAleatorio = oponentesDelNivelActual[Math.floor(Math.random() * oponentesDelNivelActual.length)];
    oponenteImg.src = oponenteAleatorio;

    // Mostrar el oponente
    oponenteDiv.classList.remove('oponente-hide');
    oponenteDiv.classList.add("oponente-appear");

    // Ocultar después de un tiempo
    setTimeout(() => {
        oponenteDiv.classList.remove("oponente-appear");
        oponenteDiv.classList.add('oponente-hide');
    }, 1200);
}

function verificarVictoria() {
    if (puntos >= nivelActual.puntosParaGanar) {
        clearInterval(temporizador);
        clearInterval(aparicionOponentes);
        musicaFondo.pause();
        
        // Reproducir video de victoria
        setTimeout(() => {
            reproducirVideoVictoria(nivelActual);
        }, 1000);
        
        return true;
    }
    return false;
}

function terminarJuego() {
    clearInterval(temporizador);
    clearInterval(aparicionOponentes);
    musicaFondo.pause();
    musicaFondo.currentTime = 0;
    
    btnReiniciar.style.display = "block";
    levelSelectionContainer.style.display = "flex";
}

// 6. Eventos
btnReiniciar.addEventListener("click", () => {
    btnReiniciar.style.display = "none";
    levelSelectionContainer.style.display = "flex";
    mostrarPuntos.textContent = 0;
    mostrarTiempo.textContent = 0;
    protagonistImage.src = "images/placeholder.png";
    
    // Ocultar cualquier oponente visible
    document.querySelectorAll('.oponente-appear').forEach(op => {
        op.classList.remove('oponente-appear');
        op.classList.add('oponente-hide');
    });
});

document.querySelector('.container').addEventListener("click", (e) => {
    if (e.target.classList.contains("oponente-clicked") && e.target.parentElement.classList.contains('oponente-appear')) {
        puntos++;
        mostrarPuntos.textContent = puntos;
        
        sonidoGolpe.currentTime = 0;
        sonidoGolpe.play();
        
        // Ocultar oponente golpeado inmediatamente
        e.target.parentElement.classList.remove('oponente-appear');
        e.target.parentElement.classList.add('oponente-hide');
        
        const texto = document.createElement("span");
        texto.className = "whack-text";
        texto.textContent = "POW!";
        e.target.closest('.item').appendChild(texto);
        
        setTimeout(() => texto.remove(), 300);
        
        // Verificar si el jugador ha ganado
        verificarVictoria();
    }
});

// Iniciar la aplicación
generarBotonesNivel();
