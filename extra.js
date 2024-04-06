function placeItemAndClues(itemIndex) {
    let itemPosition = getRandomBlankPosition();
    items[itemIndex].position = itemPosition;
    usedCells.push(itemPosition);

    // Logic to place clues
    let rowCluePosition = getRandomBlankPositionInRow(itemPosition.y, [itemPosition.x]);
    let colCluePosition = getRandomBlankPositionInCol(itemPosition.x, [itemPosition.y]);

    items[itemIndex].clues.push(rowCluePosition, colCluePosition);
    usedCells.push(rowCluePosition, colCluePosition);
}

function getRandomBlankPosition() {
    let randomPosition = getRandomPosition();
    while (usedCells.some(cell => cell.x === randomPosition.x && cell.y === randomPosition.y)) {
        randomPosition = getRandomPosition();
    }
    return randomPosition;
}

function getRandomBlankPositionInRow(row, exclude) {
    let randomPosition = getRandomPositionInRow(row);
    while (usedCells.some(cell => cell.x === randomPosition.x && cell.y === randomPosition.y) || exclude.includes(randomPosition.x)) {
        randomPosition = getRandomPositionInRow(row);
    }
    return randomPosition;
}

function getRandomBlankPositionInCol(col, exclude) {
    let randomPosition = getRandomPositionInCol(col);
    while (usedCells.some(cell => cell.x === randomPosition.x && cell.y === randomPosition.y) || exclude.includes(randomPosition.y)) {
        randomPosition = getRandomPositionInCol(col);
    }
    return randomPosition;
}

function getRandomPositionInRow(row, excludeCols = []) {
    let potentialPositions = [];
    for (let col = 0; col < boardSize; col++) {
        if (!excludeCols.includes(col) && !usedCells.some(cell => cell.x === col && cell.y === row)) {
            potentialPositions.push({x: col, y: row});
        }
    }
    return potentialPositions[Math.floor(Math.random() * potentialPositions.length)];
}

function getRandomPositionInCol(col, excludeRows = []) {
    let potentialPositions = [];
    for (let row = 0; row < boardSize; row++) {
        if (!excludeRows.includes(row) && !usedCells.some(cell => cell.x === col && cell.y === row)) {
            potentialPositions.push({x: col, y: row});
        }
    }
    return potentialPositions[Math.floor(Math.random() * potentialPositions.length)];
}