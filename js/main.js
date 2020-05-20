// 'use strict'
const MINE = '💣';
const FLAG = '🚩';

var gBoard;
var gIsFirstClick;

var seconds = 00;
// var tens = 00;
// var appendTens = document.getElementById("tens")
var appendSeconds = document.querySelector('.seconds')
var interval;


function initGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
    setMinesNegsCount(gBoard)
    gIsFirstClick = true;
}

function start() {
    interval = setInterval(startTimer, 1000);
}

function stop() {
    clearInterval(interval);
}

function startTimer() {
    seconds++;

    if (seconds < 9) {
        appendSeconds.innerHTML = "0" + seconds;
    }

    // if (seconds > 9) {
    //     appendSeconds.innerHTML = seconds;
    // }

    if (seconds > 99) {
        // seconds++;
        // appendSeconds.innerHTML = "0" + seconds;
        appendSeconds.innerHTML = "0" + 0;
    }

    if (seconds > 9) {
        appendSeconds.innerHTML = seconds;
    }
}

function buildBoard() {
    var board = createMat(4, 4)

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = { minesAroundCount: 4, isShown: false, isMine: false, isMarked: true };
            board[i][j] = cell;
        }
    }

    for (var i = 0; i < 2; i++) {
        var mineLocationI = getRandomIntInclusive(0, (board.length - 1));
        var mineLocationJ = getRandomIntInclusive(0, (board.length - 1));
        board[mineLocationI][mineLocationJ].isMine = true;
        board[mineLocationI][mineLocationJ].minesAroundCount = null;
    }
    console.log('board ', board);
    return board;
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[0].length; j++) {
            var tdId = `cell-${i}-${j}`;
            strHTML += `<td id="${tdId}" onclick="cellClicked(this, ${i}, ${j})" onmousedown="cellMarked(this)"></td>\n`;
        }
        strHTML += '</tr>\n';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function cellMarked(elCell) {
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
        start()
        gIsFirstClick = false;
    } 

    // if (event.button === '2') {
        // elCell.innerText = FLAG;
    // }
}


function cellClicked(elCell, i, j) {
    if (gIsFirstClick) {
        start()
        gIsFirstClick = false;
    } 
    var strHTML = '';
    var cell = gBoard[i][j]
    cell.isShown = true;

    if (cell.isMine === true) {
        strHTML += MINE;
    } else if ((cell.minesAroundCount = countMines(i, j, gBoard)) === 0) {
        strHTML += '';
    } else {
        strHTML += `${cell.minesAroundCount = countMines(i, j, gBoard)}`;
    }

    elCell.innerText = strHTML;
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




