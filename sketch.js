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
let flag_echo = false;
let echoes_drawn = 0;
let echoes = [];
let trailLength = 50;
let trail = [];

let num_loops = 64;
let loop_height;
let max_height = 300;
let loop_width = 30;
let anim = 0;

function setup() {
  createCanvas(W, H);
  strokeWeight(1);
  fill(255);

  translate(-width/2, height/2);
  for (let i = 0; i < num_loops; i++) {
    let x = map(i, 0, num_loops, -width/2 + 50, width/2 - 50);
    //let height = map(noise(i  * 20), 0, 1, 0, loop_height);
    let wavelength = 50;

    loop_height = map(sin(i * wavelength), 0, TWO_PI, 0, max_height) + (noise(i * 20) * 5); // creates sine wave pattern in branches
    loop_width = i % 2 == 0 ? map(sin(i * PI / num_loops * 4), 0, 1, 0, 30) : 40; // controls if tips connect

    let r = map(noise(i  * 20), 0, 1, 2, 17.5); // end result should range from 2 - 17.5
    loop = new Loop(x, 0, loop_width, loop_height, r, 0);
    loops.push(loop);
  }

  dt = 0;
  dtEnd = TWO_PI;
}

function draw() {
  translate(width/2, height/2);
  shearX(mouseX / width / 4)
  shearY(mouseY / height / 4)

  // DRAW HERE
  push();
  translate(0, 0);
  background(255);
  update();

  let num_reflections = 4;
  for (let i = 0; i < num_reflections; i++) {
    rotate(i * PI / num_reflections);
    for (let loop of loops) {
      push();
      loop.draw();          
      pop();
    }
  }
  pop();
}

function update() {
  anim = map(dt, 0, dtEnd, 0, 1);
  //console.log(anim);

  if (dt < dtEnd) {
    timescale = map_timescale();
    dt += timescale;
  } else {
    //console.log("reset");
    dt = 0;
  }
}

//Input must be between 0 and 1
function ease_in_out_cubic(n) {
  return n < 0.5 ? (4 * n * n * n) : (1 - Math.pow(-2 * n + 2, 3) / 2);
}

function map_timescale() {
  let max = 0.03;
  let min = 0.01;
  return anim < 0.75 ? map(anim, 0.25, 0.75, max, min) : map(anim, 0.75, 1, min, max);
}