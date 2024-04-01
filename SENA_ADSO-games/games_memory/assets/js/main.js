// Variables globales
var game;
const contId = "containerGame";
const progress = "progressbarId";
const chronometer = "chronometerId";
const speed = 1000;
const maxMilliseconds = 2000;
let selectedLevel = 0;


// Función para configurar el nivel del juego
function setLevel(value) {
    selectedLevel = value;
}

// Función para mostrar el botón de inicio cuando se selecciona un nivel
function showStartButton() {
    document.getElementById("btn_start").style.display = "inline-block";
}

document.addEventListener("DOMContentLoaded", function () {
    // Obtener los botones de nivel
    var btnEasy = document.getElementById("btn_easy");
    var btnHalf = document.getElementById("btn_half");
    var btnHard = document.getElementById("btn_hard");

    // Función para establecer el nivel
    function setLevelAndShowButton(value) {
        selectedLevel = value;
        showStartButton();
    }

    // Agregar eventos de clic a los botones de nivel
    if (btnEasy) {
        btnEasy.addEventListener("click", function () {
            setLevelAndShowButton(2); // Configurar el nivel como "easy" y mostrar el botón "Start"
        });
    }

    if (btnHalf) {
        btnHalf.addEventListener("click", function () {
            setLevelAndShowButton(4); // Configurar el nivel como "half" y mostrar el botón "Start"
        });
    }

    if (btnHard) {
        btnHard.addEventListener("click", function () {
            setLevelAndShowButton(6); // Configurar el nivel como "hard" y mostrar el botón "Start"
        });
    }

    // Obtener el botón de "Start"
    var btnStart = document.getElementById("btn_start");
    if (btnStart) {
        // Agregar evento de clic para mostrar el modal y comenzar el juego al hacer clic en "Start"
        btnStart.addEventListener("click", function () {
            // Mostrar el modal
            $('#gameModal').modal('show');

            // Iniciar el juego dentro del modal
            startGame(selectedLevel);
        });
    } else {
        console.error("El elemento 'btn_start' no se encontró en el DOM.");
    }
});

function startGame(level) {
    // Crear el juego dentro del modal
    game = new Game(contId, level, progress, chronometer, speed, maxMilliseconds);

    // Crear el cronómetro con el tiempo de advertencia
    const warningTime = 30; // Cambia a 30 segundos
    game.objChronometer = new Chronometer(chronometer, speed, maxMilliseconds, warningTime);

    // Iniciar el juego y el cronómetro
    game.objChronometer.startChronometer();
    // Detener y reiniciar el cronómetro
    game.objChronometer.clearChronometer();
    game.objChronometer.startChronometer();
}


document.addEventListener("DOMContentLoaded", function () {
    var btnInicio = document.getElementById("btnInicio");
    if (btnInicio) {
        btnInicio.addEventListener("click", function () {
            // Cerrar el modal
            $('#gameModal').modal('hide');

            // Limpiar el contenido del modal
            $('#containerGame').html('');

            // Detener el cronómetro y establecerlo en cero
            // game.objChronometer.clearChronometer();
            // document.getElementById("chronometerId").innerText = "00:00:00";

            // Reiniciar el progreso
            document.getElementById("progressbarId").style.width = "0%";

            // Ocultar el botón de inicio
            document.getElementById("btn_start").style.display = "none";

            // Limpiar el contenido del top 5
            document.getElementById('leaderboardBody').innerHTML = '';

            // Ocultar el top 5
            document.getElementById('leaderboard').style.display = 'none';

            // Ocultar el mensaje de felicitación y el input
            document.getElementById('congratsMessage').style.display = 'none';
        });
    }
});
 // Función para mostrar los 5 mejores puntajes
  
 function showLeaderboard(scores) {
    console.log("Top 5 puntajes:");
    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = ''; // Limpiar contenido anterior de la tabla
    scores.forEach((entry, index) => {
        console.log(`${index + 1}. ${entry.name}: ${entry.score}`);
        const row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row" class="gold-font" style="font-size: 25px;">${index + 1}</th>
            <td class="gold-font" style="font-size: 25px;">${entry.name}</td>
            <td class="gold-font" style="font-size: 25px;" min-width: 150px;">${entry.score}</td>
        `;
        leaderboardBody.appendChild(row);
    });
}


// Llamada a la función showTop5() cuando se haga clic en el botón "Show Top"
document.getElementById('btn_showTop5').addEventListener('click', showTop5);


function showTop5() {
    // Mostrar el modal
    $('#gameModal').modal('show');

    // Obtener los puntajes almacenados o una lista vacía si no hay datos
    const scores = JSON.parse(localStorage.getItem('scores')) || [];

    // Mostrar la lista de los 5 mejores puntajes si ya hay datos guardados
    if (scores.length > 0) {
        const leaderboard = document.getElementById('leaderboard');
        leaderboard.style.display = 'block';
        showLeaderboard(scores); // Mostrar los datos del top 5 en la tabla
    } else {
        leaderboard.style.display = 'none'; // Ocultar la tabla si no hay datos
    }
}
function hideCards() {
    const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.style.display = "none";
  });
  }
  


