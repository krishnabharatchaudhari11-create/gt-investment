// ====== QR Code Generator and Display ======
const qrContainer = document.getElementById("qr-container");
const qrInput = document.getElementById("qr-input");
const qrButton = document.getElementById("qr-btn");
const qrImage = document.getElementById("qr-image");

qrButton.addEventListener("click", () => {
  const text = qrInput.value.trim();
  if (!text) {
    alert("Please enter text or link for QR code");
    return;
  }

  qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    text
  )}`;
  qrContainer.style.display = "block";
});

// ====== Wallet Balance ======
let walletBalance = 0;
const walletDisplay = document.getElementById("wallet-balance");
const addMoneyBtn = document.getElementById("add-money-btn");
const addAmount = document.getElementById("add-amount");

function updateWallet() {
  walletDisplay.innerText = "₹ " + walletBalance.toFixed(2);
}

addMoneyBtn.addEventListener("click", () => {
  const amount = parseFloat(addAmount.value);
  if (isNaN(amount) || amount <= 0) {
    alert("Enter valid amount!");
  } else {
    walletBalance += amount;
    updateWallet();
    addAmount.value = "";
  }
});

// ====== Transaction History ======
const transactionList = document.getElementById("transaction-list");
function addTransaction(type, amount) {
  const item = document.createElement("li");
  item.innerHTML = `<strong>${type}</strong> - ₹${amount.toFixed(2)} - ${new Date().toLocaleString()}`;
  transactionList.prepend(item);
}

// ====== Payment Send Simulation ======
const sendBtn = document.getElementById("send-btn");
const receiver = document.getElementById("receiver");
const sendAmount = document.getElementById("send-amount");

sendBtn.addEventListener("click", () => {
  const to = receiver.value.trim();
  const amt = parseFloat(sendAmount.value);

  if (!to || isNaN(amt) || amt <= 0) {
    alert("Enter valid details!");
    return;
  }

  if (amt > walletBalance) {
    alert("Insufficient balance!");
    return;
  }

  walletBalance -= amt;
  updateWallet();
  addTransaction(`Sent to ${to}`, amt);
  receiver.value = "";
  sendAmount.value = "";
});

// ====== Initial Load ======
updateWallet();
