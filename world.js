var path;
var settings;
var cohort;

var debugDom;

var trials = [];

function Settings(lA) {
  this.speed = 1.0;
  this.path = path;
  this.lookAhead = lA;
  this.speedP = 0.05;
  this.steerP = 0.01;
  this.deadBand = 0.0;
  this.lifespan = 200;
  this.ticksPerTick = 10;
  this.color = 'blue';
}

function setup() {
  createCanvas(640,360);
  path = new Path(0, height/3, width, height/3);
  settings = new Settings(100);
  cohort = new Cohort(4, settings); // careful, n^2
  debugDom = createP('');
}

function draw() {
  background(51);
  path.render();
  // cohort.run();

  if (!cohort.shouldSet) {
    settings['score'] = cohort.score;
    var prevText = 'Last: ' + cohort.score.toFixed(3) + ' (' + settings.lookAhead.toFixed(1) + ')<br>';
    // trials.push({'lookAhead': settings.lookAhead, 'score': settings.score});
    trials.push([settings.score, settings.lookAhead]);
    trials.sort(sortFunction); // ascending
    // var bestText = 'Best: ' + trials[0].score.toFixed(3) + ' (' + trials[0].lookAhead.toFixed(1) + ')<br>';
    var bestText = 'Best: ' + trials[0][0].toFixed(3) + ' (' + trials[0][1].toFixed(1) + ')<br>';
    // settings = new Settings(trials[0].lookAhead + random(-20, 20));
    settings = new Settings(trials[0][1] + random(-20, 20));
    var currText = 'Trying: ' + settings.lookAhead.toFixed(1);
    cohort = new Cohort(4, settings);
    debugDom.html(prevText + bestText + currText);
    console.log(trials);
  }
}

function sortFunction(a, b) {
  if (a[0] === b[0]) {
      return 0;
  }
  else {
      return (a[0] < b[0]) ? -1 : 1;
  }
}
