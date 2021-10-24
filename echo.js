class Echo {
    constructor(origin_x, origin_y) {
        this.origin = createVector(origin_x, origin_y);

        this.r = 5;
        this.alpha = 255;
    }

    draw() {
        push();
        noFill();
        stroke(255, 255, 255, this.alpha);
        strokeWeight(0.25);
        circle(this.origin.x, this.origin.y, this.r)
        pop();
    }

    update() {
        this.r += 0.001;
        this.alpha = map(dt, dtEnd / 2, dtEnd, 255, 0);
    }
}