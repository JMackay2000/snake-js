const canvasEl = document.getElementById("snakeCanvas");
const ctx = canvasEl.getContext("2d");

const canvasWidth = canvasEl.clientWidth;
const canvasHeight = canvasEl.clientHeight;

//system
let running = false;
const fps = 5;

const backgroundColour = "black";
const textColour = "white";
const appleColour = "red";
const snakeColour = "green";

//entity (apple/snake) width or height
const eWidth = 20;
const eHeight = 20;

class Apple {
    x = 0;
    y = 0;

    constructor() {
        this.changePosition();
    }

    changePosition() {
        this.x = Math.floor(Math.random() * canvasWidth);
        this.y = Math.floor(Math.random() * canvasHeight);
    }

    render() {
        ctx.fillStyle = appleColour;
        ctx.fillRect(this.x, this.y, eWidth, eHeight);
    }
}

class Snake {
    moveX = 0; //0 = idle, 1 = left, 2 = right
    moveY = 0; //0 = idle, 1 = up, 2 = down
    headX = 0;
    headY = 0;
    snake = [];

    constructor() {
        this.headX = Math.floor(canvasWidth / 2 / eWidth);
        this.headY = Math.floor(canvasHeight / 2 / eHeight);
        this.snake = [{ x: this.headX, y: this.headY }];
    }

    move(e) {
        console.log(e.key);
        if (e.key === "w") {
            this.moveY = -1;
            this.moveX = 0;
        } else if (e.key === "s") {
            this.moveY = 1;
            this.moveX = 0;
        } else if (e.key === "a") {
            this.moveX = -1;
            this.moveY = 0;
        } else if (e.key === "d") {
            this.moveX = 1;
            this.moveY = 0;
        }

    }

    update() {
        this.headX += this.moveX;
        this.headY += this.moveY;
        for (let i = 0; i < 1; i++) {
            //head, move normally
            this.snake[i].x = this.headX;
            this.snake[i].y = this.headY;
        }
    }

    render() {
        ctx.fillStyle = snakeColour;
        for (let i = 0; i < this.snake.length; i++) {
            ctx.fillRect(this.snake[i].x * eWidth, this.snake[i].y * eHeight, eWidth, eHeight)
        }
    }
}

const apple = new Apple();
const snake = new Snake();

document.addEventListener("keydown", (e) => {
    snake.move(e);
})

setInterval(mainLoop, 1000 / fps);

function mainLoop() {
    running = true;
    clearScreen();
    apple.render();
    snake.update();
    snake.render();
}

function clearScreen() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}
