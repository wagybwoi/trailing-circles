let canvas,
    ctx,
    gridColumns = 200,
    gridRows = 200,
    grid = Array(gridColumns),
    minLineCount = 10,
    maxLineCount = 2000,
    lineCount = 500,
    lines = Array(lineCount),
    overlayBar = document.getElementById("overlayBar"),
    lineCountText = document.getElementById("lineCountText"),
    fadeTimeout;

const palettes = [
    {
        background: "#F1EAD1",
        foreground: [
            "#F8BF39",
            "#28B799",
            "#333741",
            "#D75749"
        ]
    },
    {
        background: "#E5BDBC",
        foreground: [
            "#3FB8AF",
            "#7FC7AF",
            "#DAD8A7",
            "#FF3D7F"
        ]
    },
    {
        background: "#1B1D26",
        foreground: [
            "#425955",
            "#778C7A",
            "#F1F2D8",
            "#BFBD9F"
        ]
    },
    {
        background: "#2D112C",
        foreground: [
            "#530031",
            "#820233",
            "#CA293E",
            "#EF4339",
            "#290F28"
        ]
    },
    {
        background: "#00262B",
        foreground: [
            "#004242",
            "#005951",
            "#00735D",
            "#028C64"
        ]
    },
    {
        background: "#D23600",
        foreground: [
            "#EE8900",
            "#DE6D00",
            "#D95100",
            "#FCA600"
        ]
    }
];

function setup() {
    if(!canvas) {
        // canvas = createCanvas(window.innerWidth, window.innerHeight);
        canvas = document.getElementById("trailCanvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx = canvas.getContext("2d");
    }

    grid = Array(gridColumns);
    lines = Array(lineCount);

    // Create grid
    grid = grid.fill(Array(gridColumns)).map((el, idxCol) => {
        return el.fill(Array(gridRows)).map((el, idxRow) => {
            return {
                x: idxCol * (window.innerWidth / (gridColumns - 1)) * 2 - (window.innerWidth/2),
                y: idxRow * (window.innerHeight / (gridRows - 1)) * 2 - (window.innerHeight/2)
            };
        });
    });

    // Choose color palette
    colors = palettes[Math.floor(Math.random()*palettes.length)];

    // Create lines
    lines = lines.fill().map((el, i) => {
        const randomGridPoints = {
            col: Math.floor(Math.random() * gridColumns),
            row: Math.floor(Math.random() * gridRows)
        };
        const gridPointRef = grid[randomGridPoints.col][randomGridPoints.row];
        let newLine = new Line(
            gridPointRef.x,
            gridPointRef.y,
            randomGridPoints.col,
            randomGridPoints.row,
            (lineCount/i),
            colors.foreground[Math.random()*colors.foreground.length|0]
        );
        return newLine;
    });

    // let splitArrays = {
    //     0: [],
    //     1: [],
    //     2: [],
    //     3: []
    // };
    // lines.map((el) => {
    //     splitArrays[colors.foreground.indexOf(el.strokeColor)].push(el);
    // });
    // lines = splitArrays[0].concat(splitArrays[1].concat(splitArrays[2].concat(splitArrays[3])));

    ctx.lineCap = "round";
}

function draw() {
    // background("#F1EAD1");
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // drawGrid();
    // drawLines();
    drawLinesCanvas();
}

const drawGrid = () => {
    strokeWeight(1);
    stroke(255, 0, 0);

    grid.map(el => {
        el.map(el => {
            point(el.x, el.y);
        });
        return;
    });
};

// const drawLines = () => {
//     lines.forEach( (el, i) => {
//         strokeWeight(el.strokeWeight);
//         stroke(el.strokeColor);

//         // If not moving, set a target
//         if(!el.moving && !el.set) {
//             setTimeout(() => {
//                 // let distance = Math.floor(Math.random()*0);
//                 let horizontal = [0,1][Math.random()*2|0];
//                 let sign = [-1,1][Math.random()*2|0];
                
//                 let nextGridCol = el.gridColumnIndex+(horizontal?1:0)*distance*sign;
//                 let nextGridRow = el.gridRowIndex+(!horizontal?1:0)*distance*sign;
                
//                 while(
//                     grid[nextGridCol] == undefined ||
//                     grid[nextGridCol][nextGridRow] == undefined
//                 ) {
//                     horizontal = [0,1,2,3,4,5][Math.random()*2|0];
//                     sign = [-1,1][Math.random()*2|0];
                
//                     nextGridCol = el.gridColumnIndex+(horizontal?1:0)*distance*sign;
//                     nextGridRow = el.gridRowIndex+(!horizontal?1:0)*distance*sign;
//                 }
                
//                 const newGridPoint = grid[nextGridCol][nextGridRow];
//                 el.gridColumnIndex = nextGridCol;
//                 el.gridRowIndex = nextGridRow;

//                 el.SetTarget(createVector(newGridPoint.x, newGridPoint.y), Math.random()*5)
//             }, 1000);
//             el.set = true;
//         };

//         // Move line
//         el.Move();

//         // Draw line
//         let trail = createVector().sub(el.velocity.copy());
//         trail.mult(el.length);
//         /*if(el.length >= 1)*/ line(
//             el.position.x,
//             el.position.y,
//             el.position.x + trail.x,
//             el.position.y + trail.y
//         );

//         return;
//     });
// };

const drawLinesCanvas = () => {
    lines.forEach( (el, i) => {
        ctx.beginPath();
        ctx.strokeStyle = el.strokeColor;
        ctx.lineWidth = el.strokeWeight;

        // If not moving, set a target
        if(!el.moving && !el.set) {
            setTimeout(() => {
                let distance = Math.floor(Math.random()*(gridColumns/4));
                let horizontal = [0,1][Math.random()*2|0];
                let sign = [-1,1][Math.random()*2|0];
                
                let nextGridCol = el.gridColumnIndex+(horizontal?1:0)*distance*sign;
                let nextGridRow = el.gridRowIndex+(!horizontal?1:0)*distance*sign;
                
                while(
                    grid[nextGridCol] == undefined ||
                    grid[nextGridCol][nextGridRow] == undefined
                ) {
                    horizontal = [0,1,2,3,4,5][Math.random()*2|0];
                    sign = [-1,1][Math.random()*2|0];
                
                    nextGridCol = el.gridColumnIndex+(horizontal?1:0)*distance*sign;
                    nextGridRow = el.gridRowIndex+(!horizontal?1:0)*distance*sign;
                }
                
                const newGridPoint = grid[nextGridCol][nextGridRow];
                el.gridColumnIndex = nextGridCol;
                el.gridRowIndex = nextGridRow;
                
                el.SetTarget(createVector(newGridPoint.x, newGridPoint.y), Math.random()*5)
            }, 1000);
            el.set = true;
        };

        // Move line
        el.Move();

        // Draw line
        const trail = createVector().sub(el.velocity.copy());
        trail.mult(el.length);
        ctx.moveTo(el.position.x, el.position.y);
        ctx.lineTo(el.position.x + trail.x, el.position.y + trail.y);

        ctx.stroke();
    });
};

function windowResized() {
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    setup();
}

function Line(posX, posY, gridColumnIndex, gridRowIndex, weight, color) {
    this.gridColumnIndex = gridColumnIndex;
    this.gridRowIndex = gridRowIndex;

    this.position = createVector(posX, posY);
    this.velocity = createVector(0, 0);
    this.target = createVector(posX, posY);

    this.moving = false;
    this.set = false;

    this.speed = 0;
    this.currentSpeed = 0;
    this.length = 0;

    this.strokeWeight = weight;
    this.strokeColor = color;

    this.SetTarget = (target, speed) => {
        this.target = target.copy();
        this.speed = speed;
        this.velocity = this.target.copy().sub(this.position).normalize()/*.mult(speed)*/;
        
        this.moving = true;
    };
    
    this.Move = () => {
        if (this.moving) {
            if(this.position.dist(this.target) <= this.speed) {
                this.position = this.target.copy();
                this.moving = false;
                this.set = false;
                this.currentSpeed = 0;
            } else {
                this.currentSpeed = this.currentSpeed + 0.05*(this.speed - this.currentSpeed);
                this.position.add(this.velocity.copy().mult(this.currentSpeed));
                this.length += this.currentSpeed;
            }
        }
        this.length *= 0.9;
    };
}

const resetScene = amount => {
    noLoop();
    overlayBar.classList.add("visible");
    const lerpedVal = minLineCount + (amount/window.innerWidth)*(maxLineCount - minLineCount);
    overlayBar.style.width = amount;
    lineCount = lineCountText.innerHTML = Math.min(Math.max(lerpedVal|0, minLineCount), maxLineCount);
};

function touchStarted() {
    resetScene(mouseX);
}

function touchMoved() {
    resetScene(mouseX);
}

function touchEnded() {
    clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => {overlayBar.classList.remove("visible");}, 500);
    loop();
    setup();
}

function mousePressed() {
    resetScene(mouseX);
}

function mouseDragged() {
    resetScene(mouseX);
}

function mouseReleased() {
    clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => {overlayBar.classList.remove("visible");}, 500);
    loop();
    setup();
}