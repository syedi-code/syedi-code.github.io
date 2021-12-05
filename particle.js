class Particle {
    constructor(x, y, r_) {
        this.pos = createVector(x, y)
        this.velocity = p5.Vector.random2D()
        this.velocity.mult(2)
        this.r = r_
        this.m = this.r * 0.1

        this.color = createVector(0, 0, 0)
    }

    update() {
        this.pos.add(this.velocity);
    }

    checkBoundaryCollision() {
        if (this.pos.x > width - this.r) {
            this.pos.x = width - this.r
            this.velocity.x *= -1
        } else if (this.pos.x < this.r) {
            this.pos.x = this.r
            this.velocity.x *= - 1
        } else if (this.pos.y > height - this.r) {
            this.pos.y = height - this.r
            this.velocity.y *= -1
        } else if (this.pos.y < this.r) {
            this.pos.y = this.r
            this.velocity.y *= -1
        }
    }

    checkCollision(other) {
        var distanceVect = p5.Vector.sub(other.pos, this.pos)
        var distanceVectMag = distanceVect.mag()
        var minDistance = this.r + other.r

        push()
        if (distanceVectMag < minDistance) {
            this.color.x = random(100, 255);
            this.color.y = random(100, 255);
            this.color.z = random(120, 255);
            other.color.x = random(100, 255);
            other.color.y = random(100, 255);
            other.color.z = random(120, 255);

            var distanceCorrection = (minDistance - distanceVectMag) / 2
            var d = distanceVect.copy()
            var correctionVector = d.normalize().mult(distanceCorrection)
            other.pos.add(correctionVector);
            this.pos.sub(correctionVector);

            // get angle of distanceVect
            var theta  = distanceVect.heading();
            // precalculate trig values
            var sine = sin(theta);
            var cosine = cos(theta);

            var bTemp = []
            for (let i = 0; i < 2; i++) {
                bTemp.push(createVector())
            }

            bTemp[1].x  = cosine * distanceVect.x + sine * distanceVect.y;
            bTemp[1].y  = cosine * distanceVect.y - sine * distanceVect.x;

            var vTemp = []
            for (let i = 0; i < 2; i++) {
                vTemp.push(createVector())
            }

            vTemp[0].x  = cosine * this.velocity.x + sine * this.velocity.y;
            vTemp[0].y  = cosine * this.velocity.y - sine * this.velocity.x;
            vTemp[1].x  = cosine * other.velocity.x + sine * other.velocity.y;
            vTemp[1].y  = cosine * other.velocity.y - sine * other.velocity.x;

            var vFinal = []
            for (let i = 0; i < 2; i++) {
                vFinal.push(createVector())
            }

            // final rotated velocity for b[0]
            vFinal[0].x = ((this.m - other.m) * vTemp[0].x + 2 * other.m * vTemp[1].x) / (this.m + other.m);
            vFinal[0].y = vTemp[0].y;

            // final rotated velocity for b[0]
            vFinal[1].x = ((other.m - this.m) * vTemp[1].x + 2 * this.m * vTemp[0].x) / (this.m + other.m);
            vFinal[1].y = vTemp[1].y;

            // hack to avoid clumping
            bTemp[0].x += vFinal[0].x;
            bTemp[1].x += vFinal[1].x;

            var bFinal = []
            for (let i = 0; i < 2; i++) {
                bFinal.push(createVector())
            }

            bFinal[0].x = cosine * bTemp[0].x - sine * bTemp[0].y;
            bFinal[0].y = cosine * bTemp[0].y + sine * bTemp[0].x;
            bFinal[1].x = cosine * bTemp[1].x - sine * bTemp[1].y;
            bFinal[1].y = cosine * bTemp[1].y + sine * bTemp[1].x;

            other.pos.x = this.pos.x + bFinal[1].x;
            other.pos.y = this.pos.y + bFinal[1].y;

            this.pos.add(bFinal[0])
            this.velocity.x = cosine * vFinal[0].x - sine * vFinal[0].y;
            this.velocity.y = cosine * vFinal[0].y + sine * vFinal[0].x;
            other.velocity.x = cosine * vFinal[1].x - sine * vFinal[1].y;
            other.velocity.y = cosine * vFinal[1].y + sine * vFinal[1].x;
        }
        pop()
    }

    display() {
        noStroke()
        fill(this.color.x, this.color.y, this.color.z)
        ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2)
    }
}