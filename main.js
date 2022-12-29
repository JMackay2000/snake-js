const canvasEl = document.getElementById("snakeCanvas");
const scoreEl = document.getElementById("score");
const scoreListEl = document.getElementById("scoreList");
const gameOverEl = document.getElementById("gameOver");
const gameOverlayEl = document.getElementById("gameOverlay");
const ctx = canvasEl.getContext("2d");

const canvasWidth = canvasEl.getBoundingClientRect().width;
const canvasHeight = canvasEl.getBoundingClientRect().height;

//system
let running = false;
const fps = 10;

const backgroundColour = "black";
const textColour = "white";
const appleColour = "red";
const snakeColour = "green";

//entity (apple/snake) width or height
const eWidth = 20;
const eHeight = 20;

const gridWidth = Math.floor(canvasWidth / eWidth);
const gridHeight = Math.floor(canvasHeight / eHeight);

let score = 0;
let prevScores = [];

const apple = {
    x: 0,
    y: 0,
    init: function () {
        this.changePosition();
    },
    changePosition: function () {
        this.x = Math.floor((Math.random() * gridWidth));
        this.y = Math.floor((Math.random() * gridHeight));
    },
    render: function () {
        ctx.fillStyle = appleColour;
        ctx.fillRect(this.x * eWidth, this.y * eHeight, eWidth, eHeight);
    },
    getPosition: function () {
        return { x: this.x, y: this.y };
    },
}

const snake = {
    dir: "idle", // idle, up, down, left, right
    body: [],
    init: function () {
        this.body = [{
            x: gridWidth / 2,
            y: gridHeight / 2
        }];
        this.dir = "idle";
    },
    move: function (e) {
        if (e.key === "w" && this.dir !== "down") {
            this.dir = "up";
        } else if (e.key === "s" && this.dir !== "up") {
            this.dir = "down";
        } else if (e.key === "a" && this.dir !== "right") {
            this.dir = "left";
        } else if (e.key === "d" && this.dir !== "left") {
            this.dir = "right";
        }
    },
    update: function () {
        const headX = this.dir === "left" ? -1 : this.dir === "right" ? 1 : 0;
        const headY = this.dir === "up" ? -1 : this.dir === "down" ? 1 : 0;
        let lastSeg;
        for (let i = 0; i < this.body.length; i++) {
            if (i === 0) {
                //move head
                lastSeg = { ...this.body[i] };
                this.body[i].x += headX;
                this.body[i].y += headY;
                if ((this.body[i].x < 0 || this.body[i].x > gridWidth)
                    || (this.body[i].y < 0 || this.body[i].y > gridHeight)) {
                    stopGame();
                }
            } else {
                let temp = { ...this.body[i] };
                //check if this position overlaps with the head of the snake
                // if it does, end game
                this.body[i] = lastSeg;
                if (intersects(this.body[i], this.body[0])) stopGame();
                lastSeg = temp;
            }
            if (intersects(this.body[i], apple.getPosition())) {
                score++;
                this.addSegment();
                apple.changePosition();
            }
        }
    },
    render: function () {
        ctx.fillStyle = snakeColour;
        for (let i = 0; i < this.body.length; i++) {
            ctx.fillRect(this.body[i].x * eWidth, this.body[i].y * eHeight, eWidth, eHeight)
        }
    },
    addSegment: function () {
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
    },
}

function startGame() {
    snake.init();
    apple.init();
    score = 0;
    gameOverlayEl.style.display = "none";
}

function stopGame() {
    running = false;
    prevScores.push(score);
    prevScores = prevScores.sort((a, b) => b - a).slice(0, 10);
    const scoreLIEls = [];
    prevScores.forEach(score => {
        const liEl = document.createElement("LI");
        liEl.textContent = score;
        scoreLIEls.push(liEl)
    });
    scoreListEl.replaceChildren(...scoreLIEls)
    if (score > 0) {
        gameOverEl.textContent = "Game Over! You scored " + score + " points";
    }
    gameOverlayEl.style.display = "block";
}

document.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "space") {
        if (!running) {
            startGame();
            running = true;
        } else {
            stopGame();
            running = false;
        }
    } else {
        snake.move(e);
    }
})

setInterval(mainLoop, 1000 / fps);

function mainLoop() {
    clearScreen();
    if (running) {
        snake.update();
        apple.render();
        snake.render();
    }
    scoreEl.textContent = `${score} points`
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
