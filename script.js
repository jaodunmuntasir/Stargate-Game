document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 5; // 5x5 board
    let playerPosition = { x: 2, y: 2 }; // Start in the middle

    function initializeGame() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = ''; // Clear previous board

        // Generate cells and randomly place oases
        let oasisPositions = generateRandomOasesPositions(4, boardSize);
        for (let i = 0; i < boardSize * boardSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (oasisPositions.includes(i)) {
                cell.classList.add('oasis');
            }
            gameBoard.appendChild(cell);
        }

        // Set the Stargate background for the starting cell
        setStargateBackground();
        updatePlayerPosition();
        attachMovementControls();
    }

    function setStargateBackground() {
        const centerIndex = playerPosition.y * boardSize + playerPosition.x;
        const cells = document.querySelectorAll('#game-board .cell');
        cells[centerIndex].classList.add('stargate');
    }

    function generateRandomOasesPositions(count, boardSize) {
        let positions = [];
        while (positions.length < count) {
            let randomPosition = Math.floor(Math.random() * boardSize * boardSize);
            if (!positions.includes(randomPosition) && randomPosition !== boardSize * boardSize / 2) { // Exclude center
                positions.push(randomPosition);
            }
        }
        return positions;
    }

    function updatePlayerPosition() {
        const cells = document.querySelectorAll('#game-board .cell');
        cells.forEach(cell => {
            cell.classList.remove('player');
        });

        const playerCellIndex = playerPosition.y * boardSize + playerPosition.x;
        cells[playerCellIndex].classList.add('player');
    }

    function movePlayer(direction) {
        switch (direction) {
            case 'up':    if (playerPosition.y > 0) playerPosition.y -= 1; break;
            case 'down':  if (playerPosition.y < boardSize - 1) playerPosition.y += 1; break;
            case 'left':  if (playerPosition.x > 0) playerPosition.x -= 1; break;
            case 'right': if (playerPosition.x < boardSize - 1) playerPosition.x += 1; break;
        }
        updatePlayerPosition();
    }

    function attachMovementControls() {
        document.getElementById('move-up').addEventListener('click', () => movePlayer('up'));
        document.getElementById('move-down').addEventListener('click', () => movePlayer('down'));
        document.getElementById('move-left').addEventListener('click', () => movePlayer('left'));
        document.getElementById('move-right').addEventListener('click', () => movePlayer('right'));

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') movePlayer('up');
            if (e.key === 'ArrowDown') movePlayer('down');
            if (e.key === 'ArrowLeft') movePlayer('left');
            if (e.key === 'ArrowRight') movePlayer('right');
        });
    }

    initializeGame();
});
