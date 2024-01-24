// containers
const startContainer = document.querySelector(".start_container");
const gameLogContainer = document.querySelector(".game_log_container");

const gameSection = document.querySelector("#game_section");
const overlayModal = document.querySelector(".overlay_modal");
const modalEndGame = document.querySelector(".modal_end_game");

//startContainer
const gameDifficultySelect = document.querySelector("#game_difficulty_select");
const startBtn = document.querySelector(".start_btn");

//gameLogContainer
const attemptNumber = document.querySelector(".attempt_number");
variantLog = Array.from(document.querySelectorAll(".variant_log"));
variantsUl = document.querySelector("#variants_ul");

//sendVariant
const inputVariant = document.querySelector(".input_variant");
const allowedTypeNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const numbersBtn = Array.from(document.querySelectorAll(".numbers_btn"));
const sendVariantBtn = document.querySelector(".send_variant_btn");
const errorMessage = document.querySelector(".error_message");

//ModalContainer
const congratsMessage = document.querySelector(".congrats_message");
const lossMessage = document.querySelector(".loss_message");
const hiddenNumberMessage = document.querySelector(".hidden_number_message");
const startNewGameBtn = Array.from(
  document.querySelectorAll(".start_new_game_btn")
);
const closeModalBtn = document.querySelector(".close_modal_btn");
let numberOfVariant = 0;
let currentHiddenDigit = [];
const hiddenNumber = [...new Array(4)].map(() => {
  let i = 0;
  while (i < 1) {
    let generateDigit = Math.floor(Math.random() * 10);
    if (!currentHiddenDigit.includes(generateDigit)) {
      currentHiddenDigit.push(generateDigit);
      i += 1;
      return generateDigit;
    }
  }
});

console.log(hiddenNumber);

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !inputVariant.classList.contains("hidden")) {
    sendUserVariant(inputVariant.value);
  }
});

gameSection.addEventListener("click", (e) => {
  if (e.target === startBtn) {
    startGame();
    inputVariant.focus();
    return;
  }
  if (numbersBtn.includes(e.target)) {
    addNumberToInput(e.target);
    return;
  }
  if (e.target.classList.contains("variant_log")) {
    changeBottomBorderVariant(e.target);
  }
  if (e.target === sendVariantBtn) {
    sendUserVariant(inputVariant.value);
  }
  if (e.target === closeModalBtn) {
    hideModal();
  }
  if (e.target.classList.contains("start_new_game_btn")) {
    if (e.target.classList.contains("modal")) {
      hideModal();
    }
    const newHiddenNumber = [...new Array(4)].map(() =>
      Math.floor(Math.random() * 10)
    );
    hiddenNumber.splice(0, 4, ...newHiddenNumber);
    console.log(hiddenNumber);

    toggleHiddenBntNewGame();
    variantsUl.innerHTML = "";
    hiddenNumberMessage.textContent = hiddenNumberMessage.textContent.slice(
      0,
      -5
    );
    congratsMessage.classList.remove("hidden");
    lossMessage.classList.remove("hidden");
    startContainer.classList.toggle("hidden");
    gameLogContainer.classList.toggle("hidden");
  }
});

function startGame() {
  //show containers
  startContainer.classList.toggle("hidden");
  gameLogContainer.classList.toggle("hidden");
  //change numer of selected attempts
  attemptNumber.textContent = gameDifficultySelect.value;
}

function addNumberToInput(btn) {
  if (inputVariant.value.length <= 3) {
    inputVariant.value += btn.textContent;
  }
}

function changeBottomBorderVariant(variantEl) {
  if (variantEl.classList.length === 1) {
    variantEl.classList.add("cow");
    return;
  }
  if (variantEl.classList.contains("cow")) {
    variantEl.classList.toggle("cow");
    variantEl.classList.toggle("bull");
    return;
  }
  if (variantEl.classList.contains("bull")) {
    variantEl.classList.remove("bull");
    return;
  }
}

function sendUserVariant(inputValue) {
  if (attemptNumber.textContent == 0) {
    errorMessage.classList.remove("hidden");
    errorMessage.textContent =
      "Вы исчерпали все попытки. Можете начать игру заново.";
    return;
  }
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
  if (inputValue.length != 4) {
    errorMessage.classList.remove("hidden");
    errorMessage.textContent = "Введите число из 4 цифр.";
  }
  if (!inputValue.match(/^\d+$/)) {
    errorMessage.classList.remove("hidden");
    errorMessage.textContent += " Допускается вводить только цифры от 0 до 9.";
  }

  if (inputValue.length == 4 && inputValue.match(/^\d+$/)) {
    const bull = hiddenNumber.filter((el, ind) => inputValue[ind] == el).length;
    const cow =
      inputValue.split("").filter((el) => hiddenNumber.includes(Number(el)))
        .length - bull;
    numberOfVariant += 1;
    variantsUl.insertAdjacentHTML(
      "beforeend",
      `<li id="variant_${numberOfVariant}"><span class="variant_log">${inputValue[0]}</span><span class="variant_log ">${inputValue[1]}</span><span class="variant_log ">${inputValue[2]}</span><span class="variant_log ">${inputValue[3]}</span> <span>${bull}Б</span> <span>${cow}К</span></li>`
    );

    attemptNumber.textContent -= 1;
    scrollToLastVariant();
    if (attemptNumber.textContent == 0) {
      loseGameOnlimitAttempts();
      inputVariant.value = "";
      return;
    }

    if (inputVariant.value === hiddenNumber.join("")) {
      winGame();
      inputVariant.value = "";
      return;
    }

    inputVariant.value = "";
    inputVariant.focus();
  }
}

function loseGameOnlimitAttempts() {
  showHiddenModal();
  toggleHiddenBntNewGame();
  congratsMessage.classList.add("hidden");
  hiddenNumberMessage.textContent += " " + hiddenNumber.join("");
}

function winGame() {
  showHiddenModal();
  toggleHiddenBntNewGame();
  lossMessage.classList.add("hidden");
  hiddenNumberMessage.textContent += " " + hiddenNumber.join("");
}

function toggleHiddenBntNewGame() {
  inputVariant.classList.toggle("hidden");
  sendVariantBtn.classList.toggle("hidden");
  startNewGameBtn
    .find((el) => !el.classList.contains("modal"))
    .classList.toggle("hidden");
}
function showHiddenModal() {
  overlayModal.classList.remove("hidden");
  modalEndGame.classList.remove("hidden");
}

function hideModal() {
  overlayModal.classList.add("hidden");
  modalEndGame.classList.add("hidden");
}

function scrollToLastVariant() {
  variantsUl.scrollBy({
    left: 0,
    top: document.querySelector(`#variant_${numberOfVariant}`).offsetHeight + 1,
    behavior: "smooth",
  });
}
inputVariant.addEventListener("input", (e) => {
  if (e.inputType === "insertText" && allowedTypeNumbers.includes(e.data)) {
    if (e.target.value.length > 4) {
      e.target.value = e.target.value.slice(0, e.target.value.length - 1);
    }
  } else if (e.inputType != "deleteContentBackward") {
    e.target.value = e.target.value.slice(0, e.target.value.length - 1);
  }
});
