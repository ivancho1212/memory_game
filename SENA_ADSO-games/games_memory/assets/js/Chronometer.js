/*
Author:ING. DIEGO CASALLAS
Date:13/04/2024
Description: 
*/
class Chronometer {

  constructor(chronometerId, speed, maxMilliseconds, warningTime) { // Añade "warningTime" como parámetro
    this.objChronometer = document.getElementById(chronometerId);
    this.getElementsLabel = this.objChronometer.querySelectorAll('label');
    this.conT = 0;
    this.seconds = "00";
    this.minutes = "00";
    this.totalSeconds = 60;
    this.secondsAux = 0;
    this.minutesAux = 0;
    this.speed = speed;
    this.maxMilliseconds = maxMilliseconds;
    this.warningTime = warningTime; // Almacena el tiempo de advertencia
    this.intervalID;
    this.updateSecondsLabel();
  }

  startChronometer(startTime) {
    let totalSeconds = startTime;
    this.intervalID = setInterval(() => {
      if (totalSeconds >= 0) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        this.getElementsLabel[2].textContent = seconds < 10 ? `0${seconds}` : seconds;
        totalSeconds--;
      } else {
        clearInterval(this.intervalID);
        this.showGameOverModal(); // Mostrar el modal de game over
      }
    }, this.speed);
  }

  updateSecondsLabel() {
    this.getElementsLabel[2].textContent = "60"; // Iniciar en 60 segundos
  }

  clearChronometer() {
    clearInterval(this.intervalID);
    this.getElementsLabel[1].textContent = "00";
  }

  hideCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.style.display = "none";
    });
  }

  showGameOverModal() {
    const modal = document.getElementById('gameOverModal');
    modal.style.display = "block";
    this.hideCards(); // Ocultar las cartas al mostrar el modal
  }
}