import { dictionary } from "./word.js";

function getRandomWords(dictionary) {
    const selectedWords = new Set() ;

    while (selectedWords.size <= 30) {
        const randomIndex = Math.floor(Math.random() * dictionary.length);
        selectedWords.add(dictionary[randomIndex]);
    }

    return Array.from(selectedWords)
}

function createNumberGrid() {
    const container = document.getElementById('number-container');
    const newGame = document.createElement('div');
    newGame.classList.add('new-game')
    newGame.textContent = 'New Game'
    container.appendChild(newGame);
    for (let i = 1; i <= 30; i++) {
        const numberGrid = document.createElement('div');
        numberGrid.classList.add('number-grid', `number-grid${i}`);
        numberGrid.textContent = i
        container.appendChild(numberGrid);
    }

    newGame.addEventListener('click', startNewGame);
}

function startNewGame() {
    state.secrets = getRandomWords(dictionary);
    state.currentContainer = 1;
    state.currentRow = 1;
    state.currentCol = 1;

    // Clear the existing grids
    document.getElementById('number-container').innerHTML = '';
    document.getElementById('main-container').innerHTML = '';

    // Regenerate the grids
    createMainGrid();
    createNumberGrid();
    registerKeyboardEvents();
}

const state = {
    secrets : getRandomWords(dictionary),
    currentContainer: 1,
    currentRow: 1,
    currentCol: 1,
};

function createMainGrid() {
    const container = document.getElementById('main-container');

    for (let i = 1; i <= 30; i++) {
        const gridContainer = document.createElement('div');
        gridContainer.classList.add('container', `container${i}`);

        for (let j = 0; j <= 30; j++) {
            const box = document.createElement('div');
            if (j == 0) {
                box.classList.add('box')
            } else {
                box.classList.add('box', `box${(Math.floor((j-1)/5)+1)}${(j-1)%5 + 1}`);
            }
            if (j == 0) {
                box.textContent = i;
            }
            
            gridContainer.appendChild(box);
        }

        container.appendChild(gridContainer);
    }
}

function registerKeyboardEvents() {
    document.body.onkeydown = (e) => {
        const key = e.key;

        if (key === 'Enter' && state.currentCol == 6) {
            const word = getCurrentWord();
            if (isWordValid(word)) {
                revealWord(word);
                state.currentRow++;
                state.currentCol = 1;
            } else {
                alert('Not a valid word.')
            }
        }

        if (key === 'Backspace') {
            removeLetter();
        }

        if (isLetter(key)){
            addLetter(key);
        }
    }
}

function getCurrentWord() {
    for (let i = 0; i < 30; i++) {
        var current_word = ''
        const container = document.querySelector(`.container${i+1}`);
        for (let j = 1; j < 6; j++) {
            const box = container.querySelector(`.box${state.currentRow}${j}`);
            current_word += box.textContent;
        }
        return current_word;
    }
}

function isWordValid(word) {
    return dictionary.includes(word);
}

function revealWord(guess) {
    const row = state.currentRow;
    const animation_duration = 500;

    for (let i = 1; i <= 30; i++) {
        const container = document.querySelector(`.container${i}`);
        var a = state.secrets[i-1]

        for (let j = 0; j < 5; j++) {
            const box = container.querySelector(`.box${row}${j+1}`);
            const letter = box.textContent;

            setTimeout(() => {
                if (letter === state.secrets[i][j]) {
                    box.classList.add('right');
                    a = a.replace(letter, '1');
                } else if (a.includes(letter)) {
                    box.classList.add('wrong');
                    a = a.replace(letter, '1');
                } else {
                    box.classList.add('empty');
                }
            }, ((j + 1) * animation_duration) / 2);

            box.classList.add('animated');
            box.style.animationDelay = `${(j * animation_duration) / 2}ms`;
        }
    }

    for (let i = 1; i<=30; i++) {
        const container = document.querySelector(`.container${i}`);
        const numberGrid = document.querySelector(`.number-grid${i}`);

        setTimeout(() => {
            if (state.secrets[i] === guess) {
                numberGrid.classList.add('right');
            }
        }, 1500);

    }
    // 여기에 위에 1~30에 초록 빨강 넣는코드
}

function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
    for (let i = 1; i <= 30; i++){
        if (state.currentCol === 6) return;
        const container = document.querySelector(`.container${i}`);
        const box = container.querySelector(`.box${state.currentRow}${state.currentCol}`);
        box.textContent = letter;
    }
    state.currentCol++;
}

function removeLetter(letter) {
    for (let i = 1; i <= 30; i++) {
        if (state.currentCol === 1) return ;
            const container = document.querySelector(`.container${i}`);
            const box = container.querySelector(`.box${state.currentRow}${state.currentCol-1}`);
            box.textContent = '';   
    }
    state.currentCol--;
}

function start() {
    createMainGrid();
    createNumberGrid();
    registerKeyboardEvents();
    console.log(state.secrets)
}

start()

