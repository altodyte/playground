function Path(x1, y1, x2, y2) {
  // A path has a radius, i.e how far is it ok for the boid to wander off
  this.radius = 20;
  // A Path is line between two points (p5.Vector objects)
  this.start = createVector(x1, y1);
  this.end = createVector(x2, y2);

  // Draw the path
  this.render = function() {

    strokeWeight(this.radius*2);
    stroke(200,100);
    line(this.start.x,this.start.y,this.end.x,this.end.y);

    strokeWeight(1);
    stroke(200);
    line(this.start.x,this.start.y,this.end.x,this.end.y);
  };
}