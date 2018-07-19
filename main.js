var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var scoreText = document.querySelector('p');
var count = 0;

function random(min, max) {
    var num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}
function Ball(x, y, velX, velY, exists, color, size, cd) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
    this.cd = 0;
}

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(Math.abs(this.velX));
    }

    if ((this.x - this.size) <= 0) {
        this.velX = (Math.abs(this.velX));
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(Math.abs(this.velY));
    }

    if ((this.y - this.size) <= 0) {
        this.velY = (Math.abs(this.velY));
    }
    this.cd++;
    this.x += this.velX;
    this.y += this.velY;
}

Ball.prototype.collisionDetect = function () {
    for (var j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size && balls[j].cd > 10 && balls[j].exists) {
                balls[j].cd = 0;
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';

                this.velX = -(this.velX);
                this.velY = -(this.velY);             

            }
        }
    }
}

function Circle(x, y, exists) {
    Shape.call(this, x, y, 30, 30, exists);
    this.color = "white";
    this.size = 20;
}

Circle.prototype.draw = function () {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}

Circle.prototype.checkBounds = function () {
    if ((this.x + this.size) >= width) {
        this.x += -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.x += (this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.y += -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.y += (this.velY);
    }
}

Circle.prototype.controls = function () {
    var _this = this;
    window.onkeydown = function (e) {
        if (e.keyCode === 65) {
            _this.x -= _this.velX;
        } else if (e.keyCode === 68) {
            _this.x += _this.velX;
        } else if (e.keyCode === 87) {
            _this.y -= _this.velY;
        } else if (e.keyCode === 83) {
            _this.y += _this.velY;
        }
    }
}

Circle.prototype.collisionDetect = function () {
    for (var j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
                count++;
            }
        }
    }
}

var balls = [];
var circle = new Circle(50, 50, true);
circle.controls();

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, width, height);

    while (balls.length < 100) {
        var ball = new Ball(
            random(0, width),
            random(0, height),
            random(-7, 7),
            random(-7, 7),
            true,
            'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
            random(10, 20)
        );
        balls.push(ball);
    }

    circle.checkBounds();
    circle.collisionDetect();
    circle.draw();

    scoreText.textContent = "Your score:" + count;

    for (var i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].collisionDetect();
            balls[i].update();
            balls[i].draw();
        }
    }
    requestAnimationFrame(loop);
}

loop();


