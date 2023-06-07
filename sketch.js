/*
  BLACK HOLE by Ibrahim Syed
  
  The color picker at the bottom of the sketch controls the canvas' background color.
  The slider next to the color picker controls the size of the black hole.
  The sliders to the right of the sketch change the particle color ranges.
*/

var particles = []
var num_particles = 144;
var black_hole_size = 150;

var bg_color_picker;
var r1, r2, g1, g2, b1, b2;
var color_sliders = [r1, r2, g1, g2, b1, b2];
var black_hole_slider;

function setup() {
  createCanvas(600, 600);
  
  for (let i = 0; i < num_particles; i++) {
    particles.push(generate_particle());
  }
  
  // bg_color_picker = createColorPicker('#fffbe1');
  // bg_color_picker.position(0, height+5);
  // this.create_color_sliders();
  
  // black_hole_slider = createSlider(0, 500, 150);
  // black_hole_slider.position(75, height+5);
  // black_hole_slider.style('width', '120px');
}

function draw() {
  push();
  background(255);
  stroke(255);
  fill(0);
  circle(width/2, height/2, 255);
  pop();
  
  for (let i = particles.length - 1; i > 0; i--) {
    let p = particles[i];
    
    p.draw();
    if (p.reached_end == true) particles.splice(i, 1);
  }
  
  while (particles.length < num_particles) {
    particles.push(generate_particle()); 
  }
}

function create_color_sliders() {
  color_sliders[0] = createSlider(0, 255, 250);  
  color_sliders[1] = createSlider(0, 255, 255);
  color_sliders[2] = createSlider(0, 255, 0);
  color_sliders[3] = createSlider(0, 255, 255);
  color_sliders[4] = createSlider(0, 255, 0);
  color_sliders[5] = createSlider(0, 255, 50);
  
  for (let i = 0; i < 6; i++) {
    let slider = color_sliders[i];
    
    slider.position(width+5, i*25);
    slider.style('width', '80px');
  }
}

function generate_particle() {
  let v = 1;
  let random_pos = createVector(random(0, width), random(0, height));
  let origin_pos = random_pos.copy();
  
  return new Particle(random_pos, origin_pos, v);
}