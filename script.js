let points = 0;
let timerValue = 15;
let timerInterval;
let gameStarted = false;

function startIfNotStarted() {
    if (!gameStarted) {
        startGame();
    }
}

function startGame() {
    gameStarted = true;
    points = 0;
    timerValue = 15;
    document.getElementById('points').textContent = points;
    document.getElementById('timer').textContent = timerValue;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timerValue--;
    document.getElementById('timer').textContent = timerValue;
    if (timerValue <= 0) {
        clearInterval(timerInterval);
        endGame();
    }
}

function endGame() {
    alert('Time is up! Your final score is ' + points);
}

function generateAnagrams(word) {
    const anagrams = [];

    function generate(word, anagram = '') {
        if (word.length === 0) {
            anagrams.push(anagram);
            return;
        }

        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            const remainingChars = word.slice(0, i) + word.slice(i + 1);
            generate(remainingChars, anagram + char);
        }
    }

    generate(word);
    return anagrams;
}

async function fetchWordDefinitions(word) {
    const url = `https://wordsapiv1.p.rapidapi.com/words/${word}/definitions`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '1b6cf5bf7fmsh1ce240fecca7f96p1c1d16jsn42a7428d3242',
            'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data.definitions;
    } catch (error) {
        console.error('Error fetching word definitions:', error);
        return [];
    }
}

async function findAnagrams() {
    if (!gameStarted) {
        alert('Please start the game first.');
        return;
    }

    const inputLetters = document.getElementById('letters-input').value.toLowerCase().replace(/[^a-z]/g, '');

    if (!inputLetters) {
        alert('Please enter some letters.');
        return;
    }

    const anagramsList = document.getElementById('anagrams-list');
    anagramsList.innerHTML = '';

    const anagrams = generateAnagrams(inputLetters);
    for (const anagram of anagrams) {
        const definitions = await fetchWordDefinitions(anagram);
        if (definitions.length > 0) {
            const listItem = document.createElement('li');
            listItem.textContent = `${anagram}: ${definitions[0].definition}`;
            anagramsList.appendChild(listItem);
            points += anagram.length;
            document.getElementById('points').textContent = points;
        }
    }

    if (anagramsList.children.length === 0) {
        alert('No valid words found.');
    }

    document.getElementById('letters-input').value = '';
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        findAnagrams();
        document.getElementById('letters-input').value = '';
        event.preventDefault();
    }
}
