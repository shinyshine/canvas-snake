const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");

class Rect {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }

    draw() {
        context.beginPath();
        context.fillStyle = this.color;
        context.rect(this.x, this.y, this.w, this.h);
        context.fill();
        context.stroke();
    }
}

class Snake {
    constructor() {
        let snakeArray = [];

        for(let i = 0; i < 4; i ++) {
            let rect = new Rect(i * 20, 0, 20, 20, 'gray');
            snakeArray.splice(0, 0, rect);
        }

        let head = snakeArray[0];
        head.color = "red";

        this.head = snakeArray[0];
        this.snakeArray = snakeArray;

        // 给定初始位置向右（同keyCode右箭头）
        this.direction = 39;
    }

    draw() {
        for(let i = 0; i < this.snakeArray.length; i ++) {
            this.snakeArray[i].draw();
        }
    }

    move() {
        // 1. 画一个灰色的方块，位置与蛇头重叠
        // 2. 将这个方块插到数组中蛇头后面一个的位置
        // 3. 砍去末尾的方块
        // 4. 将蛇头向设定的方向移动一个

        let rect = new Rect(this.head.x, this.head.y, this.head.w, this.head.h, 'gray');
        this.snakeArray.splice(1, 0, rect);

        // 判断是否迟到食物了
        // 吃到则食物重新给位置

        if(isEat()) {
            food = new getRandomFood();
        } else {
            this.snakeArray.pop();
        }

        // 设置蛇头的运动方向，37 左，38 上，39 右，40 下
        switch(this.direction) {
            case 37:
                this.head.x -= this.head.w;
                break;
            case 38:
                this.head.y -= this.head.h;
                break;
            case 39:
                this.head.x += this.head.w;
                break;
            case 40:
                this.head.y += this.head.h;
                break;
            default:
                break;
        }

        // gameover判定
        // 撞墙
        if(this.head.x >= canvas.width || this.head.x < 0 || this.head.y >= canvas.height || this.head.y < 0) {
            clearInterval(timer);
        }

        // 撞自己
        for(let i = 1; i < this.snakeArray.length; i ++) {
            if(this.snakeArray[i].x == this.head.x && this.snakeArray[i].y == this.head.y) {
                clearInterval(timer);
            }
        }

    }
}


function getNumberInRange(min, max) {
    let range = max - min;
    let r = Math.random();

    return Math.round(r * range + min);
}
// 构建食物对象
function getRandomFood() {
    let isOnSnake = true;

    while(isOnSnake) {
        isOnSnake = false;
        
        let indexX = getNumberInRange(0, canvas.width / 20 - 1);
        let indexY = getNumberInRange(0, canvas.height/ 20 - 1);

        var rect = new Rect(indexX * 20, indexY * 20, 20, 20, 'green');

        for(let i = 0; i < snake.snakeArray.length; i ++) {
            if(snake.snakeArray[i].x == rect.x && snake.snakeArray[i].y == rect.y) {
                // 如果判定重合，将其设置为true，使随机数重给
                isOnSnake = true;
                break;
            }
        }
    }
    return rect;
}

function isEat() {
    if(snake.head.x == food.x && snake.head.y === food.y) {
        return true;
    } else {
        return false;
    }
}

document.onkeydown = function(e) {
    let ev = e || window.event;
    switch(ev.keyCode) {
        case 37:
            {
                if (snake.direction !== 39) {
                    snake.direction = 37;
                }
                break;
            }
        case 38:
            {
                if (snake.direction !== 40) {
                    snake.direction = 38;
                }
                break;
            }

        case 39:
            {
                if (snake.direction !== 37) {
                    snake.direction = 39;
                }
                break;
            }
        case 40:
            {
                if(snake.direction !== 38) {
                    snake.direction = 40;
                }
                break;
            }
    }
    ev.preventDefault();
}


// 画出初始的蛇
let snake = new Snake();
snake.draw();

// 画出初始的食物
let food = new getRandomFood();

//定时器
var timer = setInterval(function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    food.draw();
    snake.move();
    snake.draw();
}, 100)