const clearBtn = document.querySelector(".form__clear");
const form = document.querySelector(".form");
const mortgageInput = document.querySelector("#mortgage-amount");
const interestInput = document.querySelector("#interest-rate");
const yearsInput = document.querySelector("#mortgage-term");
const formGroup = document.querySelectorAll(".form__group");
const mortgageTypeRadios = document.querySelectorAll(
  "input[name='mortgage-type']"
);
const monthlyRepayment = document.querySelector(".results__complete-monthly");
const totalRepayment = document.querySelector(".results__complete-full");
const showResults = document.querySelector(".results__complete");
const hideResultsPage = document.querySelector(".results__guide");

// Error message
const amountError = document.querySelector(".error__amount");
const interestError = document.querySelector(".error__rate");
const termError = document.querySelector(".error__term");
const typeError = document.querySelector(".error__type");

const getSelectedMortgageType = () => {
  let selectedType;
  mortgageTypeRadios.forEach((radio) => {
    if (radio.checked) {
      selectedType = radio.value;
    }
  });
  return selectedType;
};

// Form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Validate form
  if (!validateForm()) {
    return;
  }

  const mortgageAmount = parseFloat(mortgageInput.value);
  const interestRate = parseFloat(interestInput.value);
  const mortgageTerm = parseFloat(yearsInput.value);
  const mortgageType = getSelectedMortgageType();

  calculateMortgage(mortgageAmount, interestRate, mortgageTerm, mortgageType);
});

const validateForm = () => {
  const mortgageAmount = mortgageInput.value;
  const interestRate = interestInput.value;
  const mortgageTerm = yearsInput.value;
  const mortgageType = getSelectedMortgageType();

  if (!mortgageAmount) {
    amountError.textContent = "This field is required";
    formGroup[0].classList.add("error");
  } else if (mortgageAmount < 0) {
    amountError.textContent = "Please enter a positive number";
    formGroup[0].classList.add("error");
  } else {
    amountError.textContent = "";
    formGroup[0].classList.remove("error");
  }

  if (!mortgageTerm) {
    termError.textContent = "This field is required";
    formGroup[1].classList.add("error");
  } else if (mortgageTerm < 0) {
    termError.textContent = "Please enter a positive number";
    formGroup[1].classList.add("error");
  } else {
    termError.textContent = "";
    formGroup[1].classList.remove("error");
  }

  if (!interestRate) {
    interestError.textContent = "This field is required";
    formGroup[2].classList.add("error");
  } else if (interestRate < 0) {
    interestError.textContent = "Please enter a positive number";
    formGroup[2].classList.add("error");
  } else {
    interestError.textContent = "";
    formGroup[2].classList.remove("error");
  }

  if (!mortgageType) {
    typeError.textContent = "This field is required";
    formGroup[3].classList.add("error");
  } else {
    typeError.textContent = "";
    formGroup[3].classList.remove("error");
  }

  if (
    mortgageAmount &&
    mortgageAmount > 0 &&
    interestRate &&
    interestRate > 0 &&
    mortgageTerm &&
    mortgageTerm > 0 &&
    mortgageType
  ) {
    return true;
  }
};

// Types of mortgages= "Repayment" or "Interest-only"

// Calculate mortgage
const calculateMortgage = (
  mortgageAmount,
  interestRate,
  mortgageTerm,
  mortgageType
) => {
  let monthlyPayment;
  let totalPayment;
  let totalInterest;

  if (mortgageType === "repayment") {
    const monthlyInterestRate = interestRate / 12 / 100;
    const numberOfPayments = mortgageTerm * 12;
    monthlyPayment =
      (mortgageAmount * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    totalPayment = monthlyPayment * numberOfPayments;
    totalInterest = totalPayment - mortgageAmount;
  } else if (mortgageType === "interest-only") {
    monthlyPayment = mortgageAmount * (interestRate / 100 / 12);
    totalPayment = monthlyPayment * mortgageTerm * 12;
    totalInterest = totalPayment - mortgageAmount;
  }

  monthlyRepayment.textContent = `£ ${addCommas(monthlyPayment.toFixed(2))}`;
  totalRepayment.textContent = `£ ${addCommas(totalPayment.toFixed(2))}`;
  showResults.style.display = "block";
  hideResultsPage.style.display = "none";
};

// Clear form
clearBtn.addEventListener("click", () => {
  form.reset();
  formGroup.forEach((group) => {
    group.classList.remove("error");
  });
  amountError.textContent = "";
  interestError.textContent = "";
  termError.textContent = "";
  typeError.textContent = "";
  showResults.style.display = "none";
  hideResultsPage.style.display = "flex";
});

// Add commas to numbers for better readability
const addCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
