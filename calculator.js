const display = document.getElementById("display");

let firstOperand = null;
let secondOperand = null;
let currentOperator = null;
let shouldResetScreen = false;

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) return "You can't divide by 0!";
  return a / b;
}

function roundResult(num) {
  if (typeof num !== "number") return num;
  return Number.isInteger(num) ? num : parseFloat(num.toFixed(6));
}

function operate(operator, a, b) {
  a = Number(a);
  b = Number(b);
  let result;
  switch (operator) {
    case "+":
      result = add(a, b);
      break;
    case "-":
      result = subtract(a, b);
      break;
    case "*":
      result = multiply(a, b);
      break;
    case "/":
      result = divide(a, b);
      break;
    default:
      return null;
  }
  if (typeof result === "number") return roundResult(result);
  return result;
}

function clearAll() {
  display.value = "0";
  firstOperand = null;
  secondOperand = null;
  currentOperator = null;
  shouldResetScreen = false;
}

function appendNumber(number) {
  if (display.value === "You can't divide by 0!") clearAll();
  if (shouldResetScreen) {
    display.value = number;
    shouldResetScreen = false;
  } else {
    display.value = display.value === "0" ? number : display.value + number;
  }
}

function appendDecimal() {
  if (shouldResetScreen) {
    display.value = "0.";
    shouldResetScreen = false;
    return;
  }
  if (!display.value.includes(".")) display.value = display.value + ".";
}

function setOperator(operator) {
  if (currentOperator && shouldResetScreen) {
    // Consecutive operator press: just replace operator
    currentOperator = operator;
    return;
  }

  if (firstOperand === null) {
    firstOperand = display.value;
  } else {
    // If there's an operator and a first operand, compute intermediate
    if (currentOperator !== null) {
      const result = operate(currentOperator, firstOperand, display.value);
      display.value = String(result);
      firstOperand = String(result);
    }
  }
  currentOperator = operator;
  shouldResetScreen = true;
}

function evaluate() {
  if (currentOperator === null || shouldResetScreen) return;
  secondOperand = display.value;
  const result = operate(currentOperator, firstOperand, secondOperand);
  display.value = String(result);
  firstOperand = String(result);
  currentOperator = null;
  shouldResetScreen = true;
}

// Wire up buttons
const keys = document.querySelectorAll(".calculator-keys button");
keys.forEach((key) => {
  const { value } = key;
  if (
    key.classList.contains("operator") &&
    !key.classList.contains("equal-sign")
  ) {
    key.addEventListener("click", () => setOperator(value));
  } else if (key.classList.contains("equal-sign")) {
    key.addEventListener("click", evaluate);
  } else if (key.classList.contains("all-clear")) {
    key.addEventListener("click", clearAll);
  } else if (key.classList.contains("decimal")) {
    key.addEventListener("click", appendDecimal);
  } else {
    key.addEventListener("click", () => appendNumber(value));
  }
});

// Initialize
if (!display.value) display.value = "0";
