let checkersArray = []; //в этой переменной будет массив из 32 шашек
let turn = true; //если эта переменная true, то ходят белые, если false, то чёрные
const letterArray = ["A", "B", "C", "D", "E", "F", "G", "H"];
const numberArray = ["1", "2", "3", "4", "5", "6", "7", "8"];
let blackCheckers = document.querySelectorAll(".black-checker");
let whiteCheckers = document.querySelectorAll(".white-checker");
let blackBlocks;
let activeBlocks;

class Checker {
  constructor(coordinate) {
    this.name = coordinate;
    this.queen = false;
    this.active = false;
    this.color = 0;
  }
  //Метод, проверяющий, не становится ли шашка дамкой. Если занимает поля whiteQueens и blackQueens, то this.queen = true
  checkIfQueen() {
    let whiteQueens = ["B8", "D8", "F8", "H8"];
    let blackQueens = ["A1", "C1", "E1", "G1"];
    if (
      this.classList.contains("white-checker") &&
      !this.queen &&
      whiteQueens.lastIndexOf(this.name) !== -1
    ) {
      return (this.queen = true);
    }
    if (
      this.classList.contains("black-checker") &&
      !this.queen &&
      blackQueens.lastIndexOf(this.name) !== -1
    ) {
      return (this.queen = true);
    }
  }
}
//Отрисовка доски с присвоением клеткам (не шашкам) id (строка 50) через вспомогательный массив letterArray.
function drawCheckers() {
  let board = document.querySelector(".board");
  let block;
  let flag = true;

  for (let i = 8; i > 0; i--) {
    for (let j = 0; j < 8; j++) {
      if (j == 0) flag = !flag;
      block = document.createElement("div");

      if (flag) {
        block.className = "block black";
        block.id = letterArray[j] + i;
      } else {
        block.className = "block white";
      }

      board.appendChild(block);
      flag = !flag;
    }
  }
  //Расстановка шашек на доске и создание массива объектов шашек с присвоением значений свойства color, где 1 - белая шашка, 2 - чёрная шашка, 0 - пустая клетка.
  blackBlocks = document.querySelectorAll(".black");
  for (blackBlock of blackBlocks) {
    let checker = document.createElement("div");
    if (+blackBlock.id[1] <= 3) {
      checker.className = "checker white-checker";

      blackBlock.appendChild(checker);
    } else if (+blackBlock.id[1] >= 6) {
      checker.className = "checker black-checker";
      blackBlock.appendChild(checker);
    } else {
      blackBlock.appendChild(checker);
    }
    let NewChecker = new Checker(blackBlock.id);
    if (checker.classList.contains("white-checker")) {
      NewChecker.color = 1;
    } else if (checker.classList.contains("black-checker")) {
      NewChecker.color = 2;
    } else {
      NewChecker.color = 0;
    }
    checkersArray.push(NewChecker);
  }
}

//Отрисовка полей букв и цифр
function drawSquareTitles() {
  let horizontalTitle = document.querySelectorAll(".square-titles-horizontal");
  let verticalTitle = document.querySelectorAll(".square-titles-vertical");
  for (letter of horizontalTitle) {
    for (i = 0; i < 8; i++) {
      createLetter = document.createElement("div");
      createLetter.className = "square-letter";
      createLetter.textContent = letterArray[i];
      letter.appendChild(createLetter);
    }
  }
  for (number of verticalTitle) {
    for (i = 1; i <= 8; i++) {
      createNumber = document.createElement("div");
      createNumber.className = "square-number";
      createNumber.textContent = i;
      number.appendChild(createNumber);
    }
  }
}

drawCheckers();
drawSquareTitles();

//Показ хода
function showMoves(checker) {
  for (blackBlock of blackBlocks) {
    blackBlock.classList.remove("active-block");
  }
  let currentChecker = checkersArray.find(
    (o) => o.name === checker.parentElement.id
  );
  let indexLetter = letterArray.indexOf(currentChecker.name[0]);
  let indexNumber = numberArray.indexOf(currentChecker.name[1]);
  // console.log(indexLetter);
  // console.log(indexNumber);
  //Составляем массив из четырёх клеток по диагонали
  let checkedSquares = [
    letterArray[indexLetter + 1] + numberArray[indexNumber + 1],
    letterArray[indexLetter - 1] + numberArray[indexNumber + 1],
    letterArray[indexLetter - 1] + numberArray[indexNumber - 1],
    letterArray[indexLetter + 1] + numberArray[indexNumber - 1],
  ];
  // console.log(checkedSquares);

  //Проверяем эти четыре клетки, если символов больше двух (когда боковые клетки проверяют, то возвращается undefined в виде строки, в H8 и A1 частные случаи, когда NaN вообще вылазит, потому что там undefined+undefined), то итерация пропускается.
  for (i = 0; i < 4; i++) {
    if (checkedSquares[i].length > 2 || Number.isNaN(checkedSquares[i])) {
      continue;
    }
    let checkedSquare = checkersArray.find((o) => o.name === checkedSquares[i]);
    // console.log(checkedSquare);
    let square = document.querySelector(`#${checkedSquare.name}`);
    if (checkedSquare.color === 0 && currentChecker.color !== 0) {
      square.classList.add("active-block");
    }
  }
}

//Сделать ход
function makeMove(activeBlackBlock) {
  let movedChecker = checkersArray.find((o) => o.active === true); //ищем активную шашку со свойством active = true, которая всегда только одна;

  // console.log(movedChecker);

  let newChecker = checkersArray.find((o) => o.name === activeBlackBlock.id); //это будущая шашка, которая появится на подсвеченном блоке

  // console.log(newChecker);

  let removedCheckerDiv = document.querySelector(
    `#${movedChecker.name}`
  ).firstElementChild; // сам div-шашка

  // console.log(removedCheckerDiv);

  //Манипуляция с классами контейнеров и переписывание свойств вовлечённых в ход объектов из массива
  if (movedChecker.color === 1) {
    activeBlackBlock.firstElementChild.classList.add(
      "checker",
      "white-checker"
    );
    newChecker.color = 1;
  }
  if (movedChecker.color === 2) {
    activeBlackBlock.firstElementChild.classList.add(
      "checker",
      "black-checker"
    );
    newChecker.color = 2;
  }
  removedCheckerDiv.className = "";
  movedChecker.color = 0;
  movedChecker.active = false;
  turn = !turn; //переход хода
  for (blackBlock of blackBlocks) {
    blackBlock.classList.remove("active-block");
  }
  // console.log(checkersArray);
}

document.body.addEventListener("click", function (e) {
  let clickedChecker = e.target;
  // console.log(clickedChecker);
  let checkerColor;
  if (turn) {
    checkerColor = "white-checker";
  } else {
    checkerColor = "black-checker";
  }
  if (clickedChecker.classList.contains(checkerColor)) {
    let pressedChecker = checkersArray.find(
      (o) => o.name === clickedChecker.parentElement.id
    );
    pressedChecker.active = true;
    //Меняем значение свойства active на false у всех остальных шашек, кроме кликнутой, т.к. должна быть только одна шашка со значением active.
    for (i = 0; i < checkersArray.length; i++) {
      if (
        checkersArray[i].active === true &&
        checkersArray[i].name !== pressedChecker.name
      ) {
        checkersArray[i].active = false;
      }
    }
    showMoves(clickedChecker);
  }
});

document.body.addEventListener("click", function (e) {
  let clickedActiveBlock = e.target;
  if (clickedActiveBlock.classList.contains("active-block")) {
    makeMove(clickedActiveBlock);
  }
});
