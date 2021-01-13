// console.log(Matter);
const { Engine, Render, World, Bodies, Runner, MouseConstraint, Mouse, Body, Events } = Matter;
// Engine - transition from a current state of our entire world into some new state
// Render - draw all the stuff on the  screen
// Runner - coordinates updates all the states between the engine and the world
// Bodies - collection of the the different shapes
// MouseConstraint - Mouse input
const engine = Engine.create();
engine.world.gravity.y = 0;
engine.world.gravity.x = 0;
const { world } = engine;

const cellsHorizontal = 14;
const cellsVertical = 13;
const height = window.innerHeight - 4;
const width = window.innerWidth - 2;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const render = Render.create({
	// Inside of here I want to tell the render where I want to show my representation of everything inside of my HTML doc
	// Element is doc.body || So "go to render, the representation of world inside of doc.body"
	element : document.body,
	engine  : engine,
	options : {
		wireframes : true,
		width,
		height
	}
});

Render.run(render);
Runner.run(Runner.create(), engine);

//Walls
const walls = [
	Bodies.rectangle(width / 2, 0, width, 3, { isStatic: true }), //Top wall
	Bodies.rectangle(width / 2, height, width, 3, { isStatic: true }), //Bottom wall
	Bodies.rectangle(0, height / 2, height, 3, { isStatic: true, angle: 1.5707963268 }),
	Bodies.rectangle(width, height / 2, height, 3, { isStatic: true, angle: 1.5707963268 })
];
World.add(world, walls);

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[ array[i], array[j] ] = [ array[j], array[i] ];
	}
	return array;
}

const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false)); //.fill uzupelnia wszystkie elementy w tablicy zaczynajac od indexu 0
//Tworzy tablice od dlugosci cells i kazdy element po kolei mapuje jako nowa tablica o dlugosci cells i jej kazdy element ma wartosc false

const verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal - 1).fill(false));
const horizontals = Array(cellsVertical - 1).fill(null).map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepThroughCell = (row, column) => {
	//If i have visited the cell at [row, column] then return
	if (grid[row][column]) {
		return;
	}
	//Mark this cell as being visited
	grid[row][column] = true;
	//Assemble randomly-ordered list of neighbours
	const neighbours = shuffle([
		[ row - 1, column, 'up' ], //check up
		[ row + 1, column, 'down' ], //check down
		[ row, column - 1, 'left' ], //check left
		[ row, column + 1, 'right' ] //check right
	]);
	//For each neighbour....
	for (let neighbour of neighbours) {
		const [ nextRow, nextColumn, direction ] = neighbour;

		//Check if that neighbour is out of bonds
		if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
			continue;
		}
		//If I have visited that neighbour, continue to the next neighbour
		if (grid[nextRow][nextColumn]) {
			continue;
		}
		//Remove a wall from either horizontals or verticals/
		if (direction === 'left') {
			verticals[row][column - 1] = true;
		} else if (direction === 'right') {
			verticals[row][column] = true;
		} else if (direction === 'up') {
			horizontals[row - 1][column] = true;
		} else if (direction === 'down') {
			horizontals[row][column] = true;
		}
		stepThroughCell(nextRow, nextColumn);
	}
	//I have to decide where i go
};

stepThroughCell(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open === true) {
			//Jesli jest to otwarty segment (nie ma sciany) to nie rob nic
			return;
		}
		const wall = Bodies.rectangle(
			//1st and 2nd args are x/y of the center of rectangle and 3rd & 4th are width and height
			columnIndex * unitLengthX + unitLengthX / 2,
			rowIndex * unitLengthY + unitLengthY,
			unitLengthX,
			5,
			{
				isStatic : true,
				label    : 'wall'
			}
		);
		World.add(world, wall);
	});
});

verticals.forEach((row, rowIndex) => {
	row.forEach((open, columnIndex) => {
		if (open === true) {
			return;
		}
		const wall = Bodies.rectangle(
			columnIndex * unitLengthX + unitLengthX,
			rowIndex * unitLengthY + unitLengthY / 2,
			5,
			unitLengthY,
			{
				isStatic : true,
				label    : 'wall'
			}
		);
		World.add(world, wall);
	});
});

//Goal
const meta = Bodies.rectangle(width - unitLengthX / 2, height - unitLengthY / 2, unitLengthX / 2, unitLengthY / 2, {
	isStatic: true,
	label: 'goal'
});
World.add(world, meta);

//Start
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, { label: 'ball' });

World.add(world, ball);

//Ball movement
document.addEventListener('keydown', (event) => {
	const { x, y } = ball.velocity;
	if (event.key === 'w') {
		if (cellsVertical > 15) {
			Body.setVelocity(ball, { x, y: y - 2 });
		} else {
			Body.setVelocity(ball, { x, y: y - 10 });
		}
	}
	if (event.key === 's') {
		if (cellsVertical > 15) {
			Body.setVelocity(ball, { x, y: y + 2 });
		} else {
			Body.setVelocity(ball, { x, y: y + 10 });
		}
	}
	if (event.key === 'a') {
		if (cellsVertical > 15) {
			Body.setVelocity(ball, { x: x - 2, y });
		} else {
			Body.setVelocity(ball, { x: x - 10, y });
		}
	}
	if (event.key === 'd') {
		if (cellsVertical > 15) {
			Body.setVelocity(ball, { x: x + 2, y });
		} else {
			Body.setVelocity(ball, { x: x + 10, y });
		}
	}
});

//Win condition
Events.on(engine, 'collisionStart', (event) => {
	event.pairs.forEach((collision) => {
		const labels = [ 'ball', 'goal' ];
		if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
			world.gravity.y = 1;
			world.bodies.forEach((body) => {
				if (body.label === 'wall') {
					Body.setStatic(body, false);
				}
			});
		}
	});
});
