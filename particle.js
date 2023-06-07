class Particle {
    constructor(pos, origin, v) {
      this.pos = pos;
      this.v = v;
      this.angle = 0;
      
      this.trail_length = random(50, 100);
      this.trail_weight = random(0.5, 5); // stroke width
      this.trailpoint = origin;
      this.origin = origin.copy();
      this.attraction_point = createVector(300, 300);
      
      this.reached_end = false;
    }
    
    // Renders the particle
    draw() {
      this.move_towards_point(this.attraction_point);
      
      push();
      this.set_stroke();
      strokeWeight(this.trail_weight);
      point(this.pos.x, this.pos.y);
      this.draw_trail();
      pop();
      
      // this.draw_trailpoint();
      this.reached_end = this.check_completion();
      this.update_velocity();
    }
    
    // Handles particle attraction
    move_towards_point(point) {
      var path = createVector(this.pos.x - point.x, this.pos.y - point.y);
      
      path.normalize();
      this.pos.x -= path.x * this.v;
      this.pos.y -= path.y * this.v;
    }
    
    // Sets particle color and handles color modulation
    set_stroke() {
      angleMode(DEGREES);
      let angle = this.attraction_point.angleBetween(this.origin).toFixed(1);
      
      /*
      *  Top-left corner: 0°
      *  Top-right corner: -45°
      *  Bottom-right corner: 0°
      *  Bottom-left corner: 45°
      *  Why is it like this? I don't know.
      */
      
      let r = map(angle, -45, 45, 250, 255);
      let g = map(angle, -45, 45, 0, 255);
      let b = map(angle, -45, 45, 0, 50);
      let r_end = map(this.ease_color(), 0, 1, r, 0);
      let g_end = map(this.ease_color(), 0, 1, g, 0);
      let b_end = map(this.ease_color(), 0, 1, b, 0);
      stroke(r_end, g_end, b_end);
    }
    
    // Applies an easing function to particle progress for color modulation
    ease_color() {
      return 1 - pow(1 - this.get_trail_progress(), 3);
    }
    
    // Calculates trail progress based on distance from origin and endpoint
    get_trail_progress() {
      let dist_from_end = dist(this.trailpoint.x, this.trailpoint.y, this.attraction_point.x, this.attraction_point.y);
      let total_distance = dist(this.attraction_point.x, this.attraction_point.y, this.origin.x, this.origin.y);
      let progress = map(dist_from_end, 0, total_distance, 1, 0);
      
      return progress;
    }
    
    // Renders particle trail
    draw_trail() {
      var dist_start = dist(this.trailpoint.x, this.trailpoint.y, this.pos.x, this.pos.y);
      var dist_end = dist(this.pos.x, this.pos.y, this.attraction_point.x, this.attraction_point.y);
      
      if (dist_start > this.trail_length || dist_end < this.trail_length) {
        var path = createVector(this.trailpoint.x - this.pos.x, this.trailpoint.y - this.pos.y);
  
        path.normalize();
        this.trailpoint.x -= path.x * this.v;
        this.trailpoint.y -= path.y * this.v;
      }
      
      line(this.trailpoint.x, this.trailpoint.y, this.pos.x, this.pos.y);
    }
    
    // Not in use - renders the particle's trail startpoint
    draw_trailpoint() {
      push();
      stroke(255, 0, 0);
      strokeWeight(3);
      point(this.trailpoint.x, this.trailpoint.y);
      pop();
    }
    
    // Returns whether the particle has reached its destination or not
    check_completion() {
      if (dist(this.trailpoint.x, this.trailpoint.y, this.attraction_point.x, this.attraction_point.y) < 1) {
        return true;
      }
      
      return false;
    }
    
    // Calculates particle progress based on distance from origin and endpoint
    get_progress() {
      let dist_from_end = dist(this.pos.x, this.pos.y, this.attraction_point.x, this.attraction_point.y);
      let total_distance = dist(this.attraction_point.x, this.attraction_point.y, this.origin.x, this.origin.y);
      let progress = map(dist_from_end, 0, total_distance, 1, 0);
      
      return progress;
    }
    
    // Updates particle velocity based on an easing function and particle progress
    update_velocity() {
      let eased_progress = this.ease_in_out_circ(this.get_progress());
      let min = 1;
      let max = 10;
      
      this.v = eased_progress < 0.5 ? map(eased_progress, 0, 0.5, min, max) : map(eased_progress, 0.5, 1, max, min);
    }
    
    // Easing formula (helper function)
    ease_in_out_circ(x) {
      return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
    }
  }