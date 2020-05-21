// 'use strict'
const BOOM = '💥';
const MINE = '💣';
const FLAG = '🚩';
const HEART = '❤️';
const EMPTYHEART = '🤍';
const GAMEISON = '😀';
const LOSE = '🤯';
const WIN = '😎';


var gBoard;
var gGame;
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gIsFirstClick;
var gLivesLeft;
var gLivesTotal;
// var gFirstClickedCellCordinates;


var gElTimer = document.querySelector('.timer')
var gInterval;


function initGame() {
    gIsFirstClick = true;
    gLivesLeft = 3;
    gLivesTotal = 3;
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }

    gBoard = buildBoard(gLevel.SIZE);
    renderBoard(gBoard);
    setMinesNegsCount(gBoard)
    updateLives()
    // gFirstClickedCellCordinates = null;
    gElTimer.innerText = '000'
    // var elModal = document.querySelector('.modal');
    // elModal.style.display = 'none';
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = GAMEISON;
}

function updateLives() {
    var elLives = document.querySelector('.lives');
    strHTML = '';
    for (var i = 0; i < gLivesLeft; i++) {
        strHTML += HEART;
    }
    for (var i = 0; i < (gLivesTotal - gLivesLeft); i++) {
        strHTML += EMPTYHEART;
    }

    elLives.innerText = strHTML;
}

function resetGame() {
    stopTimer()
    initGame()
}

function chooseLevel(number) {
    if (!gGame.isOn) return;

    if (number === 16) {
        gLevel.SIZE = 4;
        gLevel.MINES = 2;
    } else if (number === 64) {
        gLevel.SIZE = 8;
        gLevel.MINES = 12;
    } else if (number === 144) {
        gLevel.SIZE = 12;
        gLevel.MINES = 30;
    }
    initGame()
    stopTimer()
}


function startTimer() {
    gInterval = setInterval(updateTimerText, 1000);
}


function stopTimer() {
    clearInterval(gInterval);
}


function updateTimerText() {
    if (!gGame.isOn) return;

    gGame.secsPassed++;

    if (gGame.secsPassed <= 9) {
        gElTimer.innerHTML = '00' + gGame.secsPassed;
    } else if (gGame.secsPassed > 9 && gGame.secsPassed <= 99) {
        gElTimer.innerHTML = '0' + gGame.secsPassed;
    } else {
        gElTimer.innerHTML = gGame.secsPassed;
    }
}


function buildBoard(size) {
    var board = createMat(size, size)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = { minesAroundCount: null, isShown: false, isMine: false, isMarked: false };
            board[i][j] = cell;
        }
    }

    for (var i = 0; i < gLevel.MINES; i++) {
        var mineLocationI = getRandomIntInclusive(0, (board.length - 1));;
        var mineLocationJ = getRandomIntInclusive(0, (board.length - 1));;

        board[mineLocationI][mineLocationJ].isMine = true;
        board[mineLocationI][mineLocationJ].minesAroundCount = null;
    }
    return board;
}


// && (gFirstClickedCellCordinates[i] === mineLocationI || gFirstClickedCellCordinates[j] === mineLocationJ)) 

// function placeMines(board) {
// }


function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var tdId = `cell-${i}-${j}`;
            strHTML += `<td id="${tdId}" onmousedown="checkClickMouseType(event, this, ${i}, ${j})"></td>\n`;
        }
        strHTML += '</tr>\n';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


function checkClickMouseType(event, elCell, i, j) {
    if (!gGame.isOn) return;
    if (document.addEventListener) {
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        }, false);
    } else {
        document.attachEvent('oncontextmenu', function () {
            window.event.returnValue = false;
        });
    }

    if (gIsFirstClick) {
        // gFirstClickedCellCordinates = { i: i, j: j };
        gIsFirstClick = false;
        startTimer()
        // placeMines(gBoard)
    }

    switch (event.which) {
        case 1:
            cellClicked(elCell, i, j)
            break
        case 3:
            cellMarked(elCell, i, j)
            break
    }

    checkGameOver(gBoard);
}


function cellMarked(elCell, i, j) {
    var cell = gBoard[i][j];

    if (cell.isShown) return;

    if (cell.isMarked) {
        elCell.innerText = '';
        cell.isMarked = false;
        gGame.markedCount--
    } else {
        elCell.innerText = FLAG;
        cell.isMarked = true;
        gGame.markedCount++
    }
}


function cellClicked(elCell, i, j) {
    var strHTML = '';
    var cell = gBoard[i][j];

    if (cell.isMarked) return;

    cell.isShown = true;
    gGame.shownCount++

    if (cell.isMine) {
        if (gLivesLeft > 1) {
            strHTML = BOOM;
            cell.isShown = false;
        } else {
            strHTML = MINE;
        }
        gLivesLeft--
        updateLives();
    } else if ((cell.minesAroundCount = countMines(i, j, gBoard)) === 0) {
        strHTML = '';
        expandShown(gBoard, elCell, i, j);
    } else {
        strHTML = `${cell.minesAroundCount = countMines(i, j, gBoard)}`;
    }

    elCell.innerText = strHTML;

    if (cell.isMine && gLivesLeft === 0) {
        elCell.style.backgroundColor = 'red';
    }

    if (strHTML === BOOM) {
        setTimeout(function () {
            strHTML = '';
            elCell.innerText = strHTML;
        }, 200);
    }
}


function expandShown(board, elCell, cellI, cellJ) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === cellI && j === cellJ) continue;
            var currCell = board[i][j];

            if (currCell.minesAroundCount === 0) expandShown(board, i, j)

            if (!currCell.isShown) {
                currCell.isShown = true;
                gGame.shownCount++
                renderCell(i, j, currCell.minesAroundCount);
            }
        }
    }
}


function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) continue;
            var minesCount = countMines(i, j, gBoard);
            board[i][j].minesAroundCount = minesCount;
        }
    }
}


function countMines(cellI, cellJ, board) {
    var minesSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board[0].length) continue;
            if (i === cellI && j === cellJ) continue;
            var currCell = board[i][j];

            if (currCell.isMine) minesSum++
        }
    }
    return minesSum;
}

function checkGameOver(board) {
    var elSmiley = document.querySelector('.smiley');

    if (gLivesLeft === 0) {
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[0].length; j++) {
                var currCell = board[i][j];
                if (currCell.isMine) renderCell(i, j, MINE);
            }
        }

        gGame.isOn = false;
        elSmiley.innerText = LOSE;
        stopTimer()
    } else {
        var cellCount = gLevel.SIZE * gLevel.SIZE;
        var cellChecked = 0;
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[0].length; j++) {
                var currCell = board[i][j];
                if (currCell.isShown || (currCell.isMine && currCell.isMarked)) cellChecked++
            }
        }

        if (cellCount === cellChecked) {
            gGame.isOn = false;
            elSmiley.innerText = WIN;
            stopTimer()
        }
    }
}





