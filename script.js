document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 5; // 5x5 board
    let playerPosition = { x: 2, y: 2 }; // Start in the middle
    let usedCells = [];

    let gameBoard = document.getElementById('game-board');

    let items = [
        { name: 'Item 1', position: null, clues: [], imageUrl: 'https://i.ibb.co/FJKxhTN/Item-1.png', clueUrl: 'https://i.ibb.co/N6WH3r3/Item-1-clue.png' },
        { name: 'Item 2', position: null, clues: [], imageUrl: 'https://i.ibb.co/BZ1sVDB/Item-2.png', clueUrl: 'https://i.ibb.co/8mJ7ysN/Item-2-clue.png' },
        { name: 'Item 3', position: null, clues: [], imageUrl: 'https://i.ibb.co/PZSPtwk/Item-3.png', clueUrl: 'https://i.ibb.co/F3ddfZk/Item-3-clue.png' },
    ];

    function initializeGame() {
        gameBoard.innerHTML = ''; // Clear previous board
        usedCells = []; // Reset used cells

        generateCells();
        setStargateBackground();
        placeOases();
        items.forEach((item, index) => { placeItemAndClues(index); });
        updatePlayerPosition();
        attachMovementControls();
    }

    function generateCells() {
        for (let i = 0; i < boardSize * boardSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            gameBoard.appendChild(cell);
        }
    }

    function setStargateBackground() {
        const centerIndex = playerPosition.y * boardSize + playerPosition.x;
        const cells = document.querySelectorAll('#game-board .cell');
        cells[centerIndex].classList.add('stargate');
        markUsed(playerPosition.x, playerPosition.y);
    }

    function markUsed(x, y, properties = {}) {
        usedCells.push({ x, y, ...properties });
    }    

    function placeOases() {
        let oasisPositions = generateRandomOasesPositions(4, boardSize);
        let mirageIndex = Math.floor(Math.random() * oasisPositions.length); // Randomly choose one oasis to be a mirage
    
        oasisPositions.forEach((pos, index) => {
            const cells = document.querySelectorAll('#game-board .cell');
            const cellIndex = pos.y * boardSize + pos.x;
            cells[cellIndex].classList.add('oasis');
            // Use the updated markUsed to specify whether the cell is a mirage or not
            markUsed(pos.x, pos.y, { isOasis: true, isMirage: index === mirageIndex });
        });
    }
    

    function generateRandomOasesPositions(count, boardSize) {
        let positions = [];
        while (positions.length < count) {
            let position = getRandomPosition();
            if (position) { // Ensure position is not null
                positions.push(position);
                // Marking an oasis, specifying if it's a mirage
                //markUsed(pos.x, pos.y, { isOasis: true, isMirage: index === mirageIndex }); // Mark the position as used
                console.log('Oasis at:', position); // Debugging line
            }
        }
        return positions;
    }

    function getRandomPosition() {
        let availablePositions = [];
        for (let y = 0; y < boardSize; y++) {
            for (let x = 0; x < boardSize; x++) {
                if (!usedCells.some(usedCell => usedCell.x === x && usedCell.y === y)) {
                    availablePositions.push({ x, y });
                }
            }
        }
        if (availablePositions.length > 0) {
            const randomIndex = Math.floor(Math.random() * availablePositions.length);
            return availablePositions[randomIndex];
        } else {
            return null; // No available positions
        }
    }

    // Modify the placeItemAndClues function to mark positions without setting background images
    function placeItemAndClues(itemIndex) {
        let itemPosition = getRandomBlankPosition();
        if (!itemPosition) return; // Exit if no position is available
        items[itemIndex].position = itemPosition;
        // Marking an item cell
        markUsed(itemPosition.x, itemPosition.y, { isItem: true, itemId: itemIndex });
        console.log('Item placed at:', itemPosition); // Debugging line

        // Logic to place clues, now just marking their positions without revealing
        let rowCluePosition = getRandomBlankPositionInRow(itemPosition.y, [itemPosition.x]);
        let colCluePosition = getRandomBlankPositionInCol(itemPosition.x, [itemPosition.y], itemPosition.y);

        console.log('Item Row Clue is placed at:', rowCluePosition); // Debugging line
        console.log('Item Column Clue is placed at:', colCluePosition); // Debugging line

        items[itemIndex].clues = [rowCluePosition, colCluePosition];

        // Marking a clue cell
        markUsed(rowCluePosition.x, rowCluePosition.y, { isClue: true, itemId: itemIndex });
        markUsed(colCluePosition.x, colCluePosition.y, { isClue: true, itemId: itemIndex });
    }
    
    // Updated to ensure it uses only available positions
    function getRandomBlankPosition() {
        return getRandomPosition();
    }
    
    // Adjusted to include an exclusion check for columns and ensure uniqueness
    function getRandomBlankPositionInRow(row, excludeCols = []) {
        let potentialPositions = [];
        for (let col = 0; col < boardSize; col++) {
            if (!excludeCols.includes(col) && !usedCells.some(cell => cell.x === col && cell.y === row)) {
                potentialPositions.push({ x: col, y: row });
            }
        }
        if (potentialPositions.length > 0) {
            const randomIndex = Math.floor(Math.random() * potentialPositions.length);
            return potentialPositions[randomIndex];
        } else {
            return null; // Handle the case where no position is available
        }
    }
    
    // Adjusted to include an exclusion check for rows and ensure uniqueness, also added a parameter to exclude the item's row
    function getRandomBlankPositionInCol(col, excludeRows = [], itemRow = null) {
        let potentialPositions = [];
        for (let row = 0; row < boardSize; row++) {
            if (row !== itemRow && !excludeRows.includes(row) && !usedCells.some(cell => cell.x === col && cell.y === row)) {
                potentialPositions.push({ x: col, y: row });
            }
        }
        if (potentialPositions.length > 0) {
            const randomIndex = Math.floor(Math.random() * potentialPositions.length);
            return potentialPositions[randomIndex];
        } else {
            return null; // Handle the case where no position is available
        }
    }

    // Add a function to handle the "Dig" action
    function digAtSelectedCell() {
        const selectedCellIndex = playerPosition.y * boardSize + playerPosition.x;
        const selectedCell = document.querySelectorAll('#game-board .cell')[selectedCellIndex];
        const cellContent = checkCellContent(playerPosition.x, playerPosition.y);

        switch(cellContent.type) {
            case 'item':
                selectedCell.style.backgroundImage = `url(${cellContent.imageUrl})`;
                break;
            case 'clue':
                selectedCell.style.backgroundImage = `url(${cellContent.clueUrl})`;
                break;
            case 'oasis':
                // Change the oasis to a water body or drought based on the logic
                const imageUrl = cellContent.isMirage ? `url(https://i.ibb.co/CPsjJ7H/Drought.png)` : `url(https://i.ibb.co/7v4CQ6n/Oasis.png)`;
                selectedCell.style.backgroundImage = `url(${imageUrl})`;
                break;
            case 'nothing':
                selectedCell.style.backgroundImage = `url(https://i.ibb.co/nPdbJJX/Hole.png)`; // Assuming you have a 'holeImageUrl'
                break;
        }
    }

    function checkCellContent(x, y) {
        const cell = usedCells.find(cell => cell.x === x && cell.y === y);
        if (!cell) return { type: 'nothing' };

        if (cell.isOasis) {
            return { type: 'oasis', isMirage: cell.isMirage };
        }
        if (cell.isItem) {
            const item = items[cell.itemId];
            return { type: 'item', imageUrl: item.imageUrl };
        }
        if (cell.isClue) {
            const item = items[cell.itemId];
            return { type: 'clue', clueUrl: item.clueUrl };
        }

        // Default case, might be useful if you have other types of cells
        return { type: 'unknown' };
    } 
    



    function updatePlayerPosition() {
        const cells = document.querySelectorAll('#game-board .cell');
        cells.forEach(cell => cell.classList.remove('player')); // Clear previous position
    
        const playerCellIndex = playerPosition.y * boardSize + playerPosition.x;
        if (cells[playerCellIndex]) {
            cells[playerCellIndex].classList.add('player');
        }
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

    // Attach event listeners for Enter key and a Dig button to call digAtSelectedCell
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            digAtSelectedCell();
        }
    });
    document.getElementById('dig').addEventListener('click', digAtSelectedCell); // Assuming you have a Dig button with id="dig"

    initializeGame();
});
