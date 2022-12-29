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
    dir = "idle"; // idle, up, down, left, right
    body = [];

    constructor() {
        this.body = [{
            x: Math.floor(canvasWidth / 2 / eWidth),
            y: Math.floor(canvasHeight / 2 / eHeight)
        }];
    }

    move(e) {
        if (e.key === "w" && this.dir !== "down") {
            this.dir = "up";
        } else if (e.key === "s" && this.dir !== "up") {
            this.dir = "down";
        } else if (e.key === "a" && this.dir !== "right") {
            this.dir = "left";
        } else if (e.key === "d" && this.dir !== "left") {
            this.dir = "right";
        } else if (e.key === " " || e.key === "space") {
            this.dir = "idle";
        }
    }

    update() {
        const headX = this.dir === "left" ? -1 : this.dir === "right" ? 1 : 0;
        const headY = this.dir === "up" ? -1 : this.dir === "down" ? 1 : 0;
        let lastSeg = { ...this.body[0] };
        for (let i = 0; i < this.body.length; i++) {
            if (i === 0) {
                this.body[i].x += headX;
                this.body[i].y += headY;
            } else {
                let temp = { ...this.body[i] };
                this.body[i] = lastSeg;
                lastSeg = temp;
            }
        }
    }

    render() {
        ctx.fillStyle = snakeColour;
        for (let i = 0; i < this.body.length; i++) {
            ctx.fillRect(this.body[i].x * eWidth, this.body[i].y * eHeight, eWidth, eHeight)
        }
    }

    addSegment() {
        let newSeg = { x: 0, y: 0 };
        const lastSeg = { ...this.body[this.body.length - 1] };
        if (this.dir === "up") {
            newSeg.x = lastSeg.x;
            newSeg.y = lastSeg.y + 1;
        } else if (this.dir === "down") {
            newSeg.x = lastSeg.x;
            newSeg.y = lastSeg.y - 1;
        } else if (this.dir === "left") {
            newSeg.x = lastSeg.x + 1;
            newSeg.y = lastSeg.y;
        } else if (this.dir === "right") {
            newSeg.x = lastSeg.x - 1;
            newSeg.y = lastSeg.y;
        }
        this.body.push(newSeg);
        console.log(JSON.stringify(this.body));
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
            snake.addSegment();
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
