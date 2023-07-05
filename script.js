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
            this.x = Math.floor(Math.random() * this.game.width);
            this.y = Math.floor(Math.random() * this.game.height);
            this.x = Math.random() * this.game.width;
            this.y = Math.random() * this.game.height;
            this.image = document.getElementById("asteroid");
            this.spriteWidth = 150;
            this.spriteHeight = 155;
            this.speed = 1;
        }
        draw(context) {
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.stroke();
            context.drawImage(this.image, this.x - this.spriteWidth * 0.5, 
            this.y - this.spriteHeight * 0.5, this.spriteWidth, this.spriteHeight);
        }
        update() {
            this.x += this.speed;
        }
    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.asteroidPool = [];
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
        render(context, deltaTime) {
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
        console.log(deltaTime);
        /* a nice feature of requestAnimationFrame() is that it automatically generates "timestamps".
         a timestamp is the num. of milliseconds that passed since the first loop of requestAnimationFrame
        was triggered. */

        requestAnimationFrame(animate);
    }
    // initially 0. Without it, we get NaN as deltaTime's initial value.
    animate(0);
});

