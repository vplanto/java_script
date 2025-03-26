const radius = 100;

const canvas = document.getElementById("canvas");
// get the HTML element with the id "canvas".

const ctx = canvas.getContext("2d");
// get the 2D rendering context for the canvas.

ctx.rect(0, 0, 2 * radius, 2 * radius);
// create a rectangle path. The rectangle's top-left corner is at (0,0) and it has a width and height of 2*radius pixels.

ctx.stroke();
// draw the outline of the current path (the rectangle) using the current stroke style.



let p = calcPI();

// Set the font properties
ctx.font = '20px Arial';
ctx.fillStyle = 'black';
// Add the text to the canvas
ctx.fillText("pi = " + p, 50, 50);

function calcPI() {
  const ctx = canvas.getContext("2d");
  let side = radius * 2;

  let totalPoints = 10000000;
  let circlePoints = 0;

  for (let i = 0; i < totalPoints; i++) {
    let x = Math.random() * (side);
    let y = Math.random() * (side);

    let d = Math.sqrt((x - radius) ** 2 + (y - radius) ** 2);

    if (d <= radius) {
      circlePoints++;
      ctx.fillStyle = "blue";
    }
    else {
      ctx.fillStyle = "red";
    }

    ctx.fillRect(x, y, 1, 1);
  }

  // area_square = 4r²
  // area_circle = πr²
  // => π = 4 * area_circle / area_square

  return (4 * circlePoints) / totalPoints;
}
