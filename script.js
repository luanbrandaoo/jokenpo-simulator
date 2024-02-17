var numberInput = document.getElementById('quantityRocks');

numberInput.addEventListener('change', function() {
    var maxValue = parseInt(this.getAttribute('max'));
    var enteredValue = parseInt(this.value);

    if (enteredValue > maxValue) {
        this.value = maxValue;
    }
});