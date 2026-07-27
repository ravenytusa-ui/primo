// 1. Initialize Supabase Client (Apni credentials yahan enter karein)
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

  // Update active styling on bottom navigation
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  // Aap yahan navigation items par click state handle kar sakte hain
}

// Toggle between Sign In and Sign Up screens
document.getElementById('btnToggleAuth').addEventListener('click', () => {
  isSignUp = !isSignUp;
  document.getElementById('signupFields').style.display = isSignUp ? 'block' : 'none';
  document.getElementById('retypePassField').style.display = isSignUp ? 'block' : 'none';
  document.getElementById('authHeading').innerText = isSignUp ? 'Create account' : 'Welcome back';
  document.getElementById('authSubheading').innerText = isSignUp ? 'Sign up to get started' : 'Sign in to continue';
  document.getElementById('btnLogin').innerText = isSignUp ? 'Sign up →' : 'Sign in →';
  document.getElementById('toggleText').innerText = isSignUp ? 'Already have an account?' : "Don't have an account?";
  document.getElementById('btnToggleAuth').innerText = isSignUp ? 'Sign in' : 'Sign up';
});

// Authentication Handler (Login / Signup)
document.getElementById('btnLogin').addEventListener('click', async () => {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value.trim();
  const msgEl = document.getElementById('authMsg');
  msgEl.innerText = '';

  if (!email || !password) {
    msgEl.innerText = 'Please fill in all required fields.';
    return;
  }

  if (isSignUp) {
    const fullName = document.getElementById('authName').value.trim();
    const phone = document.getElementById('authPhone').value.trim();
    const city = document.getElementById('authCity').value.trim();
    const confirmPass = document.getElementById('authConfirmPassword').value.trim();

    if (password !== confirmPass) {
      msgEl.innerText = 'Passwords do not match!';
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone: phone, city: city, status: 'pending' }
      }
    });

    if (error) {
      msgEl.innerText = error.message;
    } else {
      document.getElementById('authScreen').style.display = 'none';
      document.getElementById('depositScreen').style.display = 'block';
    }
  } else {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      msgEl.innerText = error.message;
    } else {
      currentUser = data.user;
      checkUserStatusAndLoadDashboard();
    }
  }
});

// Check User Status & Load Main App
async function checkUserStatusAndLoadDashboard() {
  // Yahan aap status check kar sakte hain ke user 'approved' hai ya 'pending'
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
document.getElementById('btnSubmitTask').addEventListener('click', () => {
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