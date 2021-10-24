var W = 600;
var H = 600;                // canvas width and height
var t;                      //init time
const T = 1;                //loop period
const NUM_FRAMES = 127;     //period frame number

// Motion blur and chromatic shift settings - the first three values are adjustable
const NUM_SUBSAMPLES = 25;     // sub-sampled sketches to take between the current and next frame
const SHUTTER_ANGLE = 1;        // 1 will capture all the distance to the next frame
const CHROM_ANGLE = 1;          // 1 will shift the different color channels (rgb)
const CHROM_DT = CHROM_ANGLE*T/NUM_FRAMES/2;
var preview = true;             // default is preview mode / this functionality could be deleted

// define RGB colors for chromatic shift
var colorsCS = ['#FF0000', '#00FF00', '#0000FF'];

//Sketch parameters
let dt;
let sine_t = 0;
let dtEnd;
let timescale = 0.03;

let loops = [];

let num_loops = 192; //I like: 96, 192
let loop_width; //I like: 30
let loop_height;
let anim = 0;

function setup() {
  createCanvas(W, H);
  strokeWeight(1);
  fill(255);
  frameRate(60);

  translate(-width/2, height/2);
  for (let i = 0; i < num_loops; i++) {
    let x = map(i, 0, num_loops, -width/2 + 50, width/2 - 50);
    let height = map(sin(i * PI / num_loops * 4), 0, 1, 0, 150);
    let loop_width = map(sin(i * PI / num_loops * 4), 0, 1, 0, 30);
    let r = map(sin(i * PI / num_loops * 4), 0, 1, 5, 2);
    loop = new Loop(x, 0, loop_width, height, r, i * PI / num_loops);
    loops.push(loop);
  }

  dt = 0;
  dtEnd = TWO_PI;
}

function draw() {
  let file_name = 'frame' + frameCount;
  var numSubSamples = (preview == false) ? NUM_SUBSAMPLES : 1;
  blendMode(BLEND); //lets the background function to clear the canvas
  background(255, 253, 208);
  noStroke();

  push();
  translate(width / 2, height / 2);
  update();
  for (let i = 0; i < 8; i++) {
    rotate(PI / 4);
    for (let loop of loops) {
      loop.draw();          
    }
  }
  pop();

  //saveCanvas(file_name, 'png');
}

function update() {
  anim = map(dt, 0, dtEnd, 0, 1);

  if (dt < dtEnd) {
    //timescale = map_timescale();
    dt += timescale;
  } else {
    dt = 0;
  }

  if (anim > 0.9999) {
    noLoop();
  }
}

//Input must be between 0 and 1
function ease_in_out_cubic(n) {
  return n < 0.5 ? (4 * n * n * n) : (1 - Math.pow(-2 * n + 2, 3) / 2);
}

function map_timescale() {
  return anim < 0.75 ? map(anim, 0.25, 0.75, 0.01, 0.003) : map(anim, 0.75, 1, 0.003, 0.01);
}

function draw_chromatic_aberration() {
  blendMode(ADD); // RGB channels overlapping sum to white
  for (let i=0; i<numSubSamples; i++){
      push();
      t = map(frameCount-1 + i*SHUTTER_ANGLE/numSubSamples, 0, NUM_FRAMES, 0, T)%T; //sub-sampled time
      fill(255);
      translate(W/2,H/2);
      for (let c=0; c<3;c ++){ // for each color RGB
          var tc = t - CHROM_DT*c;  // for chromatic aberration, offset time for each color
          colorc = color(colorsCS[c]);
          colorc.setAlpha(255/numSubSamples); // adjust transparency for num of sub-samples
          fill(colorc);
          
          // DRAW HERE
          push();
          translate(0, 0);
          fill(0);
          update();
          for (let i = 0; i < 8; i++) {
            rotate(PI / 4);
            for (let loop of loops) {
              loop.draw();          
            }
          }
          pop();
      }
      pop();
  }
}