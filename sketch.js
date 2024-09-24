// RUN THIS LINE TO PUT THE FRAMES BACK TOGETHER
// ffmpeg -r 5 -f image2 -s 794x1121 -i frame_%04d.png -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -vcodec libx264 -crf 25 -pix_fmt yuv420p animation.mp4
// (when in the same directory as the output images)

let totalFrames = 150; // Total number of frames to capture
let currentFrame = 0;

var color2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop(); // Only draw once
  noStroke(); // Remove border from circles

  // Generate a random colour for the second layer
  color2 = color(random(255), random(255), random(255));
}

function draw() {
  background(255); // Set background to white
  let gridSize = 5; // Size of the grid cells for the first layer
  let circleSize; // Variable to store the size of each circle
  let noiseZoom = 0.002;
  let time = frameCount * 0.05; // Time variable to animate noise

  let black = color(58, 56, 56);
  let color1 = color(135, 56, 45);
  // let color2 = color(136, 8, 8);

  const marginX = 10;
  const marginY = 10;

  // First layer of circles
  for (let y = marginY; y < height - marginY; y += gridSize) {
    for (let x = marginX; x < width - marginX; x += gridSize) {
      // First layer
      let noiseVal = noise((x + 0) * noiseZoom, (y + 0) * noiseZoom, time); // Offset noise to differentiate from first layer
      noiseVal = transformNoise(noiseVal);

      circleSize = map(noiseVal, 0, 1, 0, gridSize);
      noFill();
      stroke(black);
      ellipse(x, y, circleSize, circleSize);

      // Second layer
      noiseVal = noise(x * noiseZoom, y * noiseZoom);
    }
  }

  // Second layer of circles
  for (let y = marginY; y < height - marginY; y += gridSize) {
    for (let x = marginX; x < width - marginX; x += gridSize) {
      let noiseVal = noise(x * noiseZoom, y * noiseZoom, time + 0.1);
      let noiseVal2 = transformNoise(noiseVal);

      circleSize = map(noiseVal2, 0, 1, 0, gridSize);

      fill(color2);
      stroke(black);
      ellipse(x + gridSize / 2, y + gridSize / 2, circleSize, circleSize);
    }
  }

  // Save the current frame as an image
  // saveFrame();

  console.log("Frame " + currentFrame + " saved");

  // Stop the loop when the desired number of frames is reached
  if (currentFrame >= totalFrames) {
    noLoop();
  }

  currentFrame++;
}

function saveFrame() {
  let frameName = nf(currentFrame, 4); // Name the frame with leading zeros
  saveCanvas("frame_" + frameName, "png"); // Save the frame as a PNG
}

function transformNoise(x, midPoint) {
  const xLow = 0.05;
  const curveLength = 0.05;

  // What range are we extracting?
  if (!midPoint) midPoint = 0.4;

  // We want our curve to start at 'start'
  // It should then dip down until it gets to dipStop
  // Then it should sit at value 0
  // At dipStart it should then curve upwards again
  // And stop at end at value 1
  const dipStop = midPoint - xLow / 2;
  const start = dipStop - curveLength;
  const dipStart = dipStop + xLow / 2;
  const end = dipStart + curveLength;

  var y;

  if (x >= 0 && x < start) {
    y = 1;
  } else if (x >= start && x <= dipStop) {
    y = mapCos(x, start, dipStop, 0, 1);
  } else if (x > dipStop && x < dipStart) {
    y = 0;
  } else if (x > dipStart && x <= end) {
    y = 1 - mapCos(x, dipStart, end, 0, 1);
  } else {
    y = 1;
  }

  return 1 - y;
}

function mapCos(x, xMin, xMax, yMin, yMax) {
  let inputX = map(x, xMin, xMax, 0, PI);
  let outputY = cos(inputX);
  let y = map(outputY, -1, 1, 0, 1);
  return y;
}
