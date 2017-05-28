function Cohort(n, cohortSettings) {
  this.cars = [];
  this.scores = [];
  this.done = false;
  this.shouldSet = true;
  this.color = cohortSettings.color;

  for (var i=0; i<n; i++) {
    for (var j=0; j<n; j++) {
      var settings = {'x': i*width/n, 'y': i*height/n, 'a': j*PI/n,
                      's': cohortSettings.speed,
                      'p': cohortSettings.path,
                      'lookAhead': cohortSettings.lookAhead,
                      'speedP': cohortSettings.speedP,
                      'steerP': cohortSettings.steerP,
                      'deadBand': cohortSettings.deadBand,
                      'lifespan': cohortSettings.lifespan,
                      'ticksPerTick': cohortSettings.ticksPerTick,
                      'c': this.color
                     };
      this.cars.push(new Controller(settings));
    }
  }

  this.run = function() {
    this.done = true;
    for (var i=0; i<this.cars.length; i++) {
      this.cars[i].run();
      if (this.cars[i].lifespan > 0) {
        this.done = false;
      }
    }
    if ((this.done) && (this.shouldSet)) {
      for (var i=0; i<this.cars.length; i++) {
        this.scores.push(this.cars[i].score);
      }
      this.score = this.scores.reduce(function(a,b) {return a+b}) / this.scores.length;
      // console.log(this.scores);
      // createP(str(this.color) + ': ' + this.score.toFixed(3));
      this.shouldSet = false;
    }
  };

}