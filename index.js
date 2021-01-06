console.log(Matter);
const { Engine, Render, World, Bodies, Runner, MouseConstraint, Mouse } = Matter;
// Engine - transition from a current state of our entire world into some new state
// Render - draw all the stuff on the  screen
// Runner - coordinates updates all the states between the engine and the world
// Bodies - collection of the the different shapes
// MouseConstraint - Mouse input
const engine = Engine.create();
const { world } = engine;

const cells = 3;
const height = 600;
const width = 600;
const render = Render.create({
	// Inside of here I want to tell the render where I want to show my representation of everything inside of my HTML doc
	// Element is doc.body || So "go to render, the representation of world inside of doc.body"
	element : document.body,
	engine  : engine,
	options : {
		wireframes : false,
		width,
		height
	}
});

Render.run(render);
Runner.run(Runner.create(), engine);

//Walls
const walls = [
	Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }), //Top wall
	Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }), //Bottom wall
	Bodies.rectangle(0, height / 2, height, 40, { isStatic: true, angle: 1.5707963268 }),
	Bodies.rectangle(width, height / 2, height, 40, { isStatic: true, angle: 1.5707963268 })
];
World.add(world, walls);

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[ array[i], array[j] ] = [ array[j], array[i] ];
	}
	return array;
}

const grid = Array(cells).fill(null).map(() => Array(cells).fill(false)); //.fill uzupelnia wszystkie elementy w tablicy zaczynajac od indexu 0
//Tworzy tablice od dlugosci cells i kazdy element po kolei mapuje jako nowa tablica o dlugosci cells i jej kazdy element ma wartosc false

const verticals = Array(cells).fill(null).map(() => Array(cells - 1).fill(false));
const horizontals = Array(cells - 1).fill(null).map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepTroughtCell = (row, column) => {
	//If i have visited the cell at [row, column] then return
	if (grid[row][column] === true) {
		return;
	}
	//Mark this cell as being visited
	grid[row][column] = true;
	//Assemble randomly-ordered list of neighbours
	let neighbours = shuffle([
		[ row - 1, column, 'up' ], //check up
		[ row + 1, column, 'down' ], //check down
		[ row, column - 1, 'left' ], //check left
		[ row, column + 1, 'right' ] //check right
	]);
	console.log(neighbours);

	//For each neighbour....
	for(let neighbour of neighbours){
		const [nextRow, nextColumn, direction] = neighbour
		//Check if that neighbour is out of bonds
		if(nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells){
			continue;
		}
		//If I have visited that neighbour, continue to the next neighbour
		if(grid[nextRow][nextColumn] === true){
			continue;
		}
		//Remove a wall from either horizontals or verticals
		//I have to decide where i go

	}


};

stepTroughtCell(startRow, startColumn);
