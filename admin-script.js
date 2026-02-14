// ========================================
// Admin Dashboard - Super Admin Panel
// You (the admin) manage all businesses here
// ========================================

const SUPABASE_URL = 'https://gyvzfylmvocrriwoemhf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5dnpmeWxtdm9jcnJpd29lbWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MjAyOTEsImV4cCI6MjA4NjQ5NjI5MX0.H6E2iAWkqi82szU52_jtbBSyzPKTlAt5jqgRsYt9Kfk';

let supabaseClient = null;
let currentUser = null;
let allBusinesses = []; // All business configs
let editingId = null; // ID of business being edited (null = adding new)

// ========================================
// Initialization
// ========================================

function initSupabase() {
    try {
        if (window.supabase && window.supabase.createClient) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        }
    } catch (e) {
        console.warn('Supabase init error:', e);
    }
}

// ========================================
// Authentication
// ========================================

async function checkAuth() {
    if (!supabaseClient) return false;
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            currentUser = session.user;
            showDashboard();
            return true;
        }
    } catch (e) {
        console.log('Auth check error:', e.message);
    }
    return false;
}

async function adminLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    errorEl.style.display = 'none';

    if (!email || !password) {
        errorEl.textContent = 'Please enter your email and password.';
        errorEl.style.display = 'block';
        return;
    }

    if (!supabaseClient) {
        errorEl.textContent = 'Unable to connect. Please refresh and try again.';
        errorEl.style.display = 'block';
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
            errorEl.textContent = error.message;
            errorEl.style.display = 'block';
            return;
        }
        if (data.session) {
            currentUser = data.session.user;
            showDashboard();
            loadBusinesses();
        }
    } catch (e) {
        errorEl.textContent = 'Login failed: ' + e.message;
        errorEl.style.display = 'block';
    }
}

async function adminLogout() {
    if (supabaseClient) {
        await supabaseClient.auth.signOut();
    }
    currentUser = null;
    allBusinesses = [];
    document.getElementById('loginScreen').style.display = '';
    document.getElementById('dashboardScreen').style.display = 'none';
    document.getElementById('loginPassword').value = '';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboardScreen').style.display = '';
    if (currentUser) {
        document.getElementById('loggedInUser').textContent = currentUser.email;
    }
}

// Enter key to login
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && document.getElementById('loginScreen').style.display !== 'none') {
        adminLogin();
    }
});

// ========================================
// Load & Render Businesses
// ========================================

async function loadBusinesses() {
    if (!supabaseClient) return;

    try {
        const { data, error } = await supabaseClient
            .from('business_config')
            .select('*')
            .order('created_at', { ascending: false });

        if (data && !error) {
            allBusinesses = data;
        } else {
            allBusinesses = [];
        }
    } catch (e) {
        console.log('Load error:', e.message);
        allBusinesses = [];
    }

    renderBusinessCards();
}

function renderBusinessCards() {
    const grid = document.getElementById('businessGrid');
    const empty = document.getElementById('emptyState');

    if (allBusinesses.length === 0) {
        grid.innerHTML = '';
        empty.style.display = '';
        return;
    }

    empty.style.display = 'none';
    const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', '');

    grid.innerHTML = allBusinesses.map(biz => {
        const tools = [
            { key: 'enable_islamic_will', label: 'Islamic Will' },
            { key: 'enable_islamic_lpa', label: 'Islamic LPA' },
            { key: 'enable_standard_will', label: 'Standard Will' },
            { key: 'enable_standard_lpa', label: 'Standard LPA' }
        ];

        const toolTags = tools.map(t =>
            `<span class="business-tool-tag${biz[t.key] === false ? ' disabled' : ''}">${t.label}</span>`
        ).join('');

        const link = `${baseUrl}index.html?b=${biz.id}`;

        return `
            <div class="business-card">
                <div class="business-card-header">
                    <h3 class="business-card-name">${escapeHtml(biz.business_name || 'Untitled')}</h3>
                    <div class="business-card-actions">
                        <button onclick="openEditModal('${biz.id}')" title="Edit">Edit</button>
                        <button class="btn-delete" onclick="deleteBusiness('${biz.id}', '${escapeHtml(biz.business_name || '')}')" title="Delete">Delete</button>
                    </div>
                </div>
                <div class="business-color-dots">
                    <div class="business-color-dot" style="background:${biz.primary_color || '#1e3a5f'}" title="Primary"></div>
                    <div class="business-color-dot" style="background:${biz.secondary_color || '#d4af37'}" title="Secondary"></div>
                    <div class="business-color-dot" style="background:${biz.accent_color || '#1b7340'}" title="Accent"></div>
                </div>
                <div class="business-tools">${toolTags}</div>
                <div class="business-link" onclick="copyLink('${biz.id}')" title="Click to copy link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    ${link}
                </div>
            </div>
        `;
    }).join('');
}

// ========================================
// Modal - Add / Edit Business
// ========================================

function openAddModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Business';
    document.getElementById('modalSaveBtn').textContent = 'Add Business';

    // Reset form
    document.getElementById('modalBusinessName').value = '';
    document.getElementById('modalLogoUrl').value = '';
    document.getElementById('modalPrimaryColor').value = '#1e3a5f';
    document.getElementById('modalSecondaryColor').value = '#d4af37';
    document.getElementById('modalAccentColor').value = '#1b7340';
    document.getElementById('modalIslamicWill').checked = true;
    document.getElementById('modalIslamicLpa').checked = true;
    document.getElementById('modalStandardWill').checked = true;
    document.getElementById('modalStandardLpa').checked = true;
    document.getElementById('modalContactEmail').value = '';
    document.getElementById('modalContactPhone').value = '';
    document.getElementById('modalWebsiteUrl').value = '';
    document.getElementById('modalFooterText').value = '';

    document.getElementById('businessModal').classList.add('active');
}

function openEditModal(id) {
    const biz = allBusinesses.find(b => b.id === id);
    if (!biz) return;

    editingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Business';
    document.getElementById('modalSaveBtn').textContent = 'Save Changes';

    // Populate form
    document.getElementById('modalBusinessName').value = biz.business_name || '';
    document.getElementById('modalLogoUrl').value = biz.business_logo_url || '';
    document.getElementById('modalPrimaryColor').value = biz.primary_color || '#1e3a5f';
    document.getElementById('modalSecondaryColor').value = biz.secondary_color || '#d4af37';
    document.getElementById('modalAccentColor').value = biz.accent_color || '#1b7340';
    document.getElementById('modalIslamicWill').checked = biz.enable_islamic_will !== false;
    document.getElementById('modalIslamicLpa').checked = biz.enable_islamic_lpa !== false;
    document.getElementById('modalStandardWill').checked = biz.enable_standard_will !== false;
    document.getElementById('modalStandardLpa').checked = biz.enable_standard_lpa !== false;
    document.getElementById('modalContactEmail').value = biz.contact_email || '';
    document.getElementById('modalContactPhone').value = biz.contact_phone || '';
    document.getElementById('modalWebsiteUrl').value = biz.website_url || '';
    document.getElementById('modalFooterText').value = biz.footer_text || '';

    document.getElementById('businessModal').classList.add('active');
}

function closeModal() {
    document.getElementById('businessModal').classList.remove('active');
    editingId = null;
}

// ========================================
// Save Business (Add or Update)
// ========================================

async function saveBusiness() {
    const name = document.getElementById('modalBusinessName').value.trim();
    if (!name) {
        alert('Please enter a business name.');
        return;
    }

    const configData = {
        business_name: name,
        business_logo_url: document.getElementById('modalLogoUrl').value.trim() || null,
        primary_color: document.getElementById('modalPrimaryColor').value,
        secondary_color: document.getElementById('modalSecondaryColor').value,
        accent_color: document.getElementById('modalAccentColor').value,
        enable_islamic_will: document.getElementById('modalIslamicWill').checked,
        enable_islamic_lpa: document.getElementById('modalIslamicLpa').checked,
        enable_standard_will: document.getElementById('modalStandardWill').checked,
        enable_standard_lpa: document.getElementById('modalStandardLpa').checked,
        contact_email: document.getElementById('modalContactEmail').value.trim() || null,
        contact_phone: document.getElementById('modalContactPhone').value.trim() || null,
        website_url: document.getElementById('modalWebsiteUrl').value.trim() || null,
        footer_text: document.getElementById('modalFooterText').value.trim() || null
    };

    try {
        let result;
        if (editingId) {
            result = await supabaseClient
                .from('business_config')
                .update(configData)
                .eq('id', editingId)
                .select();
        } else {
            // New business — link to admin user
            configData.user_id = currentUser ? currentUser.id : null;
            result = await supabaseClient
                .from('business_config')
                .insert(configData)
                .select();
        }

        if (result.error) throw result.error;

        closeModal();
        showStatus(editingId ? 'Business updated successfully!' : 'Business added successfully!', 'success');
        await loadBusinesses();
    } catch (e) {
        console.error('Save error:', e);
        showStatus('Error saving: ' + e.message, 'error');
    }
}

// ========================================
// Delete Business
// ========================================

async function deleteBusiness(id, name) {
    if (!confirm(`Are you sure you want to delete "${name}"?\n\nThis cannot be undone.`)) return;

    try {
        const { error } = await supabaseClient
            .from('business_config')
            .delete()
            .eq('id', id);

        if (error) throw error;

        showStatus(`"${name}" deleted.`, 'success');
        await loadBusinesses();
    } catch (e) {
        showStatus('Error deleting: ' + e.message, 'error');
    }
}

// ========================================
// Copy Link
// ========================================

function copyLink(id) {
    const baseUrl = window.location.origin + window.location.pathname.replace('admin.html', '');
    const link = `${baseUrl}index.html?b=${id}`;

    navigator.clipboard.writeText(link).then(() => {
        showStatus('Link copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback
        prompt('Copy this link:', link);
    });
}

// ========================================
// Logo Upload
// ========================================

async function handleLogoUpload(input) {
    const file = input.files[0];
    if (!file) return;

    const statusEl = document.getElementById('logoUploadStatus');
    statusEl.style.display = 'block';
    statusEl.style.color = '#64748b';
    statusEl.textContent = 'Uploading...';

    try {
        // Create unique filename
        const ext = file.name.split('.').pop();
        const fileName = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { data, error } = await supabaseClient.storage
            .from('business-assets')
            .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabaseClient.storage
            .from('business-assets')
            .getPublicUrl(fileName);

        const publicUrl = urlData.publicUrl;
        document.getElementById('modalLogoUrl').value = publicUrl;

        // Show preview
        const preview = document.getElementById('logoPreviewAdmin');
        document.getElementById('logoPreviewImg').src = publicUrl;
        preview.style.display = '';

        statusEl.style.color = '#065f46';
        statusEl.textContent = 'Uploaded successfully!';
        setTimeout(() => { statusEl.style.display = 'none'; }, 3000);
    } catch (e) {
        console.error('Upload error:', e);
        statusEl.style.color = '#991b1b';
        statusEl.textContent = 'Upload failed: ' + e.message;
    }

    // Reset file input
    input.value = '';
}

// ========================================
// Utility Functions
// ========================================

function showStatus(message, type) {
    const el = document.getElementById('statusMessage');
    el.style.display = 'block';
    el.textContent = message;

    if (type === 'success') {
        el.style.background = '#d1fae5'; el.style.color = '#065f46'; el.style.border = '1px solid #a7f3d0';
    } else if (type === 'error') {
        el.style.background = '#fee2e2'; el.style.color = '#991b1b'; el.style.border = '1px solid #fecaca';
    }

    setTimeout(() => { el.style.display = 'none'; }, 4000);
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ========================================
// Tab Switching
// ========================================

function switchDashTab(tab) {
    document.getElementById('businessesTab').style.display = tab === 'businesses' ? '' : 'none';
    document.getElementById('usersTab').style.display = tab === 'users' ? '' : 'none';

    document.getElementById('tabBusinesses').classList.toggle('active', tab === 'businesses');
    document.getElementById('tabUsers').classList.toggle('active', tab === 'users');

    // Hide add business button when on users tab
    var addBtn = document.querySelector('.dash-toolbar .btn-add');
    if (addBtn) addBtn.style.display = tab === 'businesses' ? '' : 'none';

    if (tab === 'users') {
        loadUsers();
    }
}

// ========================================
// User Management
// ========================================

var allUsers = [];

async function loadUsers() {
    if (!supabaseClient) return;

    try {
        var { data, error } = await supabaseClient
            .from('user_profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (data && !error) {
            allUsers = data;
        } else {
            allUsers = [];
        }
    } catch (e) {
        console.log('Load users error:', e.message);
        allUsers = [];
    }

    renderUserCards();
}

function renderUserCards() {
    var grid = document.getElementById('usersGrid');
    var empty = document.getElementById('usersEmpty');
    var countEl = document.getElementById('userCount');

    countEl.textContent = allUsers.length + ' user' + (allUsers.length !== 1 ? 's' : '');

    if (allUsers.length === 0) {
        grid.innerHTML = '';
        empty.style.display = '';
        return;
    }

    empty.style.display = 'none';

    grid.innerHTML = allUsers.map(function(user) {
        var created = user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB') : 'N/A';

        return '<div class="user-card">' +
            '<div class="user-card-header">' +
                '<div>' +
                    '<h3 class="user-card-name">' + escapeHtml(user.full_name || 'No Name') + '</h3>' +
                    '<p class="user-card-email">' + escapeHtml(user.email || '') + '</p>' +
                '</div>' +
            '</div>' +
            '<div class="user-card-meta">' +
                '<span class="user-badge role-' + user.role + '">' + user.role + '</span>' +
                '<span class="user-badge status-' + user.subscription_status + '">' + user.subscription_status + '</span>' +
                '<span style="font-size:0.75rem;color:#94a3b8;">Joined ' + created + '</span>' +
            '</div>' +
            '<div class="user-card-actions">' +
                '<select onchange="updateUserRole(\'' + user.id + '\', this.value)">' +
                    '<option value="client"' + (user.role === 'client' ? ' selected' : '') + '>Client</option>' +
                    '<option value="solicitor"' + (user.role === 'solicitor' ? ' selected' : '') + '>Solicitor</option>' +
                    '<option value="admin"' + (user.role === 'admin' ? ' selected' : '') + '>Admin</option>' +
                '</select>' +
                '<select onchange="updateUserStatus(\'' + user.id + '\', this.value)">' +
                    '<option value="active"' + (user.subscription_status === 'active' ? ' selected' : '') + '>Active</option>' +
                    '<option value="trial"' + (user.subscription_status === 'trial' ? ' selected' : '') + '>Trial</option>' +
                    '<option value="inactive"' + (user.subscription_status === 'inactive' ? ' selected' : '') + '>Inactive</option>' +
                    '<option value="cancelled"' + (user.subscription_status === 'cancelled' ? ' selected' : '') + '>Cancelled</option>' +
                '</select>' +
            '</div>' +
        '</div>';
    }).join('');
}

async function updateUserRole(userId, newRole) {
    try {
        var { error } = await supabaseClient
            .from('user_profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) throw error;
        showStatus('Role updated to ' + newRole, 'success');
        loadUsers();
    } catch (e) {
        showStatus('Error updating role: ' + e.message, 'error');
    }
}

async function updateUserStatus(userId, newStatus) {
    try {
        var { error } = await supabaseClient
            .from('user_profiles')
            .update({ subscription_status: newStatus })
            .eq('id', userId);

        if (error) throw error;
        showStatus('Subscription updated to ' + newStatus, 'success');
        loadUsers();
    } catch (e) {
        showStatus('Error updating status: ' + e.message, 'error');
    }
}

// ========================================
// Init
// ========================================

document.addEventListener('DOMContentLoaded', async function() {
    initSupabase();
    var isLoggedIn = await checkAuth();
    if (isLoggedIn) {
        loadBusinesses();
    }
});

// Close modal on outside click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});
