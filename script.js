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
    btnNo.style.transform = `scale(${noScale})`; // Solo aplicamos la escala aquí

    // 6. El texto de la pregunta NO se modifica.
}


// Función para inicializar el botón en una posición fija y visible
function initializeButtonPosition() {
    // 1. Asegurar que la posición sea fija para el movimiento en el viewport
    btnNo.style.position = 'fixed'; 

    const btnSiRect = document.getElementById('btnSi').getBoundingClientRect();
    
    // Si el botón "Sí" no tiene dimensiones calculadas, usamos una posición de fallback visible.
    if (btnSiRect.width === 0 || btnSiRect.height === 0) {
        console.warn('El botón "Sí" aún no tiene dimensiones. Colocando el botón "No" en el centro para visibilidad de fallback.');
        
        // Fallback: Colocar el botón "No" en una posición garantizada (parte inferior central)
        btnNo.style.left = '50%';
        btnNo.style.top = '70%';
        // Usamos translate(-50%, -50%) para centrarlo completamente cuando usamos % en left/top
        btnNo.style.transform = `translate(-50%, -50%) scale(${noScale})`; 
        
        // Hacerlo visible antes de salir del fallback
        btnNo.classList.remove('hidden');
        return;
    }
    
    // Lógica de cálculo original (si las dimensiones son válidas)
    // Calcular posición inicial justo a la derecha del botón "Sí"
    const initialX = btnSiRect.right + 20; // 20px a la derecha del botón "Sí"
    const initialY = btnSiRect.top; // A la misma altura que el botón "Sí"
    
    // Aplicar la posición inicial
    btnNo.style.left = `${initialX}px`;
    btnNo.style.top = `${initialY}px`;
    btnNo.style.transform = `scale(${noScale})`; 

    // Hacerlo visible
    btnNo.classList.remove('hidden'); 
}


// Inicializar el botón cuando la ventana haya cargado completamente (incluyendo layout y recursos)
window.onload = () => {
    // Usamos un pequeño retraso para asegurar que todos los elementos CSS y el layout estén finalizados
    setTimeout(initializeButtonPosition, 50); 
};

// Escuchar el evento de redimensionamiento de la ventana para recalcular la posición
window.addEventListener('resize', () => {
    if (!btnNo.classList.contains('hidden')) {
        // Si la ventana cambia de tamaño, forzamos al botón "No" a saltar a una nueva posición válida
        moveNoButton(); 
    }
});
