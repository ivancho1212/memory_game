/*
  Author:ING. DIEGO CASALLAS
  Date:08/03/2024
  Description:This class is responsible for managing the memory game developed in JavaScript, HTML, CSS
*/
class Game {
  //Constructor method responsible for initializing the attributes, 
  //receives two data, the game container and the difficulty level
  constructor(contGame, level, prog, chor, speed, maxMilliseconds) {
    this.progCont = document.getElementById(prog);
    this.contGame = document.getElementById(contGame); //Content game
    this.contCardGame;//Content class img 
    this.getServer = window.location.origin; //server path name
    this.folderPath = "/games_memory"; //name folder 
    this.serverPath = this.getServer + this.folderPath; //server path name
    this.uriJson = this.serverPath + "/assets/doc/User.json"; // path data JSON
    this.pathImg = this.serverPath + "/assets/img/memory/"; // path data imgs 
    this.pathImgDafault = this.serverPath + "/assets/img/memory/img_default.jpg"; // path data img default 
    //this.longBootstrap = 12 / level; // Changes Grid bootstrap - The level value is divided by 12 spaces on the grid
    this.newArrayGames = []; // New data matrix 
    this.arrayGamesCard = []; // New data matrix to create the cards
    this.getDataJson();
    this.num = level; // Attribute level 
    this.max = 19; // Attribute for maximum array length 
    this.min = 0;// Attribute for min array length 
    this.maxCard = (this.num * this.num) / 2; //Number of cards to be used
    this.selected = true; //boolean validate click object
    this.selectedCard = []; //array for add data selected 
    this.totalPointGame = 0; //accumulating Value Points game
    this.totalPoint = 0; //accumulating Value Points 
    this.contCardClass = "contCard";//This class container card
    this.objChronometer = new Chronometer(chor, speed, maxMilliseconds);
    

  }

  //Method to read the JSON file, execute the setElements method sending an array of data
  getDataJson() {
    fetch(this.uriJson)
      .then(response => response.json())
      .then(data => {
        this.setElements(data);
        this.objChronometer.startChronometer();
      });
  }

  //Method for constructing the data array for the game cards
  getRandomArray(min, max, count) {
    let contentGame = [];
    let contentNum = [];
    if (min > max || count > max - min) {
      return false;
    }
    while (contentGame.length < count) {
      var num = Math.floor((Math.random() * (max - min)) + min);
      if (!contentNum.includes(num)) {
        contentGame.push(this.newArrayGames[num]);
        contentNum.push(num);
      }
    }
    this.arrayGamesCard = contentGame.concat(contentGame);
    return this.setShuffleArray(this.arrayGamesCard);
  }

  //This method are for changes array for array random, Receive an agreement, return another random array
  setShuffleArray(dataArrar) {
    return dataArrar.sort(() => Math.random() - 0.5);
  }

  //This method is to create the elements dynamically, Receive an agreement, create cards
  setElements(arraJson) {

    let cards = "";
    let cardsAux = "";
    let cont = 0;
    let row = this.num - 1;
    this.contGame.innerHTML = "";
    this.newArrayGames = arraJson;
    const getNewArray = this.getRandomArray(this.min, this.max, this.maxCard);

    for (let i = 0; i < getNewArray.length; i++) {
      this.totalPointGame += getNewArray[i].valor; ///Accumulating Value Points
      cardsAux += '<div class="col-2 pt-2 mx-auto ' + this.contCardClass + '"><div class="card card-size" style="width:9rem;height:15rem;overflow-y:hidden;"><img data-value="' + getNewArray[i].valor + '" data-src="' + this.pathImg + getNewArray[i].img + '" src="' + this.pathImgDafault + '" class="card-img-top back-face" alt="..."> <div class="card-body"><h5 class="card-title text-center mb-0" style="font-size: 1rem;">' + getNewArray[i].nombre + '</h5><p class="card-text text-center mb-0" style="font-size: 0.8rem;">' + getNewArray[i].valor + '</p></div></div></div>';
      cont++;
      if (row == cont - 1) {
        cards += '<div class="row">' + cardsAux + '</div>';
        cont = 0;
        cardsAux = "";
      }
    }
    this.contGame.innerHTML = cards;
    this.changeElementImg();
  }
  //This method is to add event listener for container card, answer in the change de img 
  changeElementImg() {

    this.contCardGame = document.querySelectorAll('.' + this.contCardClass);//Content card
    var pathDefault = this.pathImgDafault;
    var gameStarted = false; // Inicializa la variable gameStarted

    for (let i = 0; i < this.contCardGame.length; i++) {
      const objImg = this.contCardGame[i].querySelector('img');
      this.contCardGame[i].addEventListener('click', () => {
          if (objImg.src == pathDefault) {
              objImg.src = objImg.dataset.src;
              this.setSelectCard(objImg);
              // Aquí iniciamos el cronómetro al hacer clic en la primera carta
              this.objChronometer.startChronometer(60); // Cambia 60 al tiempo establecido en segundos
          }
          if (!gameStarted) {
              this.objChronometer.startChronometer();
              gameStarted = true;
          }
      });
  }
}
  

  //This method is  
  setSelectCard(obj) {
    let selectedPoint = 0;
    if (this.selected) {
      this.selected = false;
      this.selectedCard[0] = obj;
    } else {
      this.selectedCard[1] = obj;
      this.selected = true;
    }
    if (this.selectedCard.length > 1) {
      if (this.selectedCard[0].dataset.src == this.selectedCard[1].dataset.src) {
        this.selectedCard[0].parentElement.removeEventListener('click', () => { });
        this.selectedCard[1].parentElement.removeEventListener('click', () => { });
        selectedPoint = this.selectedCard[0].dataset.value;

        // Aplicar efecto de desaparición a las cartas
        this.selectedCard[0].parentElement.style.transition = 'opacity 0.5s';
        this.selectedCard[1].parentElement.style.transition = 'opacity 0.5s';
        this.selectedCard[0].parentElement.style.opacity = 0;
        this.selectedCard[1].parentElement.style.opacity = 0;

        // Eliminar las cartas después de un tiempo
        setTimeout(() => {
          this.selectedCard[0].parentElement.style.display = 'none';
          this.selectedCard[1].parentElement.style.display = 'none';
          this.selectedCard = [];
          this.totalPoint += parseInt(selectedPoint);
          this.setProgressData(((this.totalPoint) / (this.totalPointGame / 2)) * 100);

          // Verificar si todas las cartas coinciden para finalizar el juego
          if (this.totalPoint === this.totalPointGame / 2) {
            this.finishGame();
          }
        }, 500); // Tiempo para que se complete el efecto de desaparición
      } else {
        // Las cartas no coinciden
        setTimeout(() => {
          this.selectedCard[0].src = this.pathImgDafault;
          this.selectedCard[1].src = this.pathImgDafault;
          this.selectedCard = [];
        }, 600); // Cambiar el tiempo según desees
      }
    }
  }


  //This method is for set progress data 
  setProgressData(dataProgress) {
    this.progCont.innerText = parseInt(dataProgress) + "%";
    this.progCont.style.width = dataProgress + "%";

  }
  
  // En el método finishGame()

  finishGame() {
    // Detener el cronómetro
    this.objChronometer.clearChronometer();
    
    const congratsMessage = document.getElementById('congratsMessage');
    congratsMessage.style.display = 'block'; // Mostrar el mensaje de felicitaciones y el formulario
  
    const playerNameInput = document.getElementById('playerNameInput');
    const saveScoreBtn = document.getElementById('submitScoreButton');
    const leaderboard = document.getElementById('leaderboard');
  
    saveScoreBtn.addEventListener('click', () => {
      const playerName = playerNameInput.value;
      if (playerName) {
        const playerScore = this.totalPoint;
        const playerData = { name: playerName.toUpperCase(), score: playerScore };
  
        let scores = JSON.parse(localStorage.getItem('scores')) || [];
        scores.push(playerData);
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 5);
        localStorage.setItem('scores', JSON.stringify(scores));
        showLeaderboard(scores); // Mostrar los puntajes después de enviar
        congratsMessage.style.display = 'none'; // Ocultar el mensaje de felicitaciones y el formulario
        leaderboard.style.display = 'block'; // Mostrar la lista de los 5 mejores puntajes
      } else {
        alert("Debes ingresar tu nombre para registrar tu puntuación.");
      }
    });
  }
}


