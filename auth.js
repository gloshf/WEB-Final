(function () {
  'use strict';
  const ACCOUNTS_KEY = 'movieverse_accounts_v1';
  const SESSION_KEY = 'movieverse_session_v1';
  const ITERATIONS = 100000;
  const encoder = new TextEncoder();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

  function readJSON(key, fallback) {
    try { const json = localStorage.getItem(key); return json ? JSON.parse(json) : fallback; }
    catch (_) { return fallback; }
  }
  function saveJSON(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
  function getSession() {
    const session = readJSON(SESSION_KEY, null);
    if (!session || typeof session.name !== 'string' || typeof session.email !== 'string') return null;
    return session;
  }
  function bytesToHex(bytes) {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    return bytes;
  }
  async function derivePassword(password, salt) {
    if (!window.crypto || !crypto.subtle) {
      throw new Error('Secure browser context required: use GitHub Pages or localhost (not a file preview).');
    }
    const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: hexToBytes(salt), iterations: ITERATIONS, hash: 'SHA-256' }, key, 256);
    return bytesToHex(new Uint8Array(bits));
  }
  function constantTimeEqual(a, b) {
    if (a.length !== b.length) return false;
    let mismatch = 0;
    for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return mismatch === 0;
  }
  function banner(element, text, success) {
    if (!element) return;
    element.replaceChildren();
    const alert = document.createElement('div');
    alert.className = 'alert ' + (success ? 'alert-success' : 'alert-danger');
    alert.setAttribute('role', 'alert');
    alert.textContent = text;
    element.appendChild(alert);
  }
  function updateNav() {
    const session = getSession();
    const link = document.getElementById('mvAuthLink');
    const welcome = document.getElementById('mvWelcome');
    const signOut = document.getElementById('mvSignOut');
    if (link) link.hidden = Boolean(session);
    if (welcome) {
      welcome.hidden = !session;
      welcome.textContent = session ? 'Hi, ' + session.name + '!' : '';
    }
    if (signOut) signOut.hidden = !session;
  }
  function safeStoredAccounts() {
    const data = readJSON(ACCOUNTS_KEY, []);
    return Array.isArray(data) ? data : [];
  }
  function bindNav() {
    updateNav();
    const button = document.getElementById('mvSignOut');
    if (button) button.addEventListener('click', function () {
      localStorage.removeItem(SESSION_KEY);
      updateNav();
      if (document.getElementById('mvLoginForm')) {
        banner(document.getElementById('mvLoginAlert'), 'You have signed out.', true);
      }
    });
    window.addEventListener('storage', function (event) {
      if (event.key === SESSION_KEY) updateNav();
    });
  }

  function bindRegistration() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    // Capture before the Endterm jQuery submit handler, preserving all its live feedback.
    // Its old success path did not actually create an account.
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim().toLowerCase();
      const password = document.getElementById('regPassword').value;
      const confirmation = document.getElementById('regConfirm').value;
      const message = document.getElementById('regMessage').value.trim();
      const alert = document.getElementById('formAlert');
      if (name.length < 2 || !emailPattern.test(email) || password.length < 8 || password !== confirmation || message.length < 10) {
        banner(alert, 'Please check all fields: name (2+), valid email, password (8+), matching confirmation and message (10+).', false);
        return;
      }
      const accounts = safeStoredAccounts();
      if (accounts.some(account => account.email === email)) {
        banner(alert, 'An account with this email already exists on this browser. Please sign in.', false);
        return;
      }
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      try {
        const salt = bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
        const hash = await derivePassword(password, salt);
        accounts.push({ name: name, email: email, salt: salt, passwordHash: hash });
        saveJSON(ACCOUNTS_KEY, accounts);
        saveJSON(SESSION_KEY, { name: name, email: email, signedInAt: new Date().toISOString() });
        banner(alert, 'Account created! You are signed in as ' + name + '.', true);
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(el => el.classList.remove('is-valid', 'is-invalid'));
        form.querySelectorAll('.field-feedback').forEach(el => { el.textContent = ''; el.className = 'field-feedback'; });
        const strength = document.getElementById('strengthFill');
        const strengthLabel = document.getElementById('strengthLabel');
        if (strength) strength.style.width = '0%';
        if (strengthLabel) strengthLabel.textContent = '';
        updateNav();
      } catch (error) {
        banner(alert, 'Could not save your account: ' + error.message, false);
      } finally { button.disabled = false; }
    }, true); // Capture phase: the legacy jQuery submit handler must not clear the form first.
  }

  function bindLogin() {
    const form = document.getElementById('mvLoginForm');
    if (!form) return;
    const session = getSession();
    if (session) banner(document.getElementById('mvLoginAlert'), 'Already signed in as ' + session.name + '.', true);
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const email = document.getElementById('mvLoginEmail').value.trim().toLowerCase();
      const password = document.getElementById('mvLoginPassword').value;
      const alert = document.getElementById('mvLoginAlert');
      if (!emailPattern.test(email) || !password) {
        banner(alert, 'Enter a valid email address and password.', false);
        return;
      }
      const account = safeStoredAccounts().find(record => record.email === email);
      if (!account) {
        banner(alert, 'No matching account found on this browser. Register first.', false);
        return;
      }
      const button = document.getElementById('mvLoginButton');
      button.disabled = true;
      try {
        const hash = await derivePassword(password, account.salt);
        if (!constantTimeEqual(hash, account.passwordHash)) {
          banner(alert, 'Incorrect email or password.', false);
          return;
        }
        saveJSON(SESSION_KEY, { name: account.name, email: account.email, signedInAt: new Date().toISOString() });
        banner(alert, 'Welcome back, ' + account.name + '! You are signed in.', true);
        form.reset();
        updateNav();
      } catch (error) {
        banner(alert, 'Sign-in failed: ' + error.message, false);
      } finally { button.disabled = false; }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindNav();
    bindRegistration();
    bindLogin();
  });
  window.MovieVerseAuth = { getSession: getSession };
})();