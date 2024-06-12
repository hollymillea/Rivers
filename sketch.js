function setup() {
  createCanvas(794, 1121);
  noLoop(); // Only draw once
  noStroke(); // Remove border from circles
}

function draw() {
  background(255); // Set background to white
  let gridSize = 12; // Size of the grid cells for the first layer
  let circleSize; // Variable to store the size of each circle
  let noiseZoom = 0.002;
   
  let black = color(0, 0, 0);
  let color2 = color(28, 111, 121);
  let color1 = color(64, 121, 85);
  
  // First layer of circles
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      let noiseVal = noise((x + 1000) * noiseZoom, (y + 1000) * noiseZoom); // Offset noise to differentiate from first layer
      noiseVal = transformNoise(noiseVal);
      
      circleSize = map(noiseVal, 0, 1, 2, gridSize);
      
      // Blue empty circle
      fill(color2);
      stroke(black);
      ellipse(x, y, circleSize, circleSize);
    }
  }

  // Second layer of circles
  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      let noiseVal = noise(x * noiseZoom, y * noiseZoom);
      let noiseVal2 = transformNoise(noiseVal);
      
      circleSize = map(noiseVal2, 0, 1, 2, gridSize);
      
      // Red filled circle
      fill(color1);
      stroke(black);
      ellipse(x + gridSize / 2, y + gridSize / 2, circleSize, circleSize);
    }
  }
  
  noLoop();
}

function transformNoise(x) {
  // How long should the flat bits at the top be?
  const xHigh = 0.3;
  
  // How long should the flat bits at the bottom be?
  const xLow = 0;
  
  // What range are we extracting?
  const midPoint = 0.5;
  
  // We want our curve to start at 'start'
  // It should then dip down until it gets to dipStop
  // Then it should sit at value 0
  // At dipStart it should then curve upwards again
  // And stop at end at value 1
  const start = xHigh;
  const dipStop = midPoint - (xLow / 2);
  const dipStart = dipStop + (xLow / 2);
  const end = dipStart + (dipStop - start);
  
  var y;
  
  if (x >= 0 && x < xHigh) {
    y = 1;
  }
  else if (x >= xHigh && x <= dipStop) {
    // Cosine graph starting at xHigh, ending at dipStop
    y = mapCos(x, xHigh, dipStop, 0, 1);
  }
  else if (x > dipStop && x < dipStart) {
    y = 0;
  }
  else if (x > dipStart && x <= end) {
    // Cos slope going up
    y = 1 - mapCos(x, dipStart, end, 0, 1);
  }
  else {
    y = 1;
  }
  
  return 1 - y;
}

function mapCos(x, xMin, xMax, yMin, yMax) {
  // The downhill bit of cos(x) goes between x = 0 and x = pi
  let inputX = map(x, xMin, xMax, 0, PI);
  // let inputX = (x - xMin) * (2*PI / (xMax - xMin));
  
  let outputY = cos(inputX);
  
  // Map y between the values we want
  let y = map(outputY, -1, 1, 0, 1);
  
  return y;
}
