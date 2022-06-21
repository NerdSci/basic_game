let canvas = document.querySelector("#canvas");
let level = document.querySelector("#level");
let score = document.querySelector("#score");
let lives = document.querySelector("#lives");
canvas.focus();

let ctx = canvas.getContext("2d");

let start, previousTimeStamp;
let collided = false;

let width = canvas.width;
let height = canvas.height;
let num_enemies = 5;
let game_over = true;

ctx.fillStyle = "cyan";

class Game {
    constructor(lives, score, level) {
        this.lives = lives;
        this.score = score;
        this.level = level;
    }
}

class User {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }
}

class Enemie {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    move() {
        if (this.speed == 0) {
            this.y += 1;
        }
        this.y += this.speed;
    }
}

function generateEnemie() {
    let x = Math.floor(Math.random() * (width - 20));
    let speed = Math.floor(Math.random() * 5);
    let y = 0;
    let w = 20;
    let h = 20;
    return new Enemie(x, y, w, h, speed);
}

let enemies = [];
for (i = 0; i < num_enemies; i++) {
    enemies.push(generateEnemie());
}

let user = new User(0, height - 21, 20, 20, 6);

function drawGame(interval) {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "red";
    enemies.forEach((enemie) => {
        if (enemie.y + enemie.height > height + enemie.height) {
            enemie.y = 0;
        }

        ctx.fillRect(enemie.x, enemie.y, enemie.width, enemie.height);
        enemie.move();
    });

    ctx.fillStyle = "cyan";

    ctx.fillRect(user.x, user.y, user.width, user.height);
    collisionDetection(enemies, user);
    if (!collided) {} else if (collided && game.lives > 0) {
        enemies.forEach((enemy) => {
            enemy.y = 0;
        });
        collided = false;
    } else {
        game_over = true;
        gameOver();
    }
    if (!game_over) {
        setTimeout(() => {
            requestAnimationFrame(drawGame);
        });
    }
}

function moveUser(e) {
    if (e.keyCode === 37) {
        if (!(user.x < 0)) {
            user.x -= user.speed;
        }
    } else if (e.keyCode === 39) {
        if (!(user.x + user.width > width)) {
            user.x += user.speed;
        }
    }

    if (e.keyCode === 38) {
        if (!(user.y < 0)) {
            user.y -= user.speed;
        }
    } else if (e.keyCode === 40) {
        if (!(user.y + user.height > height)) {
            user.y += user.speed;
        }
    }
}

function collisionDetection(enemies, user) {
    enemies.forEach((enemy) => {
        if (!(user.x > enemy.x + enemy.width || user.x + user.width < enemy.x)) {
            if (
                enemy.y + enemy.height > user.y &&
                enemy.y + enemy.height < user.y + user.height
            ) {
                collided = true;
                game.lives -= 1;
                lives.innerHTML = game.lives;
                console.log("collision", game.lives);
            }
        }
    });
}

function startGame() {
    window.removeEventListener("keydown", newGame);
    playGameAudio();
    game_over = false;
    game.level = 1;
    game.score = 0;
    game.lives = 3;
    num_enemies = 5;
    enemies = [];
    for (i = 0; i < num_enemies; i++) {
        enemies.push(generateEnemie());
    }
    lives.innerHTML = game.lives;
    score.innerHTML = game.score;
    level.innerHTML = game.level;

    canvas.addEventListener("keydown", (e) => {
        moveUser(e);
    });
    requestAnimationFrame(drawGame);
}

function gameOver() {
    let go_message = `Game Over, final score ${game.score}`;
    ctx.fillText(go_message, width / 2 - 40, height / 2);
    ctx.fillText("Press ENTER to Restart game", width / 2 - 40, height / 2 + 20);
    audio.load();
    audio.pause();
    audio1.load();
    audio1.play();
    window.addEventListener("keydown", newGame);
}

function beforeStart() {
    ctx.fillText("Press ENTER To Start", width / 2 - 40, height / 2);
}

function newGame(e) {
    if (e.keyCode === 13) {
        startGame();
    }
}

game = new Game(3, 0, 1);

setInterval(() => {
    if (!game_over) {
        enemies.push(generateEnemie());
        num_enemies += 1;
        game.level += 1;
        level.innerHTML = game.level;
    }
}, 5000);

setInterval(() => {
    if (!game_over) {
        game.score += 1;
        score.innerHTML = game.score;
    }
}, 1000);

window.addEventListener("keydown", newGame);

// Audio staff

let audio = document.querySelector("#audio");
let audio1 = document.querySelector("#audio1");

audio.loop = true;
audio1.loop = true;

function playGameAudio() {
    audio1.pause();

    audio.play();
}

beforeStart();