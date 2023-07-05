// var canvas = document.getElementById("canvas1");
// var cxt = canvas.getContext("2d");
// canvas.width = 900;
// canvas.height = 600;

window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 800;

    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;

    class Asteroid {
        constructor(game) {
            this.game = game;
            this.radius = 75;
            this.x = -this.radius;
            // this.y = Math.floor(Math.random() * this.game.height);
            this.y = Math.random() * this.game.height;
            this.image = document.getElementById("asteroid");
            this.spriteWidth = 150;
            this.spriteHeight = 155;
            this.speed = Math.random() * 1.5 + 0.1;

            // asteroids in the pool are initially ready (free) to be used:
            this.free = true;

            this.angle = 0;
            this.va = Math.random() * 0.2 - 0.01;
        }
        draw(context) {
            // we draw only if asteroid is currently being used:
            if (!this.free) {
                // DRAW ARC:
                // context.beginPath();
                // context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                // context.stroke();

                /* save()/restore() are for rotation purposes. translate() and rotate() are additive,
                meaning calling them over & over adds up, we we use save() to reset back to a "safe state" */

                context.save();

                /* rotate() rotates the ENTIRE canvas, not individual objects, at coord (0, 0). 
                we redefine that rotation point using translate(), and set it as each obj's (x, y) */
                context.translate(this.x, this.y);
                context.rotate(this.angle);
                context.drawImage(this.image, 0 - this.spriteWidth * 0.5, 
                0 - this.spriteHeight * 0.5, this.spriteWidth, this.spriteHeight);
                context.restore();

                // context.drawImage(this.image, this.x - this.spriteWidth * 0.5, 
                // this.y - this.spriteHeight * 0.5, this.spriteWidth, this.spriteHeight);
            }
        }
        update() {
            this.angle += this.va;
            if (!this.free) {
                this.x += this.speed;
                if (this.x > this.game.width + this.radius) {
                    this.reset();
                }
            }
        }
        reset() {
            // if asteroid gets destroyed or moves off screen, we reset it to true, ready to be used again:
            this.x = -this.radius;
            this.free = true;
        }
        // we use this when pulling objects out of the pool, reseting to their initial start values:
        start() {
            this.free = false;
            this.y = Math.floor(Math.random() * this.game.height);
        }
    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.asteroidPool = [];
            // if we create too many, we waste memory:
            this.max = 10;
            this.asteroidTimer = 0;
            // we add one asteroid to the game every 1 second.
            this.asteroidInterval = 1000;
            // immediately calls this func. once a Game obj. is instanciated.
            this.createAsteroidPool();
        }
        createAsteroidPool() {
            for (let i = 0; i < this.max; i++) {
                this.asteroidPool.push(new Asteroid(this));
            }
        }
        /* searches for next available asteroid. If so, return it (stops function from running, so we don't
        get more than one object). Very smart:

        for lists containing hundreds of thousands of items, a good search tool is the "linked list" data structure
        */
        getElement() {
            for (let i = 0; i < this.asteroidPool.length; i++) {
                if (this.asteroidPool[i].free) return this.asteroidPool[i];
            }
        }
        render(context, deltaTime) {
            // periodically add asteroids:
            if (this.asteroidTimer > this.asteroidInterval) {
                // get free asteroid. This is a temporary "helper" variable:
                const asteroid = this.getElement();
                // that is, if there is actually an asteroid (aka: asteroidPool isn't empty!):
                if (asteroid) asteroid.start();
                this.asteroidTimer = 0;
            } else {
                this.asteroidTimer += deltaTime;
            }
            this.asteroidPool.forEach(asteroid => {
                asteroid.draw(context);
                asteroid.update();
            });
        }
    }

    const game = new Game(canvas.width, canvas.height);

    // this needs to be a "let" because we will be reassigning it a different value over and over
    let lastTime = 0;
    function animate(timeStamp) {
        // for every animation frame, we calculate: current timestamp - timestamp of previous animation frame:
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx, deltaTime);

        // my deltaTime is ~33.331 milliseconds, 1000 (milliseconds in a second) divided by 33.3 is 30.03.
        // so, my screen is running at 30 frames per second.
        /* a nice feature of requestAnimationFrame() is that it automatically generates "timestamps".
         a timestamp is the num. of milliseconds that passed since the first loop of requestAnimationFrame
        was triggered. */

        // logging s/thing while the animation loop runs is very expensive:
        //console.log(deltaTime);

        requestAnimationFrame(animate);
    }
    // initially 0. Without it, we get NaN as deltaTime's initial value.
    animate(0);
});

