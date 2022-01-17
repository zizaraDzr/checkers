let checkersArray = [] //в этой переменной будет массив из 32 шашек
let turn = true //если эта переменная true, то ходят белые, если false, то чёрные
let attackingFlag = false
const letterArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const numberArray = ['1', '2', '3', '4', '5', '6', '7', '8']
let board = document.querySelector('.board')
let blackBlocks
let activeBlocks

class Checker {
  constructor(coordinate) {
    this.name = coordinate
    this.queen = false
    this.active = false
    this.color = 0
    this.attacked = false
    this.attacking = false
  }
  //Метод, проверяющий, не становится ли шашка дамкой. Если занимает поля whiteQueens и blackQueens, то this.queen = true
  checkIfQueen() {
    let whiteQueens = ['B8', 'D8', 'F8', 'H8']
    let blackQueens = ['A1', 'C1', 'E1', 'G1']
    if (
      this.classList.contains('white-checker') &&
      !this.queen &&
      whiteQueens.lastIndexOf(this.name) !== -1
    ) {
      return (this.queen = true)
    }
    if (
      this.classList.contains('black-checker') &&
      !this.queen &&
      blackQueens.lastIndexOf(this.name) !== -1
    ) {
      return (this.queen = true)
    }
  }
}
//Отрисовка доски с присвоением клеткам (не шашкам) id (строка 50) через вспомогательный массив letterArray.
function drawCheckers() {
  let block
  let flag = true

  for (let i = 8; i > 0; i--) {
    for (let j = 0; j < 8; j++) {
      if (j == 0) flag = !flag
      block = document.createElement('div')

      if (flag) {
        block.className = 'block black'
        block.id = letterArray[j] + i
      } else {
        block.className = 'block white'
      }

      board.appendChild(block)
      flag = !flag
    }
  }
  //Расстановка шашек на доске и создание массива объектов шашек с присвоением значений свойства color, где 1 - белая шашка, 2 - чёрная шашка, 0 - пустая клетка.
  blackBlocks = document.querySelectorAll('.black')
  for (let blackBlock of blackBlocks) {
    let checker = document.createElement('div')
    if (+blackBlock.id[1] <= 3) {
      checker.className = 'checker white-checker'

      blackBlock.appendChild(checker)
    } else if (+blackBlock.id[1] >= 6) {
      checker.className = 'checker black-checker'
      blackBlock.appendChild(checker)
    } else {
      blackBlock.appendChild(checker)
      checker.className = ''
    }
    let NewChecker = new Checker(blackBlock.id)
    if (checker.classList.contains('white-checker')) {
      NewChecker.color = 1
    } else if (checker.classList.contains('black-checker')) {
      NewChecker.color = 2
    } else {
      NewChecker.color = 0
    }
    checkersArray.push(NewChecker)
  }
}

//Отрисовка полей букв и цифр
function drawSquareTitles() {
  let horizontalTitle = document.querySelectorAll('.square-titles-horizontal')
  let verticalTitle = document.querySelectorAll('.square-titles-vertical')
  for (let letter of horizontalTitle) {
    for (let i = 0; i < 8; i++) {
      let createLetter = document.createElement('div')
      createLetter.className = 'square-letter'
      createLetter.textContent = letterArray[i]
      letter.appendChild(createLetter)
    }
  }
  for (let number of verticalTitle) {
    for (let i = 1; i <= 8; i++) {
      let createNumber = document.createElement('div')
      createNumber.className = 'square-number'
      createNumber.textContent = i
      number.appendChild(createNumber)
    }
  }
}

drawCheckers()
drawSquareTitles()
moveTransition(true)
board.addEventListener('click', clickChecker)

function clearArrayOfSquares(squaresArray) {
  let i = 0
  while (i < squaresArray.length) {
    if (squaresArray[i].length > 2 || Number.isNaN(squaresArray[i])) {
      squaresArray.splice(i, 1)
      // console.log(squaresArray[i]);
    } else {
      ++i
    }
  }
  return squaresArray
}

//Проверку клеток вынес в отдельную функцию, которую вызываем в более сложных
function checkSquares(checkerFromCheckerArray) {
  let indexLetter = letterArray.indexOf(checkerFromCheckerArray.name[0])
  let indexNumber = numberArray.indexOf(checkerFromCheckerArray.name[1])
  // console.log(indexLetter);
  // console.log(indexNumber);
  //Составляем массив из четырёх клеток по диагонали
  let squaresForCheck = [
    letterArray[indexLetter + 1] + numberArray[indexNumber + 1],
    letterArray[indexLetter - 1] + numberArray[indexNumber + 1],
    letterArray[indexLetter - 1] + numberArray[indexNumber - 1],
    letterArray[indexLetter + 1] + numberArray[indexNumber - 1],
  ]
  // console.log(checkedSquares);

  //Удаление стрёмных элементов массива checkedSquares навроде 'Cundefined' и NaN, чтобы потом когда-либо не проводить проверок на них;
  let checkedSquares = clearArrayOfSquares(squaresForCheck)
  return checkedSquares
}

//Показ хода
function showMoves(checker) {
  for (let blackBlock of blackBlocks) {
    blackBlock.classList.remove('active-block')
  }
  let currentChecker = checkersArray.find(
    (o) => o.name === checker.parentElement.id
  )
  let checkedSquares = checkSquares(currentChecker)

  for (let i = 0; i < checkedSquares.length; i++) {
    let checkedSquare = checkersArray.find((o) => o.name === checkedSquares[i])
    let square = document.querySelector(`#${checkedSquare.name}`)
    //если шашка атакующая, то рядом с ней есть атакуемые, а значит подсвечиваются следующие клетки за атакуемой
    if (currentChecker.attacking == true && checkedSquare.attacked == true) {
      let squareForAttackMove = checkAttackPossibility(currentChecker, checkedSquare)
      console.log(squareForAttackMove)
      if (squareForAttackMove) {
        square = document.querySelector(`#${squareForAttackMove}`)
        square.classList.add('active-block')
      }
      
    } else if (
      checkedSquare.color === 0 &&
      currentChecker.color !== 0 &&
      currentChecker.attacking == false
    ) {
      //ограничение по ходу назад, черные могут ходить только в сторону уменьшения числа координаты клетки, белые только в сторону увеличения
      if (
        currentChecker.color == 1 &&
        currentChecker.name[1] < checkedSquare.name[1]
      )
        square.classList.add('active-block')
      else if (
        currentChecker.color == 2 &&
        currentChecker.name[1] > checkedSquare.name[1]
      ) {
        square.classList.add('active-block')
      }
    }
  }
}

//функция, позволяющая продолжать пожирать шашки после первого пожирания, если это возможно, вызывается на строке 443, введена переменная attackingFlag для работы
function continueToEat(checkerFromCheckerArray) {
  let checkerFromCheckerArrayDiv = document.querySelector(
    `#${checkerFromCheckerArray.name}`
  ).firstElementChild
  let possibleCheckersForTurn = document.querySelectorAll('.checker')
  let checkedSquares = checkSquares(checkerFromCheckerArray)
  for (let i = 0; i < checkedSquares.length; i++) {
    let checkedSquare = checkersArray.find((o) => o.name === checkedSquares[i])
    let squareForAttackMove = checkAttackPossibility(
      checkerFromCheckerArray,
      checkedSquare
    )
    if (!squareForAttackMove) continue
    let square = document.querySelector(`#${squareForAttackMove}`)
    square.classList.add('active-block')
    checkerFromCheckerArray.attacking = true
    checkerFromCheckerArray.active = true
  }
  if (checkerFromCheckerArray.attacking == true) {
    for (let checker of possibleCheckersForTurn) {
      checker.classList.remove('player-turn')
    }
    checkerFromCheckerArrayDiv.classList.add('player-turn')
  } else {
    attackingFlag = false
  }
}

//Написал алгоритм на проверку возможности съесть шашку, добавил новые свойства шашкам attacked и attacking, если шашка атакует, то attacking - true, если атакована, то attacked - true
function checkAttackPossibility(attackingChecker, attackedChecker) {
  let squareToAttack = ''
  let squareToAttackFirstSymbol
  let squareToAttackSecondSymbol
  // console.log(attackingChecker);
  // console.log(attackedChecker);
  if (
    attackingChecker.color == attackedChecker.color ||
    attackedChecker.color == 0 ||
    !attackedChecker
  ) {
    return null
  }
  //суть алгоритма описал в тексте
  let indexLetterAttacking = letterArray.indexOf(attackingChecker.name[0])
  let indexLetterAttacked = letterArray.indexOf(attackedChecker.name[0])
  let indexNumberAttacked = numberArray.indexOf(attackedChecker.name[1])
  if (indexLetterAttacking > indexLetterAttacked) {
    squareToAttackFirstSymbol = letterArray[indexLetterAttacked - 1]
  } else {
    squareToAttackFirstSymbol = letterArray[indexLetterAttacked + 1]
  }
  if (attackingChecker.name[1] > attackedChecker.name[1]) {
    squareToAttackSecondSymbol = numberArray[indexNumberAttacked - 1]
  } else {
    squareToAttackSecondSymbol = numberArray[indexNumberAttacked + 1]
  }
  squareToAttack = squareToAttackFirstSymbol + squareToAttackSecondSymbol
  // console.log(squareToAttack);
  if (!squareToAttack) {
    return null
  }
  let newPositionOfAttackingChecker = checkersArray.find(
    (o) => o.name === squareToAttack
  )
  // console.log(newPositionOfAttackingChecker);
  if (!newPositionOfAttackingChecker) {
    return null
  }
  if (newPositionOfAttackingChecker.color == 0) {
    attackedChecker.attacked = true
    // console.log(attackedChecker);
    return squareToAttack
  }
}

//Сделать ход
function makeMove(activeBlackBlock) {
  let movedChecker = checkersArray.find((o) => o.active === true) //ищем активную шашку со свойством active = true, которая всегда только одна;

  // console.log(movedChecker);

  let newChecker = checkersArray.find((o) => o.name === activeBlackBlock.id) //это будущая шашка, которая появится на подсвеченном блоке

  // console.log(newChecker);

  let removedCheckerDiv = document.querySelector(
    `#${movedChecker.name}`
  ).firstElementChild // сам div-шашка

  // console.log(removedCheckerDiv);

  //Манипуляция с классами контейнеров и переписывание свойств вовлечённых в ход объектов из массива
  if (movedChecker.color === 1) {
    activeBlackBlock.firstElementChild.classList.add(
      'checker',
      'white-checker',
      'active-checker'
    )
    newChecker.color = 1
  }
  if (movedChecker.color === 2) {
    activeBlackBlock.firstElementChild.classList.add(
      'checker',
      'black-checker',
      'active-checker'
    )
    newChecker.color = 2
  }
  //Удаление съедаемой шашки
  if (movedChecker.attacking == true) {
    let indexLetterMovedChecker = letterArray.indexOf(movedChecker.name[0])
    let indexLetterNewChecker = letterArray.indexOf(newChecker.name[0])
    let eatenCheckerNameLetter =
      letterArray[(indexLetterMovedChecker + indexLetterNewChecker) / 2]
    let eatenCheckerNameNumber =
      (+movedChecker.name[1] + +newChecker.name[1]) / 2
    let eatenCheckerName = eatenCheckerNameLetter + eatenCheckerNameNumber
    let eatenChecker = checkersArray.find((o) => o.name == eatenCheckerName)
    // console.log("съедаемая шашкa", eatenChecker);
    let eatenCheckerDiv = document.querySelector(
      `#${eatenCheckerName}`
    ).firstElementChild
    eatenChecker.color = 0
    eatenCheckerDiv.className = ''
    attackingFlag = true
  }
  removedCheckerDiv.className = ''
  movedChecker.color = 0
  checkersArray.forEach((item) => {
    item.attacked = false
    item.attacking = false
    item.active = false
  })
  for (let blackBlock of blackBlocks) {
    blackBlock.classList.remove('active-block')
  }
  // console.log(checkersArray);
  return newChecker
}
// переход хода

function moveTransition(firstMove = false) {
  let checkersDivCollection = document.querySelectorAll('.checker')
  if (!firstMove) turn = !turn
  let color = turn ? 'white' : 'black'
  let colorCheck
  if (color == 'white') {
    colorCheck = 1
  } else {
    colorCheck = 2
  }
  // console.log(colorCheck);
  for (let checker of checkersDivCollection) {
    checker.classList.remove('player-turn')
    checker.classList.remove('active-checker')
    let currentChecker = checkersArray.find(
      (o) => o.name === checker.parentElement.id
    )
    let squaresForMove = checkSquares(currentChecker)

    for (let i = 0; i < squaresForMove.length; i++) {
      let squareForMove = checkersArray.find(
        (o) => o.name === squaresForMove[i]
      )

      //Здесь шашка проверяется на возможность съесть, если съесть можно, то присваивается шашке attacking = true, а потом на строке 310 получаем массив из attacking-шашек
      let possibleAttack = checkAttackPossibility(currentChecker, squareForMove)
      // console.log(possibleAttack);
      if (possibleAttack && currentChecker.color == colorCheck) {
        currentChecker.attacking = true
      }
      // console.log(squareForMove);
      // console.log(squaresForMove);
      // console.log(squareForMove);
      if (
        checker.classList.contains(`${color}-checker`) &&
        squareForMove.color == 0
      ) {
        checker.classList.add('player-turn')
      }
    }
  }
  let attackingCheckersArray = checkersArray.filter(
    (checker) => checker.attacking == true
  )
  // console.log(attackingCheckersArray);

  //Подсвечиваются только шашки, которые могут съедать, работает пока почему-то с багами, пока не могу понять, что происходит, попробуй сам, там где-то свойства attacking и attacked плывут, скорее всего

  if (attackingCheckersArray.length > 0) {
    for (let checker of checkersDivCollection) {
      // console.log(checker);
      checker.classList.remove('player-turn')
    }
    for (let i = 0; i < attackingCheckersArray.length; i++) {
      let attackingCheckerDiv = document.querySelector(
        `#${attackingCheckersArray[i].name}`
      )
      if (
        attackingCheckerDiv.firstElementChild.classList.contains(
          `${color}-checker`
        )
      ) {
        attackingCheckerDiv.firstElementChild.classList.add('player-turn')
      }
    }
  }
  console.log('функция перехода хода сработала')
}

function clickChecker (e) {
  let clickedChecker = e.target
  let isClickActiveBlock = clickedChecker.classList.contains('active-block')

  // если ход другого игрока и клик мимо 'active-block' выходим из функции (return)
  if (
    !clickedChecker.classList.contains('player-turn') &&
    !isClickActiveBlock
  ) {
    return
  }
  let checkersDivCollection = document.querySelectorAll('.checker')

  //добавил оформление активной шашки, на которую кликнул
  if (clickedChecker.classList.contains('checker')) {
    for (let checker of checkersDivCollection) {
      checker.classList.remove('active-checker')
    }
    clickedChecker.classList.add('active-checker')
  }
  let checkerColor
  if (turn) {
    checkerColor = 'white-checker'
  } else {
    checkerColor = 'black-checker'
  }
  if (clickedChecker.classList.contains(checkerColor)) {
    checkersArray.forEach((item) => {
      item.active = false
    })
    checkersArray.forEach((item) => {
      if (item.name === clickedChecker.parentElement.id) {
        item.active = true
      }
    })
    showMoves(clickedChecker)
  }
  if (isClickActiveBlock) {
    let movedChecker = makeMove(clickedChecker)
    if (attackingFlag) {
      continueToEat(movedChecker) //заново кликать на шашку каждый раз не нужно, она остаётся активной, пока множественное взятие не будет реализовано, надо кликать просто на подсвеченные блоки
    }
    // console.log(attackingFlag);
    if (!attackingFlag) {
      //пока attackingFlag не станет false, функция перехода хода не вызывается. attackingFlag изменяет свои значения на 214 и 314 строках
      moveTransition()
    }
  }
}