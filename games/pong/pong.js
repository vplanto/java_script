//import { updateAI } from './hide.js';

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 600;
canvas.height = 400;

var player = { x: 0, y: 0, width: 20, height: 100, dy: 2 };
var ai = { x: 580, y: 0, width: 20, height: 100, dy: 1 };
var ball = { x: 300, y: 200, width: 20, height: 20, dx: 2, dy: 2 };

function updateAI(ai,ball) {
    // If the ball is below the center of the AI paddle, move the AI paddle down
    if (ai.y + ai.height / 2 < ball.y) ai.y += ai.dy;
    // If the ball is above the center of the AI paddle, move the AI paddle up
    if (ai.y + ai.height / 2 > ball.y) ai.y -= ai.dy;
}

function update() {
    // Prevents the player from moving above the top edge of the canvas
    if (player.y < 0) player.y = 0;
    // Prevents the player from moving below the bottom edge of the canvas
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

    updateAI(ai, ball); // Updates the AI's position
    

    // Updates the x position of the ball based on its x velocity
    ball.x += ball.dx;
    // Updates the y position of the ball based on its y velocity
    ball.y += ball.dy;

    // If the ball hits the top or bottom edge of the canvas, reverse its y velocity
    if (ball.y < 0 || ball.y + ball.height > canvas.height) ball.dy *= -1;

    // If the ball hits the player's paddle, reverse its x velocity
    if (ball.x < player.x + player.width && ball.y > player.y && ball.y < player.y + player.height) ball.dx *= -1;

    // If the ball hits the AI's paddle, reverse its x velocity
    if (ball.x + ball.width > ai.x && ball.y > ai.y && ball.y < ai.y + ai.height) ball.dx *= -1;
}


function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function draw() {
    drawRect(0, 0, canvas.width, canvas.height, 'black');
    drawRect(player.x, player.y, player.width, player.height, 'white');
    drawRect(ai.x, ai.y, ai.width, ai.height, 'white');
    drawRect(ball.x, ball.y, ball.width, ball.height, 'white');
}

function loop() {
    update();
    // This line calls a function named 'draw'. This function is expected to handle rendering or redrawing of elements on the screen.
    draw();

    //if (player.y < ball.y) player.y += player.dy;
    //if (player.y > ball.y) player.y -= player.dy;

    // This line requests the browser to call the 'loop' function again when it's time for the next frame to be drawn. This creates a loop that keeps running, updating the state of the game and redrawing the elements on the screen.
    requestAnimationFrame(loop);
}


loop();

window.addEventListener('mousemove', function(event) {
    player.y = event.clientY;
});
