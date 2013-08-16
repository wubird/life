var canvasWidth = 500;
var canvasHeight = 500;
var widthCells = canvasWidth / 10;
var heightCells = canvasHeight / 10;
var matrix = new Array();
var ctx;

function init(canvas) {
	if (!canvas) {
		canvas = document.createElement("canvas");
		canvas.id = "canvas";
		document.body.appendChild(canvas);
	}
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	canvas.addEventListener("click", mouseClicked, false);
	ctx = document.getElementById('canvas').getContext('2d');
	drawBoard();
	    
	//fill matrix with 0s	
    for (var i = 0; i < 500; i++) {
        var row = new Array();
        for (var j = 0; j < 500; j++) {
            row[j] = 0;
        }
        matrix[i] = row;
    }
}

//draw grid
function drawBoard() {
	ctx.beginPath();		
	//vertical lines
	for (var i = 0; i < widthCells + 1; i++) {
		ctx.moveTo(i * 10, 0);
		ctx.lineTo(i * 10, heightCells * 100);				
	}

	//horizontal lines
	for (var i = 0; i < heightCells + 1; i++) {
		ctx.moveTo(0, i * 10);
		ctx.lineTo(widthCells * 100, i * 10);				
	}
	ctx.closePath();
	ctx.strokeStyle = "#ccc";
	ctx.stroke();		
}

//on mouse click, if cell is white make green and set to 1, else vice versa
function mouseClicked(e) {
	var cell = getMousePosition(e);
	if (matrix[cell[0]][cell[1]] == 0 ) {
		colorCell(cell[0], cell[1], "green");
		matrix[cell[0]][cell[1]] = 1;
	} else {
		colorCell(cell[0], cell[1], "white");
		matrix[cell[0]][cell[1]] = 0;
	}
}

//return number of neighbors
function getNumNeighbors(matrix, i, j){
    var ret = 0;
    for (var x = Math.max(0, i - 1); x <= Math.min(499, i + 1); x++) {
        for (var y = Math.max(0, j - 1); y <= Math.min(499, j + 1); y++) {
            if (x == i && y == j) {
                continue;
            }
            if (matrix[x][y] == 1) {
                ret++;
            }
        }
    }
    return ret;
}

//return next gen of board
function getNextGen(matrix){
   var newMatrix = new Array();
    for(var i = 0; i < matrix.length; i++) {
        newMatrix.push(matrix[i].slice());
    }
    for (var i = 0; i < 500; i++) {
        for (var j = 0; j < 500; j++) {
            var neighbors = getNumNeighbors(matrix, i, j);
            if (matrix[i][j] == 0) {
                if (neighbors == 3) {
                    newMatrix[i][j] = 1;
					colorCell(i, j, "green");
                }
            } else {
                if (neighbors < 2) {
                    newMatrix[i][j] = 0;
					colorCell(i, j, "white");
                } else if (neighbors > 3) {
                    newMatrix[i][j] = 0;
					colorCell(i, j, "white");
                }
            }
        }
    }
    matrix = newMatrix;
}

function getMousePosition(e) {
	/* returns Cell with .row and .column properties */
	var x;
	var y;
	var cell;
	if (e.pageX != undefined && e.pageY != undefined) {
		x = e.pageX;
		y = e.pageY;
	}
	else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	x -= canvas.offsetLeft;
	y -= canvas.offsetTop;
	x = Math.min(x, widthCells * 10) / 10;
	y = Math.min(y, heightCells * 10) / 10;
	
	cell = [Math.floor(x), Math.floor(y)];
	return cell;
}
//fill in cell
function colorCell(x, y, color) {
	ctx.fillStyle = color;
	ctx.fillRect (x * 10, y * 10, 10, 10);
}