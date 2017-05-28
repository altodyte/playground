function Car(x, y, a, p, c) {
  this.path = p;
  this.cohortColor = c;
  // Position of the Car's center; heading of car body (for drawing)
  this.xState = createVector(x, 0); // x, xdot, xdotdot
  this.yState = createVector(y, 0); // y, ydot, ydotdot
  this.aState = createVector(a, 0); // a, adot, adotdot

  // Controls
  this.speed = 1.0;
  this.steer = 0.0;

  // Constraints
  this.speedDecay = 0.005;
  this.steerDecay = 0.001;
  this.speedMax = 3.0;
  this.steerMax = QUARTER_PI;

  // Behaviors
  this.speedRate = 0.05; // for manual control
  this.steerRate = 0.01; // for manual control
  this.lookAhead = 50;
  this.speedUrgency = 0.05;
  this.steerUrgency = 0.01;
  this.deadBand = 0.0;

  // Dimensions for physics and rendering
  this.bodyLength = 50.0; // SHOULD BE LARGER than axleSpacing
  this.bodyWidth = 25;
  this.axleSpacing = 40.0;
  this.showRadius = false;
  this.manual = false;
  this.score = 0.0;

  this.getAxleX = function() {
    return this.xState.x - this.axleSpacing * 0.5 * cos(this.aState.x);
  };

  this.getAxleY = function() {
    return this.yState.x - this.axleSpacing * 0.5 * sin(this.aState.x);
  };

  // Position of the rear axle (for physics)
  this.axleX = createVector(this.getAxleX(), 0, 0);
  this.axleY = createVector(this.getAxleY(), 0, 0);

  this.friction = function() {
    if (this.steer > 0) {
      this.steer -= this.steerDecay;
    } else if (this.steer < 0) {
      this.steer += this.steerDecay;
    }
    // if (this.speed > 0) {
    //   this.speed -= this.speedDecay;
    // } else if (this.speed < 0) {
    //   this.speed += this.speedDecay;
    // }
    this.steer = constrain(this.steer, -this.steerMax, this.steerMax);
    this.speed = constrain(this.speed, -this.speedMax, this.speedMax);
  };

  // Method to update location
  this.update = function() {
    // http://planning.cs.uiuc.edu/node658.html
    this.xState.y = this.speed * cos(this.aState.x);
    this.yState.y = this.speed * sin(this.aState.x);
    this.aState.y = this.speed * tan(this.steer) / this.axleSpacing;
    
    this.xState.x += this.xState.y;
    this.yState.x += this.yState.y;
    this.aState.x += this.aState.y;
  };

  this.softUpdate = function(states) {
    // http://planning.cs.uiuc.edu/node658.html
    var xS = states.x;
    var yS = states.y;
    var aS = states.a;

    xS.y = this.speed * cos(aS.x);
    yS.y = this.speed * sin(aS.x);
    aS.y = this.speed * tan(this.steer) / this.axleSpacing;

    xS.x += xS.y;
    yS.x += yS.y;
    aS.x += aS.y;
    return {'x': xS, 'y': yS, 'a': aS};
  };

  this.render = function() {
    var theta = this.aState.x + radians(90);
    push();
    // Draw Body
    translate(this.xState.x, this.yState.x);
    rectMode(CENTER);
    fill(color('white'));
    stroke(color('black'));
    rotate(theta);
    rect(0, 0, this.bodyWidth, this.bodyLength);
    fill(color(this.cohortColor));
    beginShape();
    vertex(0, -this.bodyLength*0.5);
    vertex(-this.bodyWidth*0.5, this.bodyLength*0.5);
    vertex(this.bodyWidth*0.5, this.bodyLength*0.5);
    endShape(CLOSE);
    // Draw turning radius
    if ((abs(this.steer) - 0.1 > 0) && (this.showRadius)) {
      strokeWeight(3);
      var turnRadius = this.axleSpacing / tan(this.steer);
      line(0, this.axleSpacing*0.5, turnRadius, this.axleSpacing*0.5);
      strokeWeight(1);
    }
    // Draw Rear Wheels
    fill(color('red'));
    rect(-this.bodyWidth*0.5, this.axleSpacing*0.5, this.bodyWidth*0.2, this.axleSpacing*0.4);
    rect(this.bodyWidth*0.5, this.axleSpacing*0.5, this.bodyWidth*0.2, this.axleSpacing*0.4);
    // Draw Front Wheels
    translate(0, -this.axleSpacing*0.5);
    rotate(this.steer);
    rect(-this.bodyWidth*0.5, 0, this.bodyWidth*0.2, this.axleSpacing*0.4);
    rect(this.bodyWidth*0.5, 0, this.bodyWidth*0.2, this.axleSpacing*0.4);
    pop();
  };

  // Wraparound
  this.borders = function() {
    if (this.xState.x < -this.bodyWidth)  this.xState.x = width +this.bodyWidth;
    if (this.yState.x < -this.bodyWidth)  this.yState.x = height+this.bodyWidth;
    if (this.xState.x > width +this.bodyWidth) this.xState.x = -this.bodyWidth;
    if (this.yState.x > height+this.bodyWidth) this.yState.x = -this.bodyWidth;
  };

  this.keyControl = function() {
    if (keyIsDown(LEFT_ARROW)) {
      this.steer -= this.steerRate;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.steer += this.steerRate;
    }
    if (keyIsDown(UP_ARROW)) {
      this.speed += this.speedRate;
    } else if (keyIsDown(DOWN_ARROW)) {
      this.speed -= this.speedRate;
    }
    if (keyIsDown(32)) {
      this.speed = 0.0;
      this.steer = 0.0;
    }
  };

  this.seeFuture = function(iterations) {
    var xS = this.xState.copy();
    var yS = this.yState.copy();
    var aS = this.aState.copy();
    // var sp = this.speed;
    // var st = this.steer;
    var future = {'x': xS, 'y': yS, 'a': aS};
    for (var i=0; i < iterations; i++) {
      future = this.softUpdate(future);
    }
    return future;
  };

  this.control = function() {
    var future = this.seeFuture(this.lookAhead);
    var futurePoint = createVector(future.x.x, future.y.x);
    fill(color('green'));
    ellipse(future.x.x, future.y.x, 10, 10);
    var seek = getNormalPoint(futurePoint, this.path.start, this.path.end);
    fill(color('blue'));
    ellipse(seek.x, seek.y, 10, 10);
    var suggestion = this.shouldIncreaseSteer(futurePoint, seek);
    if (suggestion === 0) {
      console.log('On track!');
    } else if (suggestion) {
      this.steer += this.steerUrgency;
    } else {
      this.steer -= this.steerUrgency;
    }
  };

  this.run = function(ticksPerTick) {
    for (var i=0; i<ticksPerTick; i++) {
      if (this.manual) {
        this.keyControl();
      } else {
        this.control();
      }
      this.friction();
      this.update();
      this.borders();
      this.score += this.error();
    }
    this.render();
  };

  var getNormalPoint = function(p, a, b) {
    // Vector from a to p
    var ap = p5.Vector.sub(p, a);
    // Vector from a to b
    var ab = p5.Vector.sub(b, a);
    ab.normalize(); // Normalize the line
    // Project vector "diff" onto line by using the dot product
    ab.mult(ap.dot(ab));
    var normalPoint = p5.Vector.add(a, ab);
    return normalPoint;
  };

  this.shouldIncreaseSteer = function(futureP, trackP) {
    var st = this.steer;
    var err = p5.Vector.sub(futureP, trackP).mag();
    this.steer += this.steerUrgency;
    var future = this.seeFuture(this.lookAhead - 1);
    this.steer = st;
    var futureP2 = createVector(future.x.x, future.y.x);
    var trackP2 = getNormalPoint(futureP2, this.path.start, this.path.end);
    var err2 = p5.Vector.sub(futureP2, trackP2).mag();
    if (abs(err2 - err) < this.deadBand) {
      return 0;
    }
    var should = (err2 < err);
    // console.log('checking future: ', should, err - err2);
    return should;
  };

  this.error = function() {
    var carPos = createVector(this.xState.x, this.yState.x);
    var pathPos = getNormalPoint(carPos, this.path.start, this.path.end);
    return p5.Vector.sub(carPos, pathPos).mag();
  };
}


// http://www.me.berkeley.edu/~frborrel/pdfpub/IV_KinematicMPC_jason.pdf
// http://www.cs.cmu.edu/~motionplanning/reading/PlanningforDynamicVeh-1.pdf
// http://correll.cs.colorado.edu/?p=1869