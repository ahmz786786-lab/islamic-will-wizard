// ========================================
// Auth Module - Login/Signup/Session Management
// ========================================

let currentUser = null;
let currentProfile = null;

// Reuse the shared Supabase client from config.js (avoids duplicate instances)
function getAuthSupabase() {
    if (typeof getSharedSupabaseClient === 'function') {
        return getSharedSupabaseClient();
    }
    // Fallback if config.js not loaded
    if (!window._authSupabaseFallback && window.supabase && window.supabase.createClient) {
        window._authSupabaseFallback = window.supabase.createClient(
            'https://gyvzfylmvocrriwoemhf.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5dnpmeWxtdm9jcnJpd29lbWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjAyOTEsImV4cCI6MjA4NjQ5NjI5MX0.H6E2iAWkqi82szU52_jtbBSyzPKTlAt5jqgRsYt9Kfk'
        );
    }
    return window._authSupabaseFallback || null;
}

// ========================================
// Session Management
// ========================================

async function checkAuthSession() {
    const sb = getAuthSupabase();
    if (!sb) return null;

    const { data: { session }, error } = await sb.auth.getSession();
    if (error || !session) {
        currentUser = null;
        currentProfile = null;
        return null;
    }

    currentUser = session.user;
    await loadUserProfile();
    return session;
}

async function loadUserProfile() {
    if (!currentUser) return null;
    const sb = getAuthSupabase();

    const { data, error } = await sb
        .from('user_profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

    if (data && !error) {
        currentProfile = data;
    }
    return currentProfile;
}

// ========================================
// Sign Up
// ========================================

async function authSignUp(fullName, email, password, role) {
    const sb = getAuthSupabase();
    if (!sb) return { error: { message: 'Service unavailable' } };

    const { data, error } = await sb.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: fullName,
                role: role || 'client'
            }
        }
    });

    if (error) return { error };

    currentUser = data.user;
    if (currentUser) {
        await loadUserProfile();
    }

    return { data };
}

// ========================================
// Sign In
// ========================================

async function authSignIn(email, password) {
    const sb = getAuthSupabase();
    if (!sb) return { error: { message: 'Service unavailable' } };

    const { data, error } = await sb.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) return { error };

    currentUser = data.user;
    await loadUserProfile();
    return { data };
}

// ========================================
// Sign Out
// ========================================

async function authSignOut() {
    const sb = getAuthSupabase();
    if (!sb) return;

    await sb.auth.signOut();
    currentUser = null;
    currentProfile = null;
}

// ========================================
// Auth Guard - redirect to home if not logged in
// ========================================

async function requireAuth() {
    const session = await checkAuthSession();
    if (!session) {
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage !== 'index.html' && currentPage !== '') {
            window.location.href = 'index.html';
        }
        return false;
    }

    // Check if trial has expired — auto-downgrade to inactive
    if (currentProfile && currentProfile.subscription_status === 'trial') {
        if (currentProfile.trial_ends_at && new Date(currentProfile.trial_ends_at) < new Date()) {
            // Trial expired — update in DB and block
            const sb = getAuthSupabase();
            if (sb) {
                await sb.from('user_profiles').update({ subscription_status: 'inactive' }).eq('id', currentUser.id);
                currentProfile.subscription_status = 'inactive';
            }
        }
    }

    // Check subscription status — block inactive/cancelled users
    if (currentProfile && (currentProfile.subscription_status === 'inactive' || currentProfile.subscription_status === 'cancelled')) {
        document.body.innerHTML =
            '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Inter,sans-serif;background:#f8fafc;">' +
                '<div style="text-align:center;padding:2rem;background:white;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:420px;">' +
                    '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="1.5" style="margin-bottom:1rem;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>' +
                    '<h2 style="margin:0 0 0.5rem;color:#1e293b;">Subscription Required</h2>' +
                    '<p style="color:#64748b;margin:0 0 1.5rem;">Your account is not currently active. Please contact us to activate your subscription.</p>' +
                    '<a href="index.html" style="display:inline-block;padding:0.75rem 2rem;background:#1e3a5f;color:white;border-radius:8px;text-decoration:none;font-weight:500;">Go to Home</a>' +
                '</div>' +
            '</div>';
        return false;
    }

    // Check plan-based access — block if user doesn't have the right plan for this tool
    const currentPage = window.location.pathname.split('/').pop();
    const userPlan = getCurrentUserPlan();
    const userRole = getCurrentUserRole();

    // Admins can access everything
    if (userRole !== 'admin' && PLAN_ACCESS[currentPage]) {
        const allowedPlans = PLAN_ACCESS[currentPage];
        if (!allowedPlans.includes(userPlan)) {
            document.body.innerHTML =
                '<div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:Inter,sans-serif;background:#f8fafc;">' +
                    '<div style="text-align:center;padding:2rem;background:white;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:420px;">' +
                        '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="1.5" style="margin-bottom:1rem;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>' +
                        '<h2 style="margin:0 0 0.5rem;color:#1e293b;">Access Restricted</h2>' +
                        '<p style="color:#64748b;margin:0 0 1.5rem;">This tool is not included in your current plan. Please contact your administrator to upgrade your access.</p>' +
                        '<a href="index.html" style="display:inline-block;padding:0.75rem 2rem;background:#1e3a5f;color:white;border-radius:8px;text-decoration:none;font-weight:500;">Go to Home</a>' +
                    '</div>' +
                '</div>';
            return false;
        }
    }

    return true;
}

// ========================================
// User Header - renders user name + logout in the header nav
// ========================================

function renderUserHeader() {
    if (!currentUser) return;

    const nav = document.querySelector('.header-nav');
    if (!nav) return;

    // Remove existing user info if any
    const existing = document.getElementById('user-header-info');
    if (existing) existing.remove();

    const userDiv = document.createElement('div');
    userDiv.id = 'user-header-info';
    userDiv.style.cssText = 'display:flex;align-items:center;gap:0.75rem;margin-left:1rem;';

    const name = (currentProfile && currentProfile.full_name) || currentUser.email;
    const roleBadge = currentProfile ? (currentProfile.role === 'admin' ? ' (Admin)' :
                      currentProfile.role === 'solicitor' ? ' (Solicitor)' : '') : '';

    userDiv.innerHTML = `
        <span style="color:rgba(255,255,255,0.9);font-size:0.85rem;font-weight:500;">
            ${name}${roleBadge}
        </span>
        <button onclick="handleLogout()" style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);color:white;padding:0.35rem 0.75rem;border-radius:6px;font-size:0.8rem;cursor:pointer;font-family:inherit;transition:all 0.2s;">
            Logout
        </button>
    `;

    nav.parentElement.appendChild(userDiv);
}

async function handleLogout() {
    await authSignOut();
    window.location.href = 'index.html';
}

// ========================================
// Get current user ID (for saving documents)
// ========================================

function getCurrentUserId() {
    return currentUser ? currentUser.id : null;
}

function getCurrentUserRole() {
    return currentProfile ? currentProfile.role : null;
}

function getCurrentUserPlan() {
    return currentProfile ? currentProfile.plan : 'none';
}

// ========================================
// Plan Access Map - which plans allow which tools
// ========================================

const PLAN_ACCESS = {
    'islamic-will.html': ['islamic', 'all'],
    'lpa.html':          ['islamic', 'all'],
    'will-standard.html': ['standard', 'all'],
    'lpa-standard.html':  ['standard', 'all']
};
