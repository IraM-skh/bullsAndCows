// containers
const startContainer = document.querySelector(".start_container");
const gameLogContainer = document.querySelector(".game_log_container");
const sendVariantContainer = document.querySelector(".send_variant_container");
const gameSection = document.querySelector("#game_section");

//startContainer
const gameDifficultySelect = document.querySelector("#game_difficulty_select");
const startBtn = document.querySelector(".start_btn");

//gameLogContainer
const attemptNumber = document.querySelector(".attempt_number");
variantLog = Array.from(document.querySelectorAll(".variant_log"));
variantsUl = document.querySelector("#variants_ul");

//sendVariantContainer
const inputVariant = document.querySelector(".input_variant");
const allowedTypeNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const numbersBtn = Array.from(document.querySelectorAll(".numbers_btn"));
const sendVariantBtn = document.querySelector(".send_variant_btn");
let errorMessage = document.querySelector(".error_message");

let hiddenNumber = [0, 0, 0, 0].map((el) => Math.floor(Math.random() * 10));
console.log(hiddenNumber);

gameSection.addEventListener("click", (e) => {
  if (e.target === startBtn) {
    startGame();
    return;
  }

  if (numbersBtn.includes(e.target)) {
    addNumberToInput(e.target);
    return;
  }

  if (e.target.classList.contains("variant_log")) {
    console.log("d");
    changeBottomBorderVariant(e.target);
  }

  if (e.target === sendVariantBtn) {
    sendUserVariant(inputVariant.value);
  }
});

function startGame() {
  //show containers
  startContainer.classList.toggle("hidden");
  gameLogContainer.classList.toggle("hidden");
  sendVariantContainer.classList.toggle("hidden");
  //change numer of selected attempts
  attemptNumber.textContent = gameDifficultySelect.value;
  //
}

//при вставке контента проверять будем уже при нажатии на клавишу отправить, чтобы все было цифрами и ограничивалось 4 символами. Можно отсладить по типу события inouta создать новую переменную для того, нужна ли проверка

// добавить ввод данных при нажатии на кнопку

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
  errorMessage.textContent = "";
  if (inputValue.length != 4) {
    errorMessage.textContent = "Введите число из 4 цифр.";
  }
  if (!inputValue.match(/^\d+$/)) {
    errorMessage.textContent += " Допускается вводить только цифры от 0 до 9.";
  }
  if (inputValue.length == 4 && inputValue.match(/^\d+$/)) {
    const bull = hiddenNumber.filter((el, ind) => inputValue[ind] == el).length;
    const cow =
      hiddenNumber.filter((el) => inputValue.includes(el)).length - bull;

    variantsUl.insertAdjacentHTML(
      "beforeend",
      `<li id="variant"><span class="variant_log">${inputValue[0]}</span><span class="variant_log ">${inputValue[1]}</span><span class="variant_log ">${inputValue[2]}</span><span class="variant_log ">${inputValue[3]}</span> <span>${bull}Б</span> <span>${cow}К</span></li>`
    );
    inputVariant.value = "";
    attemptNumber.textContent -= 1;
    //Дописать, оповещение, что будет, когда число попыток дойдет до 0 вместе с загаданным числом. Добавтть кнопку сыграть заново. Добавть в это же оповещение собешение вы выиграли / проиграли
    // При 0 попыток блокировать отправку данных и инпут
  }
}

inputVariant.addEventListener("input", (e) => {
  if (e.inputType === "insertText" && allowedTypeNumbers.includes(e.data)) {
    //валидация на ввод не длиннее 4 цифр
    if (e.target.value.length > 4) {
      e.target.value = e.target.value.slice(0, e.target.value.length - 1);
    }
  } else if (e.inputType != "deleteContentBackward") {
    // валидация на все, кроме цифр и удаления

    e.target.value = e.target.value.slice(0, e.target.value.length - 1);
  }
});
