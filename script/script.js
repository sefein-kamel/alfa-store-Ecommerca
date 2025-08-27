// ======== Change between Create Account and log in ========
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
registerBtn.addEventListener('click', () => container.classList.add('active'));
loginBtn.addEventListener('click', () => container.classList.remove('active'));

// ======== Storage ========
const USE_COOKIES = false; // true for cookies, false for localStorage
const USERS_KEY = 'users_db';
const CURRENT_KEY = 'current_user_email';

function setStore(key, value){
  if (USE_COOKIES){
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}; path=/; max-age=${60*60*24*365}`;
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
function getStore(key){
  if (USE_COOKIES){
    const match = document.cookie.split('; ').find(c => c.startsWith(encodeURIComponent(key)+'='));
    if (!match) return null;
    try{ return JSON.parse(decodeURIComponent(match.split('=')[1])); }catch{ return null; }
  } else {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try{ return JSON.parse(raw); }catch{ return null; }
  }
}

function getUsers(){ return getStore(USERS_KEY) || {}; }
function saveUsers(obj){ setStore(USERS_KEY, obj); }
function setCurrent(email){ setStore(CURRENT_KEY, email); }

// ======== أدوات مساعدة ========
const $ = sel => document.querySelector(sel);
function setError(id, msg){ const el = document.getElementById(id); if(el){ el.textContent = msg || ''; } }
function clearErrors(ids){ ids.forEach(id => setError(id, '')); }

// name
const namePattern = /^[\p{L} ]{3,}$/u;
// password
const passPattern = /^(?=(?:.*[\p{L}]){2,}).{8,}$/u;

// ======== Create Account process ========
const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', (e) =>{
  e.preventDefault();
  clearErrors(['su_name_err','su_email_err','su_password_err','su_confirm_err']);

  const name = document.getElementById('su_name').value.trim();
  const email = document.getElementById('su_email').value.trim().toLowerCase();
  const pass = document.getElementById('su_password').value;
  const confirm = document.getElementById('su_confirm').value;

  let ok = true;

  if(!namePattern.test(name)){
    setError('su_name_err', 'The name must be letters and spaces only and a minimum of 3 characters.');
    ok = false;
  }

  if(!email){
    setError('su_email_err', 'Please enter a valid email address.');
    ok = false;
  }

  if(!passPattern.test(pass)){
    setError('su_password_err', 'The password must be at least 8 characters long and contain at least 2 letters.');
    ok = false;
  }

  if(pass !== confirm){
    setError('su_confirm_err', 'Confirm password does not match.');
    ok = false;
  }

  if(!ok) return;

  const users = getUsers();
  if(users[email]){
    setError('su_email_err', 'This email is already registered.');
    return;
  }

  // add the new user
  users[email] = { name, email, pass };
  saveUsers(users);

  alert('Your account has been created successfully! You can log in now.');
  container.classList.remove('active'); // return to login form
});

// ======== Login processing ========
const signinForm = document.getElementById('signinForm');
signinForm.addEventListener('submit', (e) =>{
  e.preventDefault();
  clearErrors(['si_email_err','si_password_err']);

  const email = document.getElementById('si_email').value.trim().toLowerCase();
  const pass = document.getElementById('si_password').value;

  const users = getUsers();
  const user = users[email];

  if(!user){
    setError('si_email_err', 'There is no account with this email.');
    return;
  }
  if(user.pass !== pass){
    setError('si_password_err', 'The password is incorrect.');
    return;
  }

  setCurrent(email);
  // go to home
  window.location.href = 'html/home.html';
});

// ======== Forget Password ========
document.getElementById('fakeForgot').addEventListener('click', (e)=>{
  e.preventDefault();
  alert('The demo does not contain a password recovery system.');
});