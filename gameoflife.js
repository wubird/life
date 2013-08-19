var canvasWidth = 500;
var canvasHeight = 500;
var widthCells = canvasWidth / 10;
var heightCells = canvasHeight / 10;
var matrix = new Array();
var canvas
var bg
var ctx;
var ctxBg;
var running;
var reset;

function init() {

	canvas = document.getElementById('canvas');
	bg = document.getElementById('bg');

	bg.width = canvasWidth;
	bg.height = canvasHeight;
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	canvas.addEventListener("click", mouseClicked, false);
	ctx = document.getElementById('canvas').getContext('2d');
	ctxBg = document.getElementById('bg').getContext('2d');
	drawBoard();
	    
	//fill matrix with 0s	
    for (var i = 0; i < 500; i++) {
        var row = new Array();
        for (var j = 0; j < 500; j++) {
            row[j] = 0;
        }
        matrix[i] = row;
    }
	
	//put in a cool pattern to start
	matrix[26][17] = 1;
	matrix[27][17] = 1;
	matrix[27][15] = 1;
	matrix[29][16] = 1;
	matrix[30][17] = 1;
	matrix[31][17] = 1;
	matrix[32][17] = 1;

	colorCell(26, 17, "green");
	colorCell(27, 17, "green");
	colorCell(27, 15, "green");
	colorCell(29, 16, "green");
	colorCell(30, 17, "green");
	colorCell(31, 17, "green");
	colorCell(32, 17, "green");
}

//draw grid
function drawBoard() {
	ctxBg.beginPath();		
	//vertical lines
	for (var i = 0; i < widthCells + 1; i++) {
		ctxBg.moveTo(i * 10, 0);
		ctxBg.lineTo(i * 10, heightCells * 100);				
	}

	//horizontal lines
	for (var i = 0; i < heightCells + 1; i++) {
		ctxBg.moveTo(0, i * 10);
		ctxBg.lineTo(widthCells * 100, i * 10);				
	}
	ctxBg.closePath();
	ctxBg.strokeStyle = "#ccc";
	ctxBg.stroke();		
}

//on mouse click, if cell is white make green and set to 1, else vice versa
function mouseClicked(e) {
	var cell = getMousePosition(e);
	if (running) {
		clearInterval(running);
	}
	fullReset = false;
	if (matrix[cell[0]][cell[1]] == 0 ) {
		colorCell(cell[0], cell[1], "green");
		matrix[cell[0]][cell[1]] = 1;
	} else {
		clearCell(cell[0], cell[1]);
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
function getNextGen(){
	fullReset = false;
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
					clearCell(i, j);
                } else if (neighbors > 3) {
                    newMatrix[i][j] = 0;
					clearCell(i, j);
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
	ctx.globalAlpha=1.0;
	ctx.fillStyle = color;
	ctx.fillRect (x * 10, y * 10, 10, 10);
}

//clear cell
function clearCell(x, y) {
	ctx.clearRect (x * 10, y * 10, 10, 10);
	if (!fullReset) {
		ctx.globalAlpha=0.2;
		ctx.fillStyle = "green";
		ctx.fillRect (x * 10, y * 10, 10, 10);
	}
}

function run() {

	running = setInterval(function() {getNextGen()}, 500);

}

//reset board
function reset() {
	fullReset = true;
	clearInterval(running);
	for (var x = 0; x < 50; x++) {
		for (var y = 0; y < 50; y++) {
			matrix[x][y] = 0;
			clearCell(x, y);
		}
	}
}