var quantityRocks = document.getElementById('quantityRocks');
var quantityPapers = document.getElementById('quantityPapers');
var quantityScissors = document.getElementById('quantityScissors');

quantityRocks.addEventListener('change', function() {
    var maxValue = parseInt(this.getAttribute('max'));
    var enteredValue = parseInt(this.value);

    if (enteredValue > maxValue) {
        this.value = maxValue;
    }
});

quantityPapers.addEventListener('change', function() {
    var maxValue = parseInt(this.getAttribute('max'));
    var enteredValue = parseInt(this.value);

    if (enteredValue > maxValue) {
        this.value = maxValue;
    }
});

quantityScissors.addEventListener('change', function() {
    var maxValue = parseInt(this.getAttribute('max'));
    var enteredValue = parseInt(this.value);

    if (enteredValue > maxValue) {
        this.value = maxValue;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    disableResponsiveness();
    if (!navigator.userAgent.includes("Chrome") && !navigator.userAgent.includes("Chromium")) {
        alert("This page has not been fully tested on non-Chromium-based browsers. Some bugs (mainly in the UI) may appear. We recommend using Chrome for a better experience.");
    }
});

