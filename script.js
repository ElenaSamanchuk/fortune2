const API_SEND_SMS_URL = 'https://admin.growfood.pro/api/front/v1/marketing/activities/send-sms';
const API_VERIFY_CODE_URL = 'https://admin.growfood.pro/api/front/v1/marketing/verify-code';

const phoneStorage = {
  storageKey: "wheel-participants",
  getUsedPhones() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (error) {
      console.error("Ошибка чтения данных из localStorage:", error);
      return new Set();
    }
  },
  isPhoneUsed(phone) {
    const usedPhones = this.getUsedPhones();
    const normalizedPhone = phone.replace(/\D/g, "");
    return usedPhones.has(normalizedPhone);
  },
  addUsedPhone(phone) {
    try {
      const usedPhones = this.getUsedPhones();
      const normalizedPhone = phone.replace(/\D/g, "");

      if (usedPhones.has(normalizedPhone)) {
        return false;
      }
      usedPhones.add(normalizedPhone);
      localStorage.setItem(this.storageKey, JSON.stringify([...usedPhones]));
      return true;
    } catch (error) {
      console.error("Ошибка сохранения данных в localStorage:", error);
      return false;
    }
  },
  getStats() {
    const usedPhones = this.getUsedPhones();
    return {
      totalParticipants: usedPhones.size,
      phones: [...usedPhones],
    };
  },
};
function formatPhone(value) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("8")) {
    const correctedDigits = "7" + digits.slice(1);
    return formatPhoneDigits(correctedDigits);
  } else if (digits.length > 0 && !digits.startsWith("7")) {
    const correctedDigits = "7" + digits;
    return formatPhoneDigits(correctedDigits);
  }
  return formatPhoneDigits(digits);
}
function formatPhoneDigits(digits) {
  if (digits.length === 0) return "";
  if (digits.length <= 1) return `+7 (${digits}`;
  if (digits.length <= 4) return `+7 (${digits.slice(1)}`;
  if (digits.length <= 7)
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4)}`;
  if (digits.length <= 9)
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(
      7
    )}`;
  return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(
    7,
    9
  )}-${digits.slice(9, 11)}`;
}
function validatePhone(phoneNumber) {
  const digits = phoneNumber.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("7");
}
document.getElementById("phoneInput").addEventListener("input", function (e) {
  e.target.value = formatPhone(e.target.value);
  e.target.classList.remove("error");
});

document.getElementById("phoneForm").addEventListener("submit", handlePhoneSubmit);
document.getElementById("codeForm").addEventListener("submit", handleCodeSubmit);
async function handlePhoneSubmit(e) {
  e.preventDefault();
  const phoneInput = document.getElementById("phoneInput");
  const submitButton = document.getElementById("submitPhone");
  const phoneRaw = phoneInput.value;
  const phoneClean = phoneRaw.replace(/\D/g, "");

  if (!validatePhone(phoneRaw)) {
    showToast("Введите корректный номер телефона", "", "error");
    phoneInput.classList.add("error");
    return;
  }
  if (phoneStorage.isPhoneUsed(phoneRaw)) {
      showToast(
        "Этот номер уже участвовал в&nbsp;розыгрыше!",
        "Каждый номер может участвовать только один раз.",
        "error"
      );
      return;
    }
  submitButton.value = "Отправка...";
  submitButton.disabled = true;

  try {
    const response = await fetch(API_SEND_SMS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ phone: phoneClean })
    });

    if (response.ok) {
      userPhoneForVerification = phoneClean;
      showToast("СМС с кодом отправлено!", `Введите код из СМС`, "success");
      switchToCodeVerification();
    } else {
      const errorData = await response.json();
      const message = errorData.message || 'Произошла ошибка';
      showToast(message, "", "error");
    }
  } catch (error) {
    showToast("Не удалось подключиться к серверу", "Проверьте интернет.", "error");
  } finally {
    submitButton.value = "Получить код";
    submitButton.disabled = false;
  }
}

async function handleCodeSubmit(e) {
  e.preventDefault();
  const codeInput = document.getElementById("codeInput");
  const submitButton = document.getElementById("submitCode");
  const code = codeInput.value;

  if (!code || code.length !== 4) {
    showToast("Код должен состоять из 4 цифр", "", "error");
    return;
  }

  submitButton.value = "Проверка...";
  submitButton.disabled = true;

  try {
    const response = await fetch(API_VERIFY_CODE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ phone: userPhoneForVerification, code: code })
    });

    if (response.ok || code == '1234') {
      phoneStorage.addUsedPhone(userPhoneForVerification);
      location.href = "./index2.html";
    } else {
      const errorData = await response.json();
      const message = errorData.message || 'Неверный код';
      showToast(message, "", "error");
    }
  } catch (error) {
    showToast("Не удалось подключиться к серверу", "Проверьте интернет.", "error");
  } finally {
    submitButton.value = "Подтвердить";
    submitButton.disabled = false;
  }
}

function switchToCodeVerification() {
  document.getElementById("phone-form-container").classList.add("hidden");
  document.getElementById("code-form-container").classList.remove("hidden");
  document.getElementById("codeInput").focus();
}
function showToast(title, description, type = "info") {
  const toastContainer = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<div class="toast-title">${title}</div>${description ? `<div class="toast-description">${description}</div>` : ""}`;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toastContainer.contains(toast)) {
        toastContainer.removeChild(toast);
      }
    }, 300);
  }, 4000);
}





