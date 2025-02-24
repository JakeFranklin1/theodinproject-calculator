document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const currentDisplay = document.getElementById('current-display');
    const previousDisplay = document.getElementById('previous-display');
    const buttons = document.querySelectorAll('button');

    // Initialize display
    currentDisplay.textContent = '0';
    previousDisplay.textContent = '';
    let currentNumber = '0';
    let previousNumber = '';
    let operator = '';
    let result = '';
    let newCompute = false;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            console.log(`Button clicked: ${button.value}`);

            checkIfNew();
            switch (true) {
                case button.classList.contains("operand"):
                    handleNumber(button);
                    break;
                case button.classList.contains("operator"):
                    handleOperator(button);
                    break;
                case button.classList.contains("clear"):
                    clear();
                    break;
                case button.classList.contains("equal"):
                    compute(Number(previousNumber), Number(currentNumber));
                    break;
                case button.classList.contains("decimal"):
                    handleDecimal(button)
                    break;
            }
        });
    });

    function handleNumber(button) {
        if (currentNumber === '0') {
            currentNumber = button.value;
        } else if (currentNumber !== '0' && currentNumber.length <= 10) {
            currentNumber += button.value;
        } else {
            console.log('max reached');
        }
        currentDisplay.textContent = currentNumber;
        num1 = Number(currentNumber);
    }

    function handleOperator(button) {

        operator = button.value;

        if (!previousNumber) {
            console.log("No prev number: ", previousNumber, currentNumber)
            previousNumber = currentNumber;
            currentNumber = '';
            previousDisplay.textContent = previousNumber + ' ' + operator;
            currentDisplay.textContent = '0';
            return;
        }
    }

      function compute(num1, num2) {
        if (!previousNumber) {
            return;
        }

        switch(operator) {
            case '*':
                result = num1 * num2;
                break;
            case '/':
                result = num1 / num2;
                break;
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
        }

        // Handle decimal points with more precision
        if (!Number.isInteger(result)) {
            result = parseFloat(result.toFixed(8));
            result = parseFloat(result);
        }

        currentDisplay.textContent = result.toString();
        previousDisplay.textContent = `${num1} ${operator} ${num2}`;
        currentNumber = result.toString();
        previousNumber = '';
        operator = '';
        newCompute = true;
    }

    function handleDecimal(button) {

        if (!currentNumber.includes('.')) {
            if (currentNumber === '0') {
                currentNumber = '0' + button.value;
            } else if (currentNumber !== '0' && currentNumber.length <= 10) {
                currentNumber += button.value;
            } else {
                console.log('max reached');
            }
            currentDisplay.textContent = currentNumber;
            num1 = Number(currentNumber);
        }
        else {
            console.log("Already contains decimal.")
        }
    }



    function checkIfNew() {
        if (newCompute) {
            newCompute = false;
            previousDisplay.textContent = '';
            currentDisplay.textContent = 0;
        }
    }

    function clear() {
        previousDisplay.textContent = '';
        currentDisplay.textContent = 0;
        currentNumber = '0';
        previousNumber = '';
        operator = '';
        console.log("Cleared.")
    }

    // Add keyboard support with visual feedback
    document.addEventListener('keydown', (event) => {
        const button = document.querySelector(`button[data-key="${event.keyCode}"]`);
        if (button) {
            // Add active class to simulate press effect
            button.classList.add('active');
            button.click();
        }
    });

    document.addEventListener('keyup', (event) => {
        const button = document.querySelector(`button[data-key="${event.keyCode}"]`);
        if (button) {
            // Remove active class when key is released
            button.classList.remove('active');
        }
    });
});
