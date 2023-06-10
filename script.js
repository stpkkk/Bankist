'use strict';
//142 - 167

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelMovementsSum = document.querySelector('.movements-sum');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const statusLogin = document.querySelector('.login--status');
const statusTransfer = document.querySelector('.transfer--status');
const statusCloseAcc = document.querySelector('.close--status');
const statusLoan = document.querySelector('.loan--status');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  //Sorting movements
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  //Display movements
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
	<div class="movements__row">
		<div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
		<div class="movements__value">${mov} $</div>
	</div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => {
    return (acc += mov);
  }, 0);
  labelBalance.textContent = `${acc.balance} $`;
};

const calcDisplayBankMovements = function () {
  const bankMovSum = accounts
    .flatMap(acc => acc.movements)
    .reduce((acc, mov) => acc + mov, 0);
  labelMovementsSum.textContent = bankMovSum;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} $`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)} $`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1) //calc only if interest rate is higher than 1
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} $`;
};

const updateUI = function (acc) {
  //display movements
  displayMovements(acc);
  //display balance
  calcDisplayBalance(acc);
  //display summary
  calcDisplaySummary(acc);
  // display bank balance
  calcDisplayBankMovements();
};

//side effect with creating an username in accounts obj
const createUsernames = accs =>
  accs.forEach(
    acc =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join(''))
  );

createUsernames(accounts);

//Event Handlers

//Login
let currentAcc;
btnLogin.addEventListener('click', e => {
  // Prevent form for submitting
  e.preventDefault();

  currentAcc = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAcc);

  if (currentAcc?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${currentAcc.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    inputLoginPin.blur(); //to lose a focus on input

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    statusLogin.textContent = ' ';

    //Update UI
    updateUI(currentAcc);
  } else {
    //Errors catching
    console.log('wrong pin');
    containerApp.style.opacity = 0;
    inputLoginPin.value = '';
    statusLogin.style.opacity = 1;
    statusLogin.textContent = 'The pin or user is incorrect';
  }
});

//Transfer
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAcc.balance >= amount &&
    receiverAcc?.username !== currentAcc.username
  ) {
    //Doing a transfer
    currentAcc.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAcc);

    //Successful Status, clear inputs
    statusTransfer.style.color = 'green';
    statusTransfer.textContent = 'Successful!';
    inputTransferTo.value = ' ';
    inputTransferAmount.value = '';
    inputTransferAmount.blur();
    setTimeout(() => {
      statusTransfer.style.opacity = 0;
    }, 2000);
    statusTransfer.style.opacity = 100;

    console.log('Transfer valid!');

    //Errors catching
  } else if (amount <= 0) {
    statusTransfer.style.opacity = 100;
    statusTransfer.style.color = 'tomato';

    statusTransfer.textContent = 'You can`t transfer 0 or less!';
    console.log('You can`t transfer 0 or less!');
  } else if (currentAcc.balance <= amount) {
    statusTransfer.style.opacity = 100;
    statusTransfer.style.color = 'tomato';

    statusTransfer.textContent = 'Not enough money!';
    console.log('Not enough money!');
  } else if (receiverAcc?.username === currentAcc.username) {
    statusTransfer.style.opacity = 100;
    statusTransfer.style.color = 'tomato';

    statusTransfer.textContent = 'You can`t transfer money to yourself!';
    console.log('You can`t transfer money to yourself!');
  } else if (!receiverAcc) {
    statusTransfer.style.opacity = 100;
    statusTransfer.style.color = 'tomato';

    statusTransfer.textContent = 'No client with such a name!';
    console.log('No client with such a name!');
  }
});

//Delete acc
btnClose.addEventListener('click', e => {
  e.preventDefault();
  console.log(currentAcc.pin);
  if (
    inputCloseUsername.value === currentAcc.username &&
    Number(inputClosePin.value) === currentAcc.pin
  ) {
    //Find index to delete acc
    const index = accounts.findIndex(
      acc => acc.username === currentAcc.username
    );

    //Delete acc
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  } else {
    //Errors catching
    statusCloseAcc.style.opacity = 100;
    statusCloseAcc.textContent = 'The pin or user is incorrect';
  }
});

//Request a Loan
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  //Any mov must be > 10% of requested loan
  if (amount > 0 && currentAcc.movements.some(mov => mov >= amount * 0.1)) {
    //Add mov
    currentAcc.movements.push(amount);

    //Update UI
    updateUI(currentAcc);

    inputLoanAmount.value = '';
    inputLoanAmount.blur();
    statusLoan.style.opacity = 0;
    statusLoan.textContent = '';
  } else {
    statusLoan.style.opacity = 100;
    statusLoan.textContent =
      'You asking to much! Any deposit must be greater than 10% of your loan request';
  }
});

//Sorting
let sortedState = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAcc, !sortedState);
  sortedState = !sortedState;
});
