// 1. Initialize Supabase Client (Apni sahi URL aur Anon Key yahan dalein)
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let isSignUp = false;
let currentUser = null;

// Tab Switching Logic
function switchTab(tabName) {
  const tabs = ['home', 'tasks', 'stats', 'wallet', 'profile'];
  tabs.forEach(t => {
    const el = document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1));
    if (el) el.style.display = 'none';
  });

  const activeTab = document.getElementById('tab' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
  if (activeTab) activeTab.style.display = 'block';

  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
}

// Toggle between Sign In and Sign Up screens
const btnToggleAuth = document.getElementById('btnToggleAuth');
if (btnToggleAuth) {
  btnToggleAuth.addEventListener('click', () => {
    isSignUp = !isSignUp;
    document.getElementById('signupFields').style.display = isSignUp ? 'block' : 'none';
    document.getElementById('retypePassField').style.display = isSignUp ? 'block' : 'none';
    document.getElementById('authHeading').innerText = isSignUp ? 'Create account' : 'Welcome back';
    document.getElementById('authSubheading').innerText = isSignUp ? 'Sign up to get started' : 'Sign in to continue';
    document.getElementById('btnLogin').innerText = isSignUp ? 'Sign up →' : 'Sign in →';
    document.getElementById('toggleText').innerText = isSignUp ? 'Already have an account?' : "Don't have an account?";
    btnToggleAuth.innerText = isSignUp ? 'Sign in' : 'Sign up';
    document.getElementById('authMsg').innerText = '';
  });
}

// Authentication Handler (Login & Signup Button Click)
const btnLogin = document.getElementById('btnLogin');
if (btnLogin) {
  btnLogin.addEventListener('click', async () => {
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value.trim();
    const msgEl = document.getElementById('authMsg');
    msgEl.innerText = '';

    if (!email || !password) {
      msgEl.innerText = 'Please fill in all required fields.';
      return;
    }

    if (isSignUp) {
      // Signup Process
      const fullName = document.getElementById('authName').value.trim();
      const phone = document.getElementById('authPhone').value.trim();
      const city = document.getElementById('authCity').value.trim();
      const confirmPass = document.getElementById('authConfirmPassword').value.trim();

      if (!fullName || !phone || !city) {
        msgEl.innerText = 'Please fill in all profile details.';
        return;
      }

      if (password !== confirmPass) {
        msgEl.innerText = 'Passwords do not match!';
        return;
      }

      btnLogin.disabled = true;
      btnLogin.innerText = 'Processing...';

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone: phone, city: city, status: 'pending' }
        }
      });

      btnLogin.disabled = false;
      btnLogin.innerText = 'Sign up →';

      if (error) {
        msgEl.innerText = error.message;
      } else {
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('depositScreen').style.display = 'block';
      }
    } else {
      // Login Process
      btnLogin.disabled = true;
      btnLogin.innerText = 'Signing in...';

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      btnLogin.disabled = false;
      btnLogin.innerText = 'Sign in →';

      if (error) {
        msgEl.innerText = error.message;
      } else {
        currentUser = data.user;
        checkUserStatusAndLoadDashboard();
      }
    }
  });
}

// SadaPay Deposit Proceed Button
const btnProceed = document.getElementById('btnProceed');
if (btnProceed) {
  btnProceed.addEventListener('click', () => {
    const depName = document.getElementById('depName').value.trim();
    const depNumber = document.getElementById('depNumber').value.trim();
    const depTrx = document.getElementById('depTrx').value.trim();

    if (!depName || !depNumber || !depTrx) {
      alert('Please fill out all deposit fields.');
      return;
    }

    document.getElementById('depositScreen').style.display = 'none';
    document.getElementById('pendingScreen').style.display = 'block';
  });
}

// Check User Status & Load Main App
async function checkUserStatusAndLoadDashboard() {
  document.getElementById('authScreen').style.display = 'none';
  document.getElementById('depositScreen').style.display = 'none';
  document.getElementById('pendingScreen').style.display = 'none';
  document.getElementById('mainApp').style.display = 'block';
}

// Logout Function
function logout() {
  supabase.auth.signOut();
  location.reload();
}

// Task Submit Handler
const btnSubmitTask = document.getElementById('btnSubmitTask');
if (btnSubmitTask) {
  btnSubmitTask.addEventListener('click', () => {
    const inputVal = document.getElementById('taskInput').value.trim();
    const targetWords = "Apple Banana Orange Grape Mango Lemon Peach Cherry Berry Melon";
    const msgEl = document.getElementById('taskMsg');

    if (inputVal === targetWords) {
      msgEl.style.color = '#10b981';
      msgEl.innerText = 'Task completed successfully! Reward added.';
    } else {
      msgEl.style.color = '#ef4444';
      msgEl.innerText = 'Words do not match. Please copy and paste correctly.';
    }
  });
}
