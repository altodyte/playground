function Controller(settings) {
	var x = settings.x;
	var y = settings.y;
	var a = settings.a;
	var s = settings.s;
	var p = settings.p;
	var c = settings.c;

	this.ticksPerTick = settings.ticksPerTick;

  // Spawn Car
  this.car = new Car(x, y, a, p, c);
  this.car.speed = s;

  // Behaviors
  // this.car.lookAhead = 50;
  // this.car.speedUrgency = 0.05;
  // this.car.steerUrgency = 0.01;
  // this.car.deadBand = 0.0;
  this.car.lookAhead = settings.lookAhead;
  this.car.speedUrgency = settings.speedP;
  this.car.steerUrgency = settings.steerP;
  this.car.deadBand = settings.deadBand;

  // Optimizations
  this.lifespan = settings.lifespan; //1000;
  this.score = 0.0;

  this.run = function() {
  	if (this.lifespan > 0) {
  		this.lifespan -= 1;
  		this.car.run(this.ticksPerTick);
  		this.score = this.car.score;
  	} else {
  		this.car.render();
  	}
  };

}