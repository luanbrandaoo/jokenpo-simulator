var canvas = document.getElementById('simulator');
var ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 600;

var emojiSize = 30;

var emojis = [];
var animationId;
var speedInput = document.getElementById('speed');
var startButton = document.getElementById('startButton');
var stopButton = document.getElementById('stopButton');
var pauseButton = document.getElementById('pauseButton');
var paused = false;

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
        var dx = Math.cos(angle) * speedInput.value;
        var dy = Math.sin(angle) * speedInput.value;

        emojis.push({ type: emoji, x: x, y: y, dx: dx, dy: dy });
    }
}

function drawEmojis() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "40px serif";
    emojis.forEach(function(emoji) {
        switch (emoji.type) {
            case 'rock':
                ctx.fillText("🪨", emoji.x, emoji.y);
                break;
            case 'paper':
                ctx.fillText("📜", emoji.x, emoji.y);
                break;
            case 'scissors':
                ctx.fillText("✂️", emoji.x, emoji.y);
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
            if (emoji.y + emojiSize > canvas.height || emoji.y < 0) {
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
    pauseButton.textContent = 'Continue';
}

function continueAnimation() {
    paused = false;
    pauseButton.textContent = 'Pause';
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
    document.getElementById('currentSpeed').textContent = this.value;
    emojis.forEach(function(emoji) {
        var angle = Math.atan2(emoji.dy, emoji.dx);
        emoji.dx = Math.cos(angle) * speedInput.value;
        emoji.dy = Math.sin(angle) * speedInput.value;
    });
});
