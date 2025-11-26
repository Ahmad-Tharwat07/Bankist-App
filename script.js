"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

const account1 = {
	owner: "Jonas Schmedtmann",
	movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
	interestRate: 1.2, // %
	pin: 1111,

	movementsDates: [
		"2019-11-18T21:31:17.178Z",
		"2019-12-23T07:42:02.383Z",
		"2020-01-28T09:15:04.904Z",
		"2020-04-01T10:17:24.185Z",
		"2020-05-08T14:11:59.604Z",
		"2025-11-18T17:01:17.194Z",
		"2025-11-19T23:36:17.929Z",
		"2025-11-20T10:51:36.790Z",
	],
	currency: "EUR",
	locale: "pt-PT", // de-DE
};

const account2 = {
	owner: "Jessica Davis",
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222,

	movementsDates: [
		"2019-11-01T13:15:33.035Z",
		"2019-11-30T09:48:16.867Z",
		"2019-12-25T06:04:23.907Z",
		"2020-01-25T14:18:46.235Z",
		"2020-02-05T16:33:06.386Z",
		"2020-04-10T14:43:26.374Z",
		"2020-06-25T18:49:59.371Z",
		"2025-11-15T12:01:20.894Z",
	],
	currency: "USD",
	locale: "en-US",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
/*
	js
	1111
	
	jd
	2222
	
	stw
	3333
	
	ss
	4444
*/
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
// const account1 = {
// 	owner: "Jonas Schmedtmann",
// 	movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
// 	interestRate: 1.2, // %
// 	pin: 1111,
// };

// const account2 = {
// 	owner: "Jessica Davis",
// 	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
// 	interestRate: 1.5,
// 	pin: 2222,
// };

const account3 = {
	owner: "Steven Thomas Williams",
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	interestRate: 0.7,
	pin: 3333,
};

const account4 = {
	owner: "Sarah Smith",
	movements: [430, 1000, 700, 50, 90],
	interestRate: 1,
	pin: 4444,
};

// const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

let cnt_acc;

const createUsernames = function (accs) {
	accs.forEach(function (acc) {
		acc.username = acc.owner
			.toLowerCase()
			.split(" ")
			.map((name) => name[0])
			.join("");
	});
};
createUsernames(accounts);

const formatMovementDate = function (local, date) {
	const calcDaysPassed = (date1, date2) =>
		Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

	const daysPassed = calcDaysPassed(new Date(), date);

	if (daysPassed === 0) return "Today";
	if (daysPassed === 1) return "Yesterday";
	if (daysPassed <= 7) return `${daysPassed} days ago`;

	// const day = `${date.getDate()}`.padStart(2, 0);
	// const month = monthArr[date.getMonth()];
	// const year = date.getFullYear();
	// const format = `${day} ${month} ${year}`;
	return new Intl.DateTimeFormat(local).format(date);
};

const formatCur = function(value, locale, currency){
	return new Intl.NumberFormat(locale, {
			style: "currency",
			currency: currency,
		}).format(value);
}

const displayMovements = function (acc, sort = false) {
	// first, clear the container
	containerMovements.innerHTML = "";

	const combinedMovesDates = acc.movements.map((mov, i) => ({
		movement: mov,
		movementDate: acc.movementsDates.at(i),
	}));

	if (sort) combinedMovesDates.sort((a, b) => a.movement - b.movement);

	combinedMovesDates.forEach((obj, i) => {
		const { movement, movementDate } = obj;
		const movType = movement > 0 ? "deposit" : "withdrawal";
		const date = new Date(movementDate);

		const dateFormat = formatMovementDate(cnt_acc.locale, date);
		const movFormat = formatCur(obj.movement, cnt_acc.locale, cnt_acc.currency)

		const movHtml = `
        <div class="movements__row">
          <div class="movements__type movements__type--${movType}">
          ${i + 1}  ${movType}</div>
          <div class="movements__date">${dateFormat}</div>
          <div class="movements__value">${movFormat}</div>
        </div>`;

		containerMovements.insertAdjacentHTML("afterbegin", movHtml);
	});
};

const calcDisplayBlanace = function (acc) {
	acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
	labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
	const incomes = acc.movements
		.filter((mov) => mov > 0)
		.reduce((acc, mov) => acc + mov, 0);
	labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

	const out = acc.movements
		.filter((mov) => mov < 0)
		.reduce((acc, mov) => acc + mov, 0);
	labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

	const interest = acc.movements
		.filter((mov) => mov > 0)
		.map((deposit) => (deposit * acc.interestRate) / 100)
		.filter((int, i, arr) => {
			// console.log(arr);
			return int >= 1;
		})
		.reduce((acc, int) => acc + int, 0);
	labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const displayDate = function () {
	const now = new Date();
	const day = `${now.getDate()}`.padStart(2, 0);
	const month = `${now.getMonth() + 1}`.padStart(2, 0);
	const year = now.getFullYear();
	const hour = `${now.getHours()}`.padStart(2, 0);
	const min = `${now.getMinutes()}`.padStart(2, 0);
	const format = `${day}/${month}/${year}, ${hour}:${min}`;
	labelDate.textContent = format;
};

const updateUI = function (acc) {
	calcDisplayBlanace(acc);
	displayMovements(acc);
	calcDisplaySummary(acc);
	displayDate();

	labelWelcome.textContent = `Welcome back, ${acc.owner.split(" ")[0]}`;
	containerApp.style.opacity = 100;
	inputLoginUsername.value = inputLoginPin.value = "";
	inputLoginPin.blur();
};

const transferAmount = function (username, amount) {
	const receiver = accounts.find((acc) => acc.username == username);
	const now = new Date().toISOString();

	if (receiver?.username === cnt_acc.username)
		console.log("can't transfer to yourself.");
	else if (receiver) {
		receiver.movements.push(amount);
		cnt_acc.movements.push(-1 * amount);
		receiver.movementsDates.push(now);
		cnt_acc.movementsDates.push(now);

		inputTransferTo.value = inputTransferAmount.value = "";
		updateUI(cnt_acc);
		console.log("DONE!");
	} else console.log("No user found ‼️");
};

const login = function (username, pin) {
	cnt_acc = accounts.find((acc) => acc.username === username);

	if (cnt_acc?.pin.toString() === pin) updateUI(cnt_acc);
	else console.log("User not found ‼️");

	const now = new Date();
	const options = {
		hour: "numeric",
		minute: "numeric",
		day: "numeric",
		month: "numeric",
		year: "numeric",
	};
	labelDate.textContent = new Intl.DateTimeFormat(
		cnt_acc.locale,
		options
	).format(now);
};

///////////////////////////////////////////////////////////
// Even Handlers

btnLogin.addEventListener("click", (e) => {
	e.preventDefault();
	const username = inputLoginUsername.value;
	const pin = inputLoginPin.value;
	login(username, pin);
});

btnTransfer.addEventListener("click", (e) => {
	e.preventDefault();
	const username = inputTransferTo.value;
	const amount = Number(inputTransferAmount.value);

	// If user is logged in
	if (cnt_acc) {
		const balance = cnt_acc.balance;
		if (balance >= amount && amount > 0) transferAmount(username, amount);
		else console.log("NO SUFFICIENT FUND OR FUND IS 0/NEGATIVE‼️‼️");
	} else console.log("You are not logged in 🗣️🔥");
});

btnLoan.addEventListener("click", (e) => {
	e.preventDefault();

	const amount = Math.floor(Number(inputLoanAmount.value));
	const condition = cnt_acc.movements.some((mov) => mov >= amount * 0.1);
	if (amount > 0 && condition) {
		cnt_acc.movements.push(amount);
		cnt_acc.movementsDates.push(new Date().toISOString());
		updateUI(cnt_acc);
	} else {
		if (!condition) console.log("Can't request this amount");
		else console.log("Amount must be positive integer 🗣️🗣️");
	}

	inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
	e.preventDefault();
	const username = inputCloseUsername.value;
	const pin = Number(inputClosePin.value);

	if (username === cnt_acc?.username && pin === cnt_acc?.pin) {
		const index = accounts.findIndex(
			(acc) => acc.username == cnt_acc.username
		);
		accounts.splice(index, 1);
		containerApp.style.opacity = 0;
	}

	inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
	e.preventDefault();
	displayMovements(cnt_acc, !sorted);
	sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
	["USD", "United States dollar"],
	["EUR", "Euro"],
	["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let arr = ["a", "b", "c", "d", "e"];
