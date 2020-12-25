console.log(Matter);
const { Engine, Render, World, Bodies, Runner, MouseConstraint, Mouse } = Matter;
// Engine - transition from a current state of our entire world into some new state
// Render - draw all the stuff on the  screen
// Runner - coordinates updates all the states between the engine and the world
// Bodies - collection of the the different shapes
// MouseConstraint - Mouse input
const engine = Engine.create();
const { world } = engine;

const cells = 3
const height = 600;
const width = 600;
const render = Render.create({
	// Inside of here I want to tell the render where I want to show my representation of everything inside of my HTML doc
	// Element is doc.body || So "go to render, the representation of world iside of doc.body"
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

const grid = Array(cells).fill(null).map(() => Array(cells).fill(false)) //.fill uzupelnia wszystkie elementy w tablicy zaczynajac od indexu 0
//Tworzy tablice od dlugosci cells i kazdy element po kolei mapuje jako nowa tablica o dlugosci cells i jej kazdy element ma wartosc false

const verticals = Array(cells).fill(null).map(() => Array(cells - 1).fill(false))
const horizontals = Array(cells - 1).fill(null).map(()=> Array(cells).fill(false))
