
// Definición de variables para el tablero
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Definición de variables para el pájaro
let birdWidth = 34; 
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

// Definición de variables para las tuberías
let pipeArray = [];
let pipeWidth = 64; 
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// Definición de variables para la física del juego
let velocityX = -2; // Velocidad de las tuberías moviéndose hacia la izquierda
let velocityY = 0; // Velocidad del salto del pájaro
let gravity = 0.4;

// Variables de control del juego
let gameOver = false;
let score = 0;

//Aun no inica el juego
let gameStarted = false;


// Función que se ejecuta cuando la ventana se carga
window.onload = function() {
    // Obtener el elemento del tablero y configurar sus dimensiones
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // Contexto utilizado para dibujar en el tablero

    // Cargar la imagen del pájaro
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    // Cargar las imágenes de las tuberías
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    // Iniciar la animación del juego
    requestAnimationFrame(update);

    // Colocar nuevas tuberías cada 1.5 segundos
    setInterval(placePipes, 1500);

    // Agregar un event listener para el clic izquierdo del ratón para controlar el salto del pájaro
    document.addEventListener("click", moveBird);
}

// Función principal que actualiza el estado del juego y maneja la animación
function update() {
    requestAnimationFrame(update);

    context.clearRect(0, 0, board.width, board.height);


    if (!gameStarted) {
        // Mostrar el mensaje de inicio
        context.fillStyle = "white";
        context.font = "30px sans-serif";
        context.fillText("Click para comenzar", 50, boardHeight / 2);
        return;
    }

    if (gameOver) {
        context.font = "bold 45px sans-serif";
        context.fillText("GAME OVER", 43, 290);
        context.font = "bold 25px sans-serif";
        context.fillText("Click to restart", 100, 330);
        context.fillText("Final Score: " + score, 100, 160);
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Actualizar la posición del pájaro con la gravedad
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); // Aplicar la gravedad y limitar la posición del pájaro en la parte superior del lienzo
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    // Verificar si el pájaro ha caído fuera del lienzo
    if (bird.y > board.height) {
        gameOver = true;
    }

    // Dibujar y gestionar las tuberías
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        // Verificar si el pájaro ha pasado la tubería y actualizar la puntuación
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; // 0.5 porque hay 2 tuberías, así que 0.5*2 = 1, 1 por cada par de tuberías
            pipe.passed = true;
        }

        // Verificar si hay colisión entre el pájaro y la tubería
        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // Eliminar tuberías que han salido del lienzo
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); // Elimina el primer elemento del array
    }

    // Puntaje
    context.fillStyle = "white";
    context.font = "35px sans-serif";
    context.fillText("Score:", boardWidth - 357, 45);

    // Mostrar la puntuación en la pantalla
    context.fillStyle = "white";
    context.font="35px sans-serif";
    context.fillText(score, 110, 45);

  
}

// Función para colocar nuevas tuberías en el juego
function placePipes() {
    if (gameOver) {
        return;
    }

    // Calcular la posición vertical de la nueva tubería de manera aleatoria
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    // Crear la tubería superior
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    // Crear la tubería inferior
    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

// Función para manejar el salto del pájaro al hacer clic izquierdo
function moveBird(e) {
    if (!gameStarted) {
        // Iniciar el juego al hacer clic
        gameStarted = true;
        return;
    }
    
    if (e.type === "click") {
        // Saltar cuando se hace clic con el botón izquierdo
        velocityY = -6;

        // Restablecer el juego si está terminado
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

// Función para detectar colisiones entre dos objetos rectangulares
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
