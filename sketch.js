let capture
let tracker
let strange
let vid
let systems
let nparticles = 0
let produceparts = false

// function preload(){

//     strange = loadImage('strange.png')
//     vid = createVideo('yeet.mov')

//     vid.hide()
// }
function setup() {
      systems = [];


    // vid.loop()

    createCanvas(800, 600)

    // graphics = createGraphics(100, 100)

    // start capturing video
    capture = createCapture(VIDEO)
    capture.size(800, 600)
    capture.hide()

    // create the tracker
    tracker = new clm.tracker()
    tracker.init()
    tracker.start(capture.elt)    

}


function draw() {    
    // background(0)
    
    // show the video feed
    image(capture, 0, 0, capture.width, capture.height)


    // get data from tracker
    let positions = tracker.getCurrentPosition()

    // make sure we have data to work with
      // background(0,0,0)

    if (positions.length > 0) {

        stroke(255)
        fill(255)

        // draw the data
        let i = 0;
        while (i < positions.length - 1) {
            // ellipse(positions[i][0], positions[i][1], 4, 4)
            // text(i, positions[i][0], positions[i][1])
            line(positions[i][0], positions[i][1], positions[i+1][0], positions[i+1][1])
            // image(vid, positions[i][0]-strange.width/2, positions[i][1]-strange.height/2, 50, 50)
            
this.p = new ParticleSystem(createVector(positions[i][0], positions[i][1]));

        systems.push(p);

            i += 2

        }

          for (i = 0; i<15; i++) {
              systems[i].run();
              if(frameCount % 5 === 0){
           systems[i].addParticle();

}}

// background(0)



        // overlay eyes
        let leftEyeX = positions[32][0]
        let leftEyeY = positions[32][1]

        let rightEyeX = positions[27][0]
        let rightEyeY = positions[27][1]
        
        push()
        fill(255, 0, 0)
        ellipse(leftEyeX, leftEyeY, 20, 20)
        ellipse(rightEyeX, rightEyeY, 20, 20)
        pop()        

        // measure distances between features
        let noseX = positions[62][0]
        let noseY = positions[62][1]

        let leftNostrilX = positions[43][0]
        let leftNostrilY = positions[43][1]

        let rightNostrilX = positions[42][0]
        let rightNostrilY = positions[42][1]

        let distanceLeft = dist(noseX, noseY, leftNostrilX, leftNostrilY) 
        let distanceRight = dist(noseX, noseY, rightNostrilX, rightNostrilY)

}
}


// A simple Particle class
let Particle = function(position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 255.0;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function () {
  stroke(200, this.lifespan);
  strokeWeight(2);
  fill(127, this.lifespan);
  ellipse(this.position.x, this.position.y, 12, 12);
};

// Is the particle still useful?
Particle.prototype.isDead = function () {
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};

let ParticleSystem = function (position) {
  this.origin = position.copy();
  this.particles = [];
};
ParticleSystem.prototype.addParticle = function () {
  // Add either a Particle or CrazyParticle to the system
  if (int(random(0, 2)) == 0) {
    p = new Particle(this.origin);
  }
  else {
    p = new CrazyParticle(this.origin);
  }
  this.particles.push(p);
};

ParticleSystem.prototype.run = function () {
  for (let i = this.particles.length - 1; i >= 0; i--) {
    let p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};

// A subclass of Particle

function CrazyParticle(origin) {
  // Call the parent constructor, making sure (using Function#call)
  // that "this" is set correctly during the call
  Particle.call(this, origin);

  // Initialize our added properties
  this.theta = 0.0;
};

// Create a Crazy.prototype object that inherits from Particle.prototype.
// Note: A common error here is to use "new Particle()" to create the
// Crazy.prototype. That's incorrect for several reasons, not least
// that we don't have anything to give Particle for the "origin"
// argument. The correct place to call Particle is above, where we call
// it from Crazy.
CrazyParticle.prototype = Object.create(Particle.prototype); // See note below

// Set the "constructor" property to refer to CrazyParticle
CrazyParticle.prototype.constructor = CrazyParticle;

// Notice we don't have the method run() here; it is inherited from Particle

// This update() method overrides the parent class update() method
CrazyParticle.prototype.update=function() {
  Particle.prototype.update.call(this);
  // Increment rotation based on horizontal velocity
  this.theta += (this.velocity.x * this.velocity.mag()) / 10.0;
}

// This display() method overrides the parent class display() method
CrazyParticle.prototype.display=function() {
  // Render the ellipse just like in a regular particle
  Particle.prototype.display.call(this);
  // Then add a rotating line
  push();
  translate(this.position.x, this.position.y);
  rotate(this.theta);
  stroke(255, this.lifespan);
  line(0, 0, 25, 0);
  pop();
}