/* USA Lendings — demo landing page
   Nothing here talks to a server. Submitting logs a payload to the console only. */

/* ---------------- Mobile navigation ---------------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function setMenu(open) {
    navLinks.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

navToggle.addEventListener('click', () => {
    setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
});

navLinks.addEventListener('click', e => {
    if (e.target.tagName === 'A') setMenu(false);
});

document.addEventListener('click', e => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) setMenu(false);
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setMenu(false);
});

/* Reset the menu when the layout goes back to desktop */
window.matchMedia('(min-width: 781px)').addEventListener('change', e => {
    if (e.matches) setMenu(false);
});

/* ---------------- Rate calculator ---------------- */
const APR = 0.0999;
const amountSlider = document.getElementById('calcAmount');
const termSlider = document.getElementById('calcTerm');
const amountOut = document.getElementById('calcAmountOut');
const termOut = document.getElementById('calcTermOut');
const paymentOut = document.getElementById('calcPayment');

const usd = n => '$' + Math.round(n).toLocaleString('en-US');

function updateCalc() {
    const principal = Number(amountSlider.value);
    const months = Number(termSlider.value);
    const r = APR / 12;
    const payment = (principal * r) / (1 - Math.pow(1 + r, -months));

    amountOut.textContent = usd(principal);
    termOut.textContent = months + ' months';
    paymentOut.textContent = usd(payment);
}

[amountSlider, termSlider].forEach(el => el.addEventListener('input', updateCalc));
updateCalc();

/* ---------------- Multi-step form ---------------- */
const form = document.getElementById('loanForm');
const panels = Array.from(form.querySelectorAll('.step-panel'));
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const stepTitles = ['Loan details', 'About you', 'Deposit account'];
let current = 1;

function showStep(step, focusFirst = true) {
    current = step;
    panels.forEach(p => p.classList.toggle('is-active', Number(p.dataset.step) === step));
    progressFill.style.width = (step / panels.length * 100) + '%';
    progressText.textContent = `Step ${step} of ${panels.length} · ${stepTitles[step - 1]}`;

    if (!focusFirst) return;
    const first = panels[step - 1].querySelector('input:not([type="checkbox"])');
    if (first) first.focus({ preventScroll: true });
}

form.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => {
        if (validateStep(current)) showStep(current + 1);
    });
});

form.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => showStep(current - 1));
});

/* Enter moves forward instead of submitting early */
form.addEventListener('keydown', e => {
    if (e.key === 'Enter' && current < panels.length) {
        e.preventDefault();
        if (validateStep(current)) showStep(current + 1);
    }
});

/* ---------------- Validation ---------------- */
function setError(id, message) {
    const input = document.getElementById(id);
    const slot = form.querySelector(`[data-error-for="${id}"]`);
    if (input) input.classList.toggle('invalid', Boolean(message));
    if (slot) {
        slot.textContent = message || '';
        slot.classList.toggle('show', Boolean(message));
    }
    return !message;
}

const digits = value => value.replace(/\D/g, '');

function yearsSince(dateString) {
    const dob = new Date(dateString);
    if (Number.isNaN(dob.getTime())) return NaN;
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age--;
    return age;
}

/* ABA routing numbers use a weighted mod-10 checksum */
function isValidRouting(value) {
    if (!/^\d{9}$/.test(value)) return false;
    const w = [3, 7, 1, 3, 7, 1, 3, 7, 1];
    const sum = value.split('').reduce((acc, d, i) => acc + Number(d) * w[i], 0);
    return sum % 10 === 0;
}

const validators = {
    1() {
        const amount = Number(digits(document.getElementById('loanAmount').value));
        if (!amount) return setError('loanAmount', 'Enter the amount you need.');
        if (amount < 1000) return setError('loanAmount', 'Minimum loan amount is $1,000.');
        if (amount > 50000) return setError('loanAmount', 'Maximum loan amount is $50,000.');
        return setError('loanAmount', '');
    },
    2() {
        let ok = true;
        const firstName = document.getElementById('firstName').value.trim();
        ok = setError('firstName', firstName.length < 2 ? 'Enter your first name.' : '') && ok;

        const lastName = document.getElementById('lastName').value.trim();
        ok = setError('lastName', lastName.length < 2 ? 'Enter your last name.' : '') && ok;

        const dob = document.getElementById('dob').value;
        const age = yearsSince(dob);
        let dobError = '';
        if (!dob) dobError = 'Enter your date of birth.';
        else if (Number.isNaN(age) || age < 18) dobError = 'You must be at least 18 years old to apply.';
        else if (age > 120) dobError = 'Check the date of birth you entered.';
        ok = setError('dob', dobError) && ok;

        const phone = digits(document.getElementById('phone').value);
        ok = setError('phone', phone.length !== 10 ? 'Enter a 10-digit phone number.' : '') && ok;

        const email = document.getElementById('email').value.trim();
        ok = setError('email', /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? '' : 'Enter a valid email address.') && ok;

        return ok;
    },
    3() {
        let ok = true;
        const bank = document.getElementById('bankName').value.trim();
        ok = setError('bankName', bank.length < 2 ? 'Enter your bank name.' : '') && ok;

        const routing = digits(document.getElementById('routingNumber').value);
        let routingError = '';
        if (routing.length !== 9) routingError = 'Routing numbers are exactly 9 digits.';
        else if (!isValidRouting(routing)) routingError = 'That routing number failed its checksum. Please re-check it.';
        ok = setError('routingNumber', routingError) && ok;

        const account = digits(document.getElementById('accountNumber').value);
        let accountError = '';
        if (account.length < 4 || account.length > 17) accountError = 'Account numbers are between 4 and 17 digits.';
        ok = setError('accountNumber', accountError) && ok;

        const consent = document.getElementById('consent').checked;
        ok = setError('consent', consent ? '' : 'Please authorize the deposit to continue.') && ok;

        return ok;
    }
};

function validateStep(step) {
    const ok = validators[step]();
    if (!ok) {
        const firstBad = panels[step - 1].querySelector('.invalid, .error.show');
        if (firstBad) firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return ok;
}

/* Clear a field's error as soon as the user edits it */
form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        if (input.classList.contains('invalid') || input.id === 'consent') setError(input.id, '');
    });
});

/* ---------------- Input formatting ---------------- */
const loanAmountInput = document.getElementById('loanAmount');
const chips = Array.from(document.querySelectorAll('.chip'));

function syncChips() {
    const value = digits(loanAmountInput.value);
    chips.forEach(c => c.classList.toggle('is-active', c.dataset.amount === value));
}

loanAmountInput.addEventListener('input', e => {
    const raw = digits(e.target.value).slice(0, 6);
    e.target.value = raw ? Number(raw).toLocaleString('en-US') : '';
    syncChips();
});

chips.forEach(chip => {
    chip.addEventListener('click', () => {
        loanAmountInput.value = Number(chip.dataset.amount).toLocaleString('en-US');
        setError('loanAmount', '');
        syncChips();
    });
});

const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', e => {
    const d = digits(e.target.value).slice(0, 10);
    if (d.length <= 3) e.target.value = d;
    else if (d.length <= 6) e.target.value = `(${d.slice(0, 3)}) ${d.slice(3)}`;
    else e.target.value = `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
});

const routingInput = document.getElementById('routingNumber');
routingInput.addEventListener('input', e => {
    e.target.value = digits(e.target.value).slice(0, 9);
});

const accountInput = document.getElementById('accountNumber');
accountInput.addEventListener('input', e => {
    e.target.value = digits(e.target.value).slice(0, 17);
});

/* Show / hide the account number */
const revealBtn = document.getElementById('revealAccount');
revealBtn.addEventListener('click', () => {
    const hidden = accountInput.type === 'password';
    accountInput.type = hidden ? 'text' : 'password';
    revealBtn.textContent = hidden ? 'Hide' : 'Show';
    revealBtn.setAttribute('aria-label', (hidden ? 'Hide' : 'Show') + ' account number');
    accountInput.focus();
});

/* Cap the date picker at today so future birthdays can't be chosen */
document.getElementById('dob').max = new Date().toISOString().split('T')[0];

/* ---------------- Submit ---------------- */
const successBox = document.getElementById('successMessage');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateStep(3)) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    const data = {
        loanAmount: Number(digits(loanAmountInput.value)),
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        dateOfBirth: document.getElementById('dob').value,
        phone: digits(phoneInput.value),
        email: document.getElementById('email').value.trim(),
        bankName: document.getElementById('bankName').value.trim(),
        routingNumber: routingInput.value,
        accountNumber: accountInput.value
    };

    try {
        const response = await fetch('submit.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Submission failed.');
        }

        document.getElementById('successName').textContent = data.firstName;
        document.getElementById('successAmount').textContent = usd(data.loanAmount);
        document.getElementById('successRef').textContent =
            'USA-' + String(Math.floor(Math.random() * 900000) + 100000);

        form.hidden = true;
        document.querySelector('.progress').hidden = true;
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } catch (err) {
        alert(err.message || 'Something went wrong while submitting the form.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit application';
    }
});

document.getElementById('startOver').addEventListener('click', () => {
    form.reset();
    form.querySelectorAll('.error').forEach(el => el.classList.remove('show'));
    form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    chips.forEach(c => c.classList.remove('is-active'));
    accountInput.type = 'password';
    revealBtn.textContent = 'Show';

    successBox.hidden = true;
    form.hidden = false;
    document.querySelector('.progress').hidden = false;
    showStep(1);
});

showStep(1, false);
