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
                    handleDecimal(button);
                    break;
                case button.classList.contains("sign"):
                    handleSign();
                    break;
                case button.classList.contains("percent"):
                    handlePercentage();
                    break;
            }
        });
    });

    function formatDisplay(number) {
        const maxLength = 11;
        let formattedNumber = number.toString();

        if (formattedNumber.length > maxLength) {
            // Check if it's a decimal number
            if (formattedNumber.includes('.')) {
                // For decimal numbers, truncate with ellipsis
                formattedNumber = formattedNumber.slice(0, maxLength - 1) + '…';
            } else {
                // For large integers, use exponential notation
                formattedNumber = Number(number).toExponential(4); // 4 decimal places: 1.2345e+8
            }
        }

        // Double check length after formatting
        if (formattedNumber.length > maxLength) {
            formattedNumber = formattedNumber.slice(0, maxLength - 1) + '…';
        }

        return formattedNumber;
    }

    function handleNumber(button) {
        // Don't allow more than 10 digits (to leave room for negative sign)
        if (currentNumber.replace(/[.-]/g, '').length >= 10) {
            return; // Don't add more digits
        }

        if (currentNumber === '0') {
            currentNumber = button.value;
        } else {
            currentNumber += button.value;
        }

        currentDisplay.textContent = formatDisplay(currentNumber);
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

    function handleSign() {
        if (currentNumber === '' || currentNumber === '0') return;
        currentNumber = (Number(currentNumber) * -1).toString();
        currentDisplay.textContent = currentNumber;
    }

    function handlePercentage() {
        if (currentNumber === '' || currentNumber === '0') return;
        currentNumber = (Number(currentNumber) / 100).toString();
        currentDisplay.textContent = currentNumber;
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
                if (num2 === 0) {
                    handleZeroDivide();
                    return;
                }
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

        console.log("Result: ", result)

        currentDisplay.textContent = formatDisplay(result);
        previousDisplay.textContent = `${formatDisplay(num1)} ${operator} ${formatDisplay(num2)}`;
        currentNumber = result.toString();
        previousNumber = '';
        operator = '';
        newCompute = true;
    }

    function handleZeroDivide() {
        currentDisplay.textContent = "lmao";
        previousDisplay.textContent = "";
        currentNumber = '0';
        previousNumber = '';
        operator = '';
        newCompute = true;
    }

    function handleDecimal(button) {
        if (!currentNumber.includes('.')) {
            if (currentNumber === '') {
                currentNumber = '0';
            }
            currentNumber += '.';
            currentDisplay.textContent = currentNumber;
        } else {
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

    document.addEventListener('keydown', (event) => {
        event.preventDefault();

        // Number keys (0-9)
        if (/^\d$/.test(event.key)) {
            const button = document.querySelector(`button[value="${event.key}"]`);
            if (button) button.click();
        }

        // Operators
        switch (event.key) {
            case '+':
            case '-':
            case '*':
            case '/':
                const operatorButton = document.querySelector(`button[value="${event.key}"]`);
                if (operatorButton) operatorButton.click();
                break;
            case 'Enter':
                const equalButton = document.querySelector('button.equal');
                if (equalButton) equalButton.click();
                break;
            case '.':
                const decimalButton = document.querySelector('button.decimal');
                if (decimalButton) decimalButton.click();
                break;
            case 'Escape':
                const clearButton = document.querySelector('button.clear');
                if (clearButton) clearButton.click();
                break;
            case '%':
                const percentButton = document.querySelector('button.percent');
                if (percentButton) percentButton.click();
                break;
        }

        // Add visual feedback
        const button = document.querySelector(`button[data-key="${event.keyCode}"]`);
        if (button) {
            button.classList.add('active');
        }
    });

    document.addEventListener('keyup', (event) => {
        const button = document.querySelector(`button[data-key="${event.keyCode}"]`);
        if (button) {
            button.classList.remove('active');
        }
    });
});
