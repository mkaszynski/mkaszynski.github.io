const canvas = document.createElement("canvas");
canvas.width = 1200;
canvas.height = 600;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

let circles = [];

for (let i = 0; i < 20; i++) {
  circles.push([Math.random()*1200, Math.random()*600, Math.random()*100]);
}

let keys = {};
let mouse = { x: 0, y: 0, held: [false, false, false] };

function dis(pos1, pos2) {
  const x = (pos2[0] - pos1[0]) ** 2;
  const y = (pos2[1] - pos1[1]) ** 2;
  return Math.sqrt(x + y);
}

function draw_circle(x, y, radius, color) {
  ctx.fillStyle = color;        // color
  ctx.beginPath();              // start a new path
  ctx.arc(x, y, radius, 0, Math.PI * 2); // x, y, radius, startAngle, endAngle
  ctx.fill();
}

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

canvas.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

canvas.addEventListener("mousedown", e => mouse.held[e.button] = true);
canvas.addEventListener("mouseup", e => mouse.held[e.button] = false);

let posx = 600;
let posy = 0;

let vely = 0;
let velx = 0;

let infinite = false;

let CanJump = false;

let mouse_held1 = false;
let mouse_held2 = false;

let running = true;
function loop() {
  if (!running) return;

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  if (posy < 10 && !infinite) {
    posy = 11;
    vely *= -0.5;
  }
  if (posy > 589 && !infinite) {
    posy = 590;
    vely *= -0.5;
    velx *= 0.9;
    CanJump = true
  }

  for (let i of circles) {
    if (dis([posx, posy], [i[0], i[1]]) < (i[2] + 10)) {
      posx = (posx - i[0])/dis([posx, posy], [i[0], i[1]])*(i[2] + 10) + i[0];
      posy = (posy - i[1])/dis([posx, posy], [i[0], i[1]])*(i[2] + 10) + i[1];
      vely = (posy - i[1])/dis([posx, posy], [i[0], i[1]])*dis([velx, vely], [0, 0]) + vely/2;
      velx = (posx - i[0])/dis([posx, posy], [i[0], i[1]])*dis([velx, vely], [0, 0]) + velx/2;
      if (posy < i[1]) {
        CanJump = true;
      }
    };
  };
  
  if (keys["a"]) {
    velx += -0.2;
  }
  if (keys["d"]) {
    velx += 0.2;
  }
  
  if (keys["w"] && CanJump) {
    vely += -7;
  }
  if (keys["s"]) {
    vely += 0.1;
  }

  if (!infinite) {
    if (posx < 10) {
      posx = 10;
      velx *= -0.5
    }
    if (posx > 1190) {
      posx = 1190;
      velx *= -0.5
    }
  }

  vely += 0.5;
  posy += vely;
  posx += velx;

  CanJump = false;

  for (let i of circles) {
    if (infinite) {
      draw_circle(i[0] - posx + 600, i[1] - posy + 300, i[2], "rgb(0, 128, 0)");
    } else {
      draw_circle(i[0], i[1], i[2], "rgb(0, 128, 0)");
    };
  };
  
  //ctx.fillStyle = "black";
  //ctx.fillRect(posx, posy, 20, 20);

  if (infinite) {
    draw_circle(600, 300, 10, "rgb(255, 0, 0)");
  } else {
    draw_circle(posx, posy, 10, "rgb(255, 0, 0)");
  }

  requestAnimationFrame(loop);
}

window.addEventListener("beforeunload", () => running = false);

loop();
