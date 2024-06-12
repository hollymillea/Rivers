function setup() {
  createCanvas(794, 1121);
  noLoop(); // Only draw once
  noStroke(); // Remove border from circles
}

function draw() {
  background(255); // Set background to white
  let gridSize = 5; // Size of the grid cells for the first layer
  let circleSize; // Variable to store the size of each circle
  let noiseZoom = 0.001;
  let time = frameCount * 0.1; // Time variable to animate noise
   
  let black = color(58, 56, 56);
  let color1 = color(135, 56, 45);
  let color2 = color(231, 171, 99);

  const marginX = 50;
  const marginY = 80;
  
  // First layer of circles
  for (let y = marginY; y < (height - marginY); y += gridSize) {
    for (let x = marginX; x < (width - marginX); x += gridSize) {
      // First layer
      let noiseVal = noise((x + 100) * noiseZoom, (y + 0) * noiseZoom); // Offset noise to differentiate from first layer
      noiseVal = transformNoise(noiseVal, 0.50);
      
      circleSize = map(noiseVal, 0, 1, 0, gridSize);

    //   if (circleSize < 0.5) continue;

    //   fill(black);
      noFill();
      stroke(black);
      ellipse(x, y, circleSize, circleSize);

      // Second layer
      noiseVal = noise(x * noiseZoom, y * noiseZoom);
      
    }
  }

  // Second layer of circles
  for (let y = marginY; y < height-marginY; y += gridSize) {
    for (let x = marginX; x < width-marginX; x += gridSize) {
      let noiseVal = noise(x * noiseZoom, y * noiseZoom, time);
      let noiseVal2 = transformNoise(noiseVal, 0.50);
      
      circleSize = map(noiseVal2, 0, 1, 0, gridSize);

    //   if (circleSize < 1) continue;
      
      fill(color2);
      stroke(black);
      ellipse(x + gridSize / 2, y + gridSize / 2, circleSize, circleSize);
    }
  }

//   // Second layer of circles
//   for (let y = marginY; y < height-marginY; y += gridSize) {
//     for (let x = marginX; x < width-marginX; x += gridSize) {
//       let noiseVal = noise(x * noiseZoom, y * noiseZoom, time);
//       let noiseVal2 = transformNoise(noiseVal, 0.42);
      
//       circleSize = map(noiseVal2, 0, 1, 0, gridSize);

//       if (circleSize < 1) continue;
      
//       fill(color1);
//       stroke(black);
//       ellipse(x + gridSize / 2, y + gridSize / 2, circleSize, circleSize);
//     }
//   }
}

function transformNoise(x, midPoint) {
  // How long should the flat bits at the top be?
//   const xHigh = 0.2;
  
  // How long should the flat bits at the bottom be?
  const xLow = 0.05;

  const curveLength = 0.05;
  
  // What range are we extracting?
//   const midPoint = 0.5;
  
  // We want our curve to start at 'start'
  // It should then dip down until it gets to dipStop
  // Then it should sit at value 0
  // At dipStart it should then curve upwards again
  // And stop at end at value 1
  const dipStop = midPoint - (xLow / 2);
  const start = dipStop - curveLength;
  const dipStart = dipStop + (xLow / 2);
  const end = dipStart + curveLength;
  
  var y;
  
  if (x >= 0 && x < start) {
    y = 1;
  }
  else if (x >= start && x <= dipStop) {
    // Cosine graph starting at xHigh, ending at dipStop
    y = mapCos(x, start, dipStop, 0, 1);
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
