var particles = []
var numParticles = 10
var clearButton

let container = document.getElementById('sketch')

function setup() {
  let canvas = createCanvas(900, 550);
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle(random(0, width), random(0, height), random(4, 15)));
  }

  clearButton = createButton('CLEAR CANVAS')
  clearButton.mousePressed(clearCanvas)
  canvas.parent(container)
  clearButton.parent(container)
  clearButton.style('max-width', width + 'px')
  clearButton.addClass('clearButton')
  clearButton.addClass('hover-blue')

  colorMode(HSB, 255);
}

function draw() {
  background(255);

  push()
  stroke(0)
  strokeWeight(3)
  noFill()
  rect(0, 0, width, height)
  pop()

  for (let p of particles) {
    p.update()
    p.display()
    p.checkBoundaryCollision()
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = 0; j < particles.length; j++) {
      if (i != j) {
        particles[i].checkCollision(particles[j]);
      }
    }
  }
}

function mousePressed() {
  var valid = true
  
  for (let p of particles) {
    if ((mouseX < p.pos.x + p.r && mouseX > p.pos.x - p.r) && (mouseY < p.pos.y + p.r && mouseY > p.pos.y - p.r)) {
      valid = false
    }
  }

  if (mouseX > width || mouseY > height || mouseX < 0 || mouseY < 0) {
    valid = false
  }
  
  if (valid) {
    particles.push(new Particle(mouseX, mouseY, random(4, 15)));
  }
}

function clearCanvas() {
  console.log("clear() called")
  particles.length = 0
}