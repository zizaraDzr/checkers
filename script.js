let checkersArray = [] //в этой переменной будет массив из 32 шашек
let turn = true //если эта переменная true, то ходят белые, если false, то чёрные
let attackingFlag = false
const letterArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const numberArray = ['1', '2', '3', '4', '5', '6', '7', '8']
let blackCheckers = document.querySelectorAll('.black-checker')
let whiteCheckers = document.querySelectorAll('.white-checker')
let board = document.querySelector('.board')
let blackBlocks
let activeBlocks
// шашку можно съесть
let ahtung = null
let squareForAttackMove = null
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
    let toNumberLetter = letterArray.findIndex(item => item === blackBlock.id[0])
    if (+blackBlock.id[1] <= 3) {
      checker.className = 'checker white-checker'
      checker.setAttribute('position', blackBlock.id) 
      checker.setAttribute('active', false)
      checker.setAttribute('color', 'white')
      checker.setAttribute('forMove', `${toNumberLetter}${blackBlock.id[1]}`)

      blackBlock.appendChild(checker)
    } else if (+blackBlock.id[1] >= 6) {
      checker.className = 'checker black-checker'
      checker.setAttribute('position', blackBlock.id) 
      checker.setAttribute('active', false)
      checker.setAttribute('color', 'white')
      checker.setAttribute('forMove', `${toNumberLetter}${blackBlock.id[1]}`)
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
    for (i = 0; i < 8; i++) {
      let createLetter = document.createElement('div')
      createLetter.className = 'square-letter'
      createLetter.textContent = letterArray[i]
      letter.appendChild(createLetter)
    }
  }
  for (let number of verticalTitle) {
    for (i = 1; i <= 8; i++) {
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
addEventToBoard()

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
  // поменять active
  checker.setAttribute('active', true)

  let currentChecker = checkersArray.find(
    (o) => o.name === checker.parentElement.id
  )
  let checkedSquares = checkSquares(currentChecker)
  // let position = checker.getAttribute('position')
  console.log('currentChecker', currentChecker)

  for (i = 0; i < checkedSquares.length; i++) {
    let checkedSquare = checkersArray.find((o) => o.name === checkedSquares[i])

    let square = document.querySelector(`#${checkedSquare.name}`)
    //если шашка атакующая, то рядом с ней есть атакуемая, а значит подсвечивается следующая клетка за атакуемой
    if (currentChecker.attacking == true && checkedSquare.attacked == true) {
    console.warn('checkedSquare', checkedSquare)
      ahtung = document.querySelector(`#${checkedSquare.name}`)
      console.log('ahtung', ahtung)
      squareForAttackMove = checkAttackPossibility(
        currentChecker,
        checkedSquare
      )
      console.warn('squareForAttackMove', squareForAttackMove)
      square = document.querySelector(`#${squareForAttackMove}`)
      square.classList.add('active-block')
    } else if (
      checkedSquare.color === 0 &&
      currentChecker.color !== 0 &&
      currentChecker.attacking == false
    ) {
      square.classList.add('active-block')
    }
  }
}

//Написал алгоритм на проверку возможности съесть шашку, добавил новые свойства шашкам attacked и attacking, если шашка атакует, то attacking - true, если атакована, то attacked - true
function checkAttackPossibility(attackingChecker, attackedChecker) {
  let squareToAttack = ''
  let squareToAttackFirstSymbol
  let squareToAttackSecondSymbol
  // console.log('атакующая шашка',attackingChecker);
  // console.log('Съедаемая шашка', attackedChecker);
  if (
    attackingChecker.color == attackedChecker.color ||
    attackedChecker.color == 0 ||
    !attackedChecker
  ) {
    return
  }
  //суть алгоритма описал в тексте, который кинул тебе в вк
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
  if (!squareToAttack) {
    return
  }
  let newPositionOfAttackingChecker = checkersArray.find(
    (o) => o.name === squareToAttack
  )
  // console.log(newPositionOfAttackingChecker);
  if (!newPositionOfAttackingChecker) {
    return
  }
  if (newPositionOfAttackingChecker.color == 0) {
    attackedChecker.attacked = true
    // console.log(attackedChecker);
    return squareToAttack
  }
}

//Сделать ход
function makeMove(activeBlackBlock) {
  console.log('activeBlackBlock', activeBlackBlock)
  if (activeBlackBlock.id === squareForAttackMove ) {
    console.log('пешка съедена', ahtung)
    // ahtung.firstElementChild.remove()
    ahtung.firstElementChild.className = ''
  }
  let movedChecker = checkersArray.find((o) => o.active === true) //ищем активную шашку со свойством active = true, которая всегда только одна;
  let movedCheckerNode = document.querySelector('[active=true]')
  // console.log('movedCheckerNode', movedCheckerNode);

  let newChecker = checkersArray.find((o) => o.name === activeBlackBlock.id) //это будущая шашка, которая появится на подсвеченном блоке

  // console.log(newChecker);

  let removedCheckerDiv = document.querySelector(
    `#${movedChecker.name}`
  ).firstElementChild // сам div-шашка

  // console.log('removedCheckerDiv', removedCheckerDiv);

  //Манипуляция с классами контейнеров и переписывание свойств вовлечённых в ход объектов из массива
  if (movedChecker.color === 1) {
    activeBlackBlock.firstElementChild.classList.add('checker', 'white-checker')
    // let createElement = document.createElement('div')
    // createElement.classList.add('checker', 'white-checker')
    // createElement.setAttribute('position', activeBlackBlock.id)
    // activeBlackBlock.appendChild(createElement)
    newChecker.color = 1
    
  }
  if (movedChecker.color === 2) {
    activeBlackBlock.firstElementChild.classList.add('checker', 'black-checker')
    newChecker.color = 2
    // let createElement = document.createElement('div')
    // createElement.classList.add('checker', 'black-checker')
    // createElement.setAttribute('position', activeBlackBlock.id)
    // activeBlackBlock.appendChild(createElement)
  }
  // Вот на этой строке надо что-то написать, чтобы съедаемая шашка удалялась, у которой свойство объекта attacked = true
  removedCheckerDiv.className = ''
  // removedCheckerDiv.remove();
  movedChecker.color = 0
  movedChecker.active = false
  movedChecker.attacked = false
  movedChecker.attacking = false
  movedCheckerNode.setAttribute('active', false)
  movedCheckerNode.setAttribute('attacked', false)
  movedCheckerNode.setAttribute('attacking', false)
  for (let blackBlock of blackBlocks) {
    blackBlock.classList.remove('active-block')
  }
  // console.log(checkersArray);
}
// переход хода
function moveTransition(firsrMove = false) {
  let findChecker
  if (!firsrMove) turn = !turn
  let color = turn ? 'white' : 'black'
  findChecker = document.querySelectorAll(`.checker`)
  for (let checker of findChecker) {
    checker.classList.remove('player-turn')
    let currentChecker = checkersArray.find(
      (o) => o.name === checker.parentElement.id
    )
    // console.log(currentChecker)
    let squaresForMove = checkSquares(currentChecker)
    // console.log(currentChecker);
    // console.log(squaresForMove);
    // console.log(currentChecker);
    for (i = 0; i < squaresForMove.length; i++) {
      let squareForMove = checkersArray.find(
        (o) => o.name === squaresForMove[i]
      )
      // console.log(currentChecker);
      // console.log(squaresForMove[i]);
      //Здесь шашка проверяется на возможность съесть, если съесть можно, то присваивается шашке attacking = true, а потом на строке 310 получаем массив из attacking-шашек
      let possibleAttack = checkAttackPossibility(currentChecker, squareForMove)
      // console.log(possibleAttack)
      // console.log(possibleAttack);
      if (possibleAttack) {
        currentChecker.attacking = true
        console.log('possibleAttack', possibleAttack);
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
    for (let checker of findChecker) {
      // console.log(checker);
      checker.classList.remove('player-turn')
    }
    for (i = 0; i < attackingCheckersArray.length; i++) {
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
}

function addEventToBoard() {
  board.addEventListener('click', function (e) {
    let clickedChecker = e.target
    console.log(clickedChecker)
    let isClickActiveBlock = clickedChecker.classList.contains('active-block')

    // если ход другого игрока и клик мимо 'active-block' выходим из функции (return)
    if (
      !clickedChecker.classList.contains('player-turn') &&
      !isClickActiveBlock
    ) {
      return
    }

    let checkerColor
    if (turn) {
      checkerColor = 'white-checker'
    } else {
      checkerColor = 'black-checker'
    }
    if (clickedChecker.classList.contains(checkerColor)) {
      checkersArray.forEach((item) => {
        if (item.name === clickedChecker.parentElement.id) {
          item.active = true
        }
      })
      showMoves(clickedChecker)
    }
    if (isClickActiveBlock) {
      makeMove(clickedChecker)
      moveTransition()
    }
  })
}
