var simulatordiv = document.querySelector('.simulatordiv');
var canvas = document.getElementById('simulator');
var ctx = canvas.getContext('2d');

var divWidth = simulatordiv.clientWidth;
var divHeight = simulatordiv.clientHeight;

canvas.width = divWidth;
canvas.height = divHeight;

var emojiSize = divWidth/16;

var emojis = [];
var animationId;
var speedInput = document.getElementById('speed');
var startButton = document.getElementById('startButton');
var stopButton = document.getElementById('stopButton');
var pauseButton = document.getElementById('pauseButton');
var paused = false;

var speed = speedInput.value/100

function createEmojis() {
    emojis = [];

    var quantityRocks = parseInt(document.getElementById('quantityRocks').value);
    var quantityPapers = parseInt(document.getElementById('quantityPapers').value);
    var quantityScissors = parseInt(document.getElementById('quantityScissors').value);

    createRandomEmojis(quantityRocks, 'rock');
    createRandomEmojis(quantityPapers, 'paper');
    createRandomEmojis(quantityScissors, 'scissors');
}

function createRandomEmojis(num, emoji) {
    for (var i = 0; i < num; i++) {
        var x = Math.random() * (canvas.width - emojiSize);
        var y = Math.random() * (canvas.height - emojiSize);
        var angle = Math.random() * Math.PI * 2;
        var dx = Math.cos(angle) * speed;
        var dy = Math.sin(angle) * speed;

        emojis.push({ type: emoji, x: x, y: y, dx: dx, dy: dy });
    }
}

function drawEmojis() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${emojiSize}px serif`;
    emojis.forEach(function(emoji) {
        switch (emoji.type) {
            case 'rock':
                ctx.fillText("🪨", emoji.x, emoji.y);
                break;
            case 'paper':
                ctx.fillText("📜", emoji.x, emoji.y);
                break;
            case 'scissors':
                ctx.fillText("✌️", emoji.x, emoji.y);
                break;
        }
    });
}

function animateEmojis() {
    if (!paused) {
        emojis.forEach(function(emoji) {
            emoji.x += emoji.dx;
            emoji.y += emoji.dy;

            if (emoji.x + emojiSize > canvas.width || emoji.x < 0) {
                emoji.dx = -emoji.dx;
            }
            if (emoji.y > canvas.height || emoji.y - emojiSize < 0) {
                emoji.dy = -emoji.dy;
            }
        });

        checkCollision();
        drawEmojis();
        animationId = requestAnimationFrame(animateEmojis);
    }
}

function checkCollision() {
    emojis.forEach(function(emoji, index) {
        for (var i = index + 1; i < emojis.length; i++) {
            var otherEmoji = emojis[i];
            if (
                emoji.x < otherEmoji.x + emojiSize &&
                emoji.x + emojiSize > otherEmoji.x &&
                emoji.y < otherEmoji.y + emojiSize &&
                emoji.y + emojiSize > otherEmoji.y
            ) {
                var tempDx = emoji.dx;
                var tempDy = emoji.dy;
                emoji.dx = otherEmoji.dx;
                emoji.dy = otherEmoji.dy;
                otherEmoji.dx = tempDx;
                otherEmoji.dy = tempDy;

                if ((emoji.type === 'rock' && otherEmoji.type === 'scissors') ||
                    (emoji.type === 'paper' && otherEmoji.type === 'rock') ||
                    (emoji.type === 'scissors' && otherEmoji.type === 'paper')) {
                    otherEmoji.type = emoji.type;
                } else if ((emoji.type === 'scissors' && otherEmoji.type === 'rock') ||
                    (emoji.type === 'paper' && otherEmoji.type === 'scissors') ||
                    (emoji.type === 'rock' && otherEmoji.type === 'paper')) {
                    emoji.type = otherEmoji.type;
                }
            }
        }
    });
}

function startAnimation() {
    stopAnimation();
    createEmojis();
    animateEmojis();
    startButton.style.display = 'none';
    stopButton.style.display = 'inline';
    pauseButton.style.display = 'inline';
    paused = false;
}

function stopAnimation() {
    cancelAnimationFrame(animationId);
    animationId = null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    startButton.style.display = 'inline';
    stopButton.style.display = 'none';
    pauseButton.style.display = 'none';
}

function pauseAnimation() {
    paused = true;
    pauseButton.innerHTML = '<i class="fas fa-play"></i>';
}

function continueAnimation() {
    paused = false;
    pauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    animateEmojis();
}

document.getElementById('startButton').addEventListener('click', startAnimation);
document.getElementById('stopButton').addEventListener('click', stopAnimation);
document.getElementById('pauseButton').addEventListener('click', function() {
    if (paused) {
        continueAnimation();
    } else {
        pauseAnimation();
    }
});

speedInput.addEventListener('input', function() {
    speed = speedInput.value/100
    emojis.forEach(function(emoji) {
        var angle = Math.atan2(emoji.dy, emoji.dx);
        emoji.dx = Math.cos(angle) * speed;
        emoji.dy = Math.sin(angle) * speed;
    });
});

function disableResponsiveness() {
    var elements = document.querySelectorAll('*');
    
    elements.forEach(function(element) {
        var style = getComputedStyle(element);
        
        if (style.width !== 'auto') {
            element.style.width = style.width;
        }
        if (style.height !== 'auto') {
            element.style.height = style.height;
        }
        
        if (style.position !== 'static') {
            element.style.position = 'absolute';
            
            if (style.top !== 'auto') {
                element.style.top = style.top;
            }
            if (style.left !== 'auto') {
                element.style.left = style.left;
            }
            if (style.bottom !== 'auto') {
                element.style.bottom = style.bottom;
            }
            if (style.right !== 'auto') {
                element.style.right = style.right;
            }
        }
        
        if (style.fontSize !== 'medium') {
            element.style.fontSize = style.fontSize;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    disableResponsiveness();
});