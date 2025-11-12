// Variables globales para acceder a los elementos del HTML
const questionCard = document.getElementById('questionCard');
const questionText = document.getElementById('questionText');
const buttonsContainer = document.getElementById('buttonsContainer');
const answerMessage = document.getElementById('answerMessage');
const btnNo = document.getElementById('btnNo');

// --- Variables para el control de escala y repetición ---
let noScale = 1.0; // Escala inicial (100%)
const SCALE_DECREMENT = 0.05; // Se reduce 5% con cada clic
const MIN_SCALE = 0.5; // Escala mínima para que no desaparezca
const SAFE_MARGIN = 40; // Margen de seguridad en píxeles para asegurar visibilidad

let isButtonFixed = false; // Nueva bandera para saber si ya cambiamos la posición a fixed


// --- Lógica del botón "Sí" ---
function handleYes() {
    // 1. Mostrar el mensaje de amor
    answerMessage.textContent = '¡Aaa yo también mi amor hermosa! 🥰';
    answerMessage.classList.remove('hidden');

    // 2. Ocultar la pregunta y el botón "Sí"
    questionText.classList.add('hidden');
    buttonsContainer.classList.add('hidden');
    
    // 3. Ocultar el botón "No"
    btnNo.classList.add('hidden');

    // 4. Ajustar el estilo de la tarjeta final
    questionCard.style.maxWidth = '300px'; 
}

// --- Lógica del botón "No" que se mueve y encoge ---
function moveNoButton() {
    // ** PASO 1: Asegurar que el botón esté en posición fija en el primer clic **
    if (!isButtonFixed) {
        // Obtenemos la posición actual para que el movimiento sea suave
        const currentRect = btnNo.getBoundingClientRect();
        
        // Lo convertimos a fixed en su posición actual para que parezca que no se ha movido.
        btnNo.style.position = 'fixed';
        btnNo.style.left = `${currentRect.left}px`;
        btnNo.style.top = `${currentRect.top}px`;
        
        // Marcamos la bandera para que no vuelva a entrar aquí.
        isButtonFixed = true;
    }

    // 1. Obtener las dimensiones de la ventana
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // 2. Obtener las dimensiones del botón "No"
    const btnRect = btnNo.getBoundingClientRect();
    const btnWidth = btnRect.width * noScale; // Usar el tamaño escalado
    const btnHeight = btnRect.height * noScale; // Usar el tamaño escalado
    
    // 3. Definir límites de movimiento para asegurar que el botón siempre sea visible
    const maxX = windowWidth - btnWidth - SAFE_MARGIN;
    const maxY = windowHeight - btnHeight - SAFE_MARGIN;
    const minX = SAFE_MARGIN;
    const minY = SAFE_MARGIN;


    let newX = Math.random() * (maxX - minX) + minX;
    let newY = Math.random() * (maxY - minY) + minY;
    
    // 4. Evitar que el botón "No" caiga encima de la tarjeta central
    const cardRect = questionCard.getBoundingClientRect();
    let attempts = 0;
    while (
        // Chequeo de colisión con la tarjeta central
        newX < cardRect.right && 
        newX + btnWidth > cardRect.left && 
        newY < cardRect.bottom && 
        newY + btnHeight > cardRect.top &&
        attempts < 100 
    ) {
        // Si hay colisión con la tarjeta central, recalcula la posición
        newX = Math.random() * (maxX - minX) + minX;
        newY = Math.random() * (maxY - minY) + minY;
        attempts++;
    }

    // --- REDUCIR TAMAÑO PROGRESIVAMENTE ---
    noScale = Math.max(MIN_SCALE, noScale - SCALE_DECREMENT);
    
    // 5. Aplicar la nueva posición y la escala usando transform
    btnNo.style.left = `${newX}px`;
    btnNo.style.top = `${newY}px`;
    btnNo.style.transform = `scale(${noScale})`; // Aplicamos la escala aquí

    // 6. El texto de la pregunta NO se modifica.
}

// ASIGNACIÓN DE EVENTO (Sustituye a window.onload y al onclick en HTML)
document.addEventListener('DOMContentLoaded', () => {
    // Asignamos el evento al botón "No"
    btnNo.addEventListener('click', moveNoButton);
});

// Escuchar el evento de redimensionamiento de la ventana para recalcular la posición
window.addEventListener('resize', () => {
    // Si el botón ya ha sido activado y está en modo fijo, lo movemos a una nueva posición segura
    if (isButtonFixed && !btnNo.classList.contains('hidden')) {
        moveNoButton();
    }
});
