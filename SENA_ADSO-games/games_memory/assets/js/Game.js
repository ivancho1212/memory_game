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
    this.URL = "https://consumo-api-628e4-default-rtdb.firebaseio.com/api/user.json"; // path data JSON
    this.pathImg = this.serverPath + "/assets/img/memory/"; // path data imgs 
    this.pathImgDafault = this.serverPath + "/assets/img/memory/img_default.jpg"; // path data img default 
    //this.longBootstrap = 12 / level; // Changes Grid bootstrap - The level value is divided by 12 spaces on the grid
    this.newArrayGames = []; // New data matrix 
    this.arrayGamesCard = []; // New data matrix to create the cards
    //this.getDataJson();
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
    this.gameStarted = false;
    this.firstCardClicked = false;
    this.storage = new StorageGame(storageModel); // Instancia de la clase StorageGame
    this.getDataFromFirebase();
  }

  getDataFromFirebase() {
    fetch(this.URL)
      .then(response => response.json())
      .then(data => {
        this.setElements(data);
      
      })
      
      .catch(error => {
        console.error("Error fetching data from Firebase:", error);
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
  // setElements(arraJson) {

  //   let cards = "";
  //   let cardsAux = "";
  //   let cont = 0;
  //   let row = this.num - 1;
  //   this.contGame.innerHTML = "";
  //   this.newArrayGames = arraJson;
  //   const getNewArray = this.getRandomArray(this.min, this.max, this.maxCard);

  //   for (let i = 0; i < getNewArray.length; i++) {
  //     this.totalPointGame += getNewArray[i].valor; ///Accumulating Value Points
  //     cardsAux += '<div class="col-2 pt-2 mx-auto ' + this.contCardClass + '"><div class="card card-size" style="width:9rem;height:15rem;overflow-y:hidden;"><img data-value="' + getNewArray[i].valor + '" data-src="' + this.pathImg + getNewArray[i].img + '" src="' + this.pathImgDafault + '" class="card-img-top back-face" alt="..."> <div class="card-body"><h5 class="card-title text-center mb-0" style="font-size: 1rem;">' + getNewArray[i].nombre + '</h5><p class="card-text text-center mb-0" style="font-size: 0.8rem;">' + getNewArray[i].valor + '</p></div></div></div>';
  //     cont++;
  //     if (row == cont - 1) {
  //       cards += '<div class="row">' + cardsAux + '</div>';
  //       cont = 0;
  //       cardsAux = "";
  //     }
  //   }
  //   this.contGame.innerHTML = cards;
  //   this.changeElementImg();
  // }

  setElements(arraJson) {
    let cards = "";
    let cardsAux = "";
    let cont = 0;
    let row = this.num - 1;
    this.contGame.innerHTML = "";
    this.newArrayGames = arraJson;
    const getNewArray = this.getRandomArray(this.min, this.max, this.maxCard);
  
    // Verifica si getNewArray está vacío o no antes de continuar
    if (getNewArray.length === 0) {
      console.error("El arreglo getNewArray está vacío.");
      return;
    }
  
    for (let i = 0; i < getNewArray.length; i++) {
      this.totalPointGame += getNewArray[i].valor;
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
    this.contCardGame = document.querySelectorAll('.' + this.contCardClass);
    var pathDefault = this.pathImgDafault;
    var gameStarted = false;
    let firstCardClicked = false; // Agregamos una variable para rastrear si se ha hecho clic en la primera carta

    for (let i = 0; i < this.contCardGame.length; i++) {
      const objImg = this.contCardGame[i].querySelector('img');
      this.contCardGame[i].addEventListener('click', () => {
        if (objImg.src == pathDefault) {
          objImg.src = objImg.dataset.src;
          this.setSelectCard(objImg);
          // Iniciar el cronómetro solo si el juego aún no ha comenzado y es la primera carta que se hace clic
          if (!this.gameStarted && !this.firstCardClicked) {
            this.objChronometer.startChronometer();
            this.gameStarted = true;
            this.firstCardClicked = true;
          }
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
      // Iniciar el cronómetro solo si es la primera carta seleccionada y el juego aún no ha comenzado
      if (!this.gameStarted && !this.firstCardClicked) {
        this.objChronometer.startChronometer();
        this.gameStarted = true;
        this.firstCardClicked = true;
      }
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
      const finalScore = this.calculateFinalScore();
      console.log('Final Score:', finalScore);
    });
  }

  calculateFinalScore() {
    // Obtener el tiempo total transcurrido en milisegundos
    const totalTimeMilliseconds = this.objChronometer.conT * this.speed;
    console.log('Total Time (ms):', totalTimeMilliseconds);

    // Calcular la puntuación basada en el tiempo (por ejemplo, 1 punto por cada segundo)
    const timeScore = Math.floor(totalTimeMilliseconds / 1000);
    console.log('Time Score:', timeScore);

    // Sumar la puntuación de todas las cartas encontradas
    const cardsScore = this.totalPoint;
    console.log('Cards Score:', cardsScore);

    // Calcular la puntuación final combinando tiempo y puntuación de las cartas
    const finalScore = timeScore + cardsScore;
    console.log('Final Score:', finalScore);

    // Obtener los datos del almacenamiento local y manejar el formato JSON
    const storedData = this.storage.getStorage();
    console.log('Tipo de datos de storedData:', typeof storedData);
    console.log('Contenido de storedData:', storedData);

    if (!storedData) {
      console.error('Los datos almacenados están vacíos o son indefinidos.');
      return;
    }

    let userData = {};
    try {
      userData = JSON.parse(storedData) || {};
    } catch (error) {
      console.error('Error al analizar JSON desde el almacenamiento:', error);
      return;
    }

    // Agregar la puntuación final a los datos del usuario y almacenarlos en el almacenamiento local
    userData[this.modelStorage] = {
      user: "Nombre del usuario", // Puedes obtener el nombre del usuario de alguna entrada de formulario
      points: finalScore
    };
    this.storage.setStorage(JSON.stringify(userData));

    return finalScore;
  }


}
