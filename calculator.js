// --- 1. QUẢN LÝ TRẠNG THÁI (STATE MANAGEMENT) ---
let firstOperand = "";
let secondOperand = "";
let currentOperator = null;
let shouldResetScreen = false;

// --- 2. CHỌN PHẦN TỬ DOM ---
const display = document.querySelector(".display");
const buttons = document.querySelectorAll(".btn");

// --- 3. BỘ MÁY TOÁN HỌC (MATH ENGINE) ---
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => (b === 0 ? "Nice try!" : a / b);

function operate(operator, a, b) {
  a = Number(a);
  b = Number(b);
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
    default:
      return null;
  }
}

// --- 4. CÁC HÀM XỬ LÝ LOGIC UI ---
function updateDisplay(value) {
  if (value === "Nice try!") {
    display.textContent = value;
    return;
  }
  // Làm tròn để không tràn màn hình và giới hạn 10 ký tự
  const rounded = Math.round(Number(value) * 1000000) / 1000000;
  display.textContent = rounded.toString().slice(0, 10);
}

function handleNumber(number) {
  // Reset màn hình nếu vừa bấm toán tử hoặc vừa có kết quả
  if (display.textContent === "0" || shouldResetScreen) {
    display.textContent = number;
    shouldResetScreen = false;
  } else {
    display.textContent += number;
  }
}

function handleOperator(nextOperator) {
  // Luồng xử lý "Chuỗi phép tính": tính cặp số cũ trước khi nhận toán tử mới
  if (currentOperator && !shouldResetScreen) {
    calculate();
  }
  firstOperand = display.textContent;
  currentOperator = nextOperator;
  shouldResetScreen = true;
}

function calculate() {
  // Ngăn chặn tính toán nếu thiếu dữ liệu
  if (currentOperator === null || shouldResetScreen) return;

  secondOperand = display.textContent;
  const result = operate(currentOperator, firstOperand, secondOperand);

  updateDisplay(result);

  // Cập nhật trạng thái cho phép tính tiếp theo
  firstOperand = display.textContent;
  currentOperator = null;
  shouldResetScreen = true;
}

function clear() {
  firstOperand = "";
  secondOperand = "";
  currentOperator = null;
  shouldResetScreen = false;
  display.textContent = "0";
}

// --- 5. GÁN SỰ KIỆN (EVENT LISTENERS) ---
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.id;

    // Phân loại xử lý dựa trên loại nút bấm
    if (button.classList.contains("btn-white") && !isNaN(id)) {
      handleNumber(id);
    } else if (id === ".") {
      // Chỉ cho phép một dấu chấm thập phân
      if (!display.textContent.includes(".")) handleNumber(".");
    } else if (button.classList.contains("btn-yellow") && id !== "equals") {
      handleOperator(id);
    } else if (id === "equals") {
      calculate();
    } else if (id === "clear") {
      clear();
    } else if (id === "backspace") {
      // Xóa một chữ số (Extra Credit)
      if (shouldResetScreen) return;
      display.textContent =
        display.textContent.length > 1 ? display.textContent.slice(0, -1) : "0";
    }
  });
});
