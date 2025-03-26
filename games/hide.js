export function updateAI(ai,ball) {
    // If the ball is below the center of the AI paddle, move the AI paddle down
    if (ai.y + ai.height / 2 < ball.y) ai.y += ai.dy;
    // If the ball is above the center of the AI paddle, move the AI paddle up
    if (ai.y + ai.height / 2 > ball.y) ai.y -= ai.dy;
}
