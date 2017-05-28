var cars = [];
var path;

var errorDom;
var accumError = 0.0;
var frame = 0;

function setup() {
  createCanvas(640,360);
  // var car = new Car(width/2, height/2);
  // cars.push(car);
  path = new Path();
  errorDom = createP('Error: <br>Score:');
}

function draw() {
  background(51);
  path.render();
  if (cars.length > 0) {
    frame+=1;
    var curErr = cars[0].error();
    accumError += curErr;
    var errorText = 'Error: ' + str(curErr.toFixed(3)) 
                  + '<br>Score: ' + str(accumError.toFixed(3))
                  + '<br>Frame: ' + str(frame);
    errorDom.html(errorText);
  }
  for (var i = 0; i < cars.length; i++) {
    cars[i].run();
  }
}

// Add a new car into the System
function mouseClicked() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    cars.push(new Car(mouseX,mouseY,path));
    console.log("new car!");
  }
}

function keyPressed() {
  if ((keyCode === 82) && (cars.length > 0)) {
    var sR = !cars[0].showRadius;
    for (var i = 0; i < cars.length; i++) {
      cars[i].showRadius = sR;
    }
  }
  if ((keyCode === 68) && (cars.length > 0)) {
    cars.splice(0,cars.length);
    console.log('Deleted all cars!');
  }
  if ((keyCode === 77) && (cars.length > 0)) {
    var m = !cars[0].manual;
    for (var i = 0; i < cars.length; i++) {
      cars[i].manual = m;
    }
    console.log('Manual mode toggled! On:', m);
  }
}


//

var controllers = [];
var path;
var debugDom;

function setup() {
  createCanvas(640,360);
  path = new Path();
  debugDom = createP('');
}

function draw() {
  background(51);
  path.render();
  var debugText = '';
  for (var i = 0; i < controllers.length; i++) {
    controllers[i].run();
    debugText += 'Car ' + str(i) + ': ' + controllers[i].score.toFixed(3) + '<br>';
  }
  debugDom.html(debugText);
}

// Add a new car into the System
function mouseClicked() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    controllers.push(new Controller(mouseX,mouseY, 0, 1.0, path));
    console.log("New car!");
  }
}

function keyPressed() {
  if ((keyCode === 82) && (controllers.length > 0)) {
    var sR = !controllers[0].car.showRadius;
    for (var i = 0; i < controllers.length; i++) {
      controllers[i].car.showRadius = sR;
    }
  }
  if ((keyCode === 68) && (controllers.length > 0)) {
    controllers.splice(0,cars.length);
    console.log('Deleted all cars!');
  }
  if ((keyCode === 77) && (cars.length > 0)) {
    var m = !controllers[0].car.manual;
    for (var i = 0; i < controllers.length; i++) {
      controllers[i].car.manual = m;
    }
    console.log('Manual mode toggled! On:', m);
  }
}
