console.log(Matter);
const { Engine, Render, World, Bodies, Runner, MouseConstraint, Mouse } = Matter;
// Engine - transition from a current state of our entire world into some new state
// Render - draw all the stuff on the  screen
// Runner - coordinates updates all the states between the engine and the world
// Bodies - collection of the the different shapes
// MouseConstraint - Mouse input
const engine = Engine.create();
const { world } = engine;
const render = Render.create({
	// Inside of here I want to tell the render where I want to show my representation of everything inside of my HTML doc
	// Element is doc.body || So "go to render, the representation of world iside of doc.body"
	element : document.body,
	engine  : engine,
	options : {
		wireframes: false,
		width  : document.body.clientWidth,
		height : 850
	}
});

Render.run(render);
Runner.run(Runner.create(), engine);

World.add(
	world,
	MouseConstraint.create(engine, {
		mouse : Mouse.create(render.canvas)
	})
);

//Walls
const walls = [
	Bodies.rectangle(document.body.clientWidth / 2, 0, document.body.clientWidth, 40, { isStatic: true }),
	Bodies.rectangle(document.body.clientWidth / 2, render.options.height, document.body.clientWidth, 40, {
		isStatic : true
	}),
	Bodies.rectangle(0, render.options.height / 2, render.options.height, 40, { isStatic: true, angle: 1.5707963268 }),
	Bodies.rectangle(document.body.clientWidth, render.options.height / 2, render.options.height, 40, {
		isStatic : true,
		angle    : 1.5707963268
	})
];
World.add(world, walls);

//Random shapes
for (let i = 0; i < 50; i++) {
	if(Math.random() > 0.5){
		World.add(
			world,
			Bodies.rectangle(Math.random() * render.options.width, Math.random() * render.options.height, 50, 50)
		);
	} else {
		World.add(world, Bodies.circle(Math.random() * render.options.width, Math.random() * render.options.height, 35, {render: {
			fillStyle: 'grey'
		}}))
	}
}
