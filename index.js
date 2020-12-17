console.log(Matter);
const { Engine, Render, World, Bodies, Runner } = Matter;
// Engine - transition from a current state of our entire world into some new state
// Render - draw all the stuff on the  screen
// Runner - coordinates updates all the states between the engine and the world
// Bodies - collection of the the different shapes

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
	// Inside of here I want to tell the render where I want to show my representation of everything inside of my HTML doc
	// Element is doc.body || So "go to render, the representation of world iside of doc.body"
	element : document.body,
	engine  : engine,
	options : {
		width  : 800,
		height : 600
	}
});

Render.run(render);
Runner.run(Runner.create(), engine);

const shape = Bodies.rectangle(200, 200, 50, 50, {
	isStatic : true
});

World.add(world, shape);
