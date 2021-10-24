class Loop {
    constructor(origin_x, origin_y, width, height, radius, time_offset) {
        this.x = origin_x;
        this.y = origin_y;

        this.r_base = radius;
        this.r = radius;
        this.width = width;
        this.height = height;

        this.position_one;
        this.position_two;
        
        this.offset = time_offset;
        this.dtOffset = dt + this.offset;
        this.dtOffsetEnd = dtEnd + this.offset;

        this.r_offset = map(dist(0, 0, this.x, this.y), 0, 100, 0, 35);
        this.color1 = createVector(149 + this.r_offset, 189, 220);
        this.color2 = createVector(201 + this.r_offset, 84, 162);
    }

    draw() {
        let r = anim < 0.5 ? map(anim, 0, 0.5, this.color1.x, this.color2.x) : map(anim, 0.5, 1, this.color2.x, this.color1.x); 
        let g = anim < 0.5 ? map(anim, 0, 0.5, this.color1.y, this.color2.y) : map(anim, 0.5, 1, this.color2.y, this.color1.y); 
        let b = anim < 0.5 ? map(anim, 0, 0.5, this.color1.z, this.color2.z) : map(anim, 0.5, 1, this.color2.z, this.color1.z); 

        this.position_one = createVector(this.x - this.width/2 + this.path_one_x(), this.y - this.height/2 + this.path_one_y());
        this.position_two = createVector(this.x + this.width/2 + this.path_two_x(), this.y + this.height/2 + this.path_two_y());
        this.r = map(sin(dt), -1, 1, this.r_base - 1, this.r_base + 1);

        push();
        fill(r, g, b);
        circle(this.position_one.x, this.position_one.y, this.r);
        circle(this.position_two.x, this.position_two.y, this.r);
        pop();
    }

    get_position_one() {
        return this.position_one;
    }

    get_position_two() {
        return this.position_two;
    }

    path_one_x() {
        let p;
        if ((dt + this.offset) > 0 && (dt + this.offset) < (dtEnd + this.offset) / 2) {
            p = map((dt + this.offset), this.offset, (dtEnd + this.offset)/2, 0, 1);
            let pos = map(this.ease_in_out_cubic(p), 0, 1, 0, this.width);
            return pos;
        } else if ((dt + this.offset) > (dtEnd + this.offset) / 2 && (dt + this.offset) < (dtEnd + this.offset)) {
            return this.width;
        } else {
            return 0;
        }
    }
    
    path_one_y() {
        let p;
        if ((dt + this.offset) > (dtEnd + this.offset) / 2 && (dt + this.offset) < (dtEnd + this.offset)) {
            p = map((dt + this.offset), (dtEnd + this.offset)/2 - 0.1, (dtEnd + this.offset), 0, 1);
            let pos = map(this.ease_in_out_cubic(p), 0, 1, this.y, this.height);
            return pos;
        } else {
            return 0;
        }
    }

    path_two_x() {
        let p;
        if ((dt + this.offset) >= 0 && (dt + this.offset) < (dtEnd + this.offset) / 2) {
            p = map((dt + this.offset), this.offset, (dtEnd + this.offset)/2, 0, 1);
            let pos = map(this.ease_in_out_cubic(p), 0, 1, 0, -this.width);
            return pos;
        } else if ((dt + this.offset) > (dtEnd + this.offset) / 2 && (dt + this.offset) < (dtEnd + this.offset)) {
            return -this.width;
        } else {
            return 0;
        }
    }

    path_two_y() {
        let p;
        if ((dt + this.offset) > (dtEnd + this.offset) / 2 && (dt + this.offset) < (dtEnd + this.offset)) {
            p = map((dt + this.offset), (dtEnd + this.offset)/2 - 0.1, (dtEnd + this.offset), 0, 1);
            let pos = map(this.ease_in_out_cubic(p), 0, 1, -this.y, -this.height);
            return pos;
        } else {
            return 0;
        }
    }

    // https://easings.net/#easeInOutCubic
    ease_in_out_cubic(n) {
        return n < 0.5 ? (4 * n * n * n) : (1 - Math.pow(-2 * n + 2, 3) / 2);
    }
}