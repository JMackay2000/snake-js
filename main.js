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

let score = 0;

class Apple {
    x = 0;
    y = 0;

    constructor() {
        this.changePosition();
    }

    changePosition() {
        this.x = Math.floor((Math.random() * canvasWidth) / eWidth);
        this.y = Math.floor((Math.random() * canvasHeight) / eHeight);
    }

    render() {
        ctx.fillStyle = appleColour;
        ctx.fillRect(this.x * eWidth, this.y * eHeight, eWidth, eHeight);
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }
}

class Snake {
    moveX = 0; //0 = idle, -1 = left, 1 = right
    moveY = 0; //0 = idle, -1 = up, 1 = down
    headX = 0;
    headY = 0;
    body = [];

    constructor() {
        this.headX = Math.floor(canvasWidth / 2 / eWidth);
        this.headY = Math.floor(canvasHeight / 2 / eHeight);
        this.body = [{ x: this.headX, y: this.headY }];
    }

    move(e) {
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
            this.body[i].x = this.headX;
            this.body[i].y = this.headY;
        }
    }

    render() {
        ctx.fillStyle = snakeColour;
        for (let i = 0; i < this.body.length; i++) {
            ctx.fillRect(this.body[i].x * eWidth, this.body[i].y * eHeight, eWidth, eHeight)
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
    snake.update();
    for (let i = 0; i < snake.body.length; i++) {
        if (intersects(snake.body[i], apple.getPosition())) {
            score += 1;
            apple.changePosition();
        }
    }
    apple.render();
    snake.render();
}

function intersects(obj1, obj2) {
    //check if obj1 intersects with obj2 with bbox collisions
    return ((obj1.x >= obj2.x) && (obj1.x <= obj2.x))
        && ((obj1.y >= obj2.y) && (obj1.y <= obj2.y));
}

function clearScreen() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}
