import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/api/client';
const defaultAdminUser = {
    id: 1,
    name: 'System Administrator',
    email: 'admin@aicte.gov.in',
    role: 'admin',
    bureau_id: null,
    bureau_code: null,
    bureau_name: null,
    is_active: true,
    created_at: new Date().toISOString(),
};
export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('aicte_token') || 'dev_bypass_token');
    const user = ref(localStorage.getItem('aicte_user')
        ? JSON.parse(localStorage.getItem('aicte_user'))
        : defaultAdminUser);
    const loading = ref(false);
    const error = ref(null);
    const isAuthenticated = computed(() => true);
    const isAdmin = computed(() => !user.value || user.value?.role === 'admin');
    const isOfficer = computed(() => user.value?.role === 'officer');
    const isSeniorAuthority = computed(() => user.value?.role === 'senior_authority');
    const userBureauCode = computed(() => user.value?.bureau_code || null);
    async function login(email, password) {
        loading.value = true;
        error.value = null;
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            token.value = response.data.token;
            user.value = response.data.user;
            localStorage.setItem('aicte_token', response.data.token);
            localStorage.setItem('aicte_user', JSON.stringify(response.data.user));
            return true;
        }
        catch (err) {
            error.value = err.response?.data?.error || 'Authentication failed. Please verify credentials.';
            return false;
        }
        finally {
            loading.value = false;
        }
    }
    async function fetchMe() {
        try {
            const response = await apiClient.get('/auth/me');
            if (response.data?.user) {
                user.value = response.data.user;
                localStorage.setItem('aicte_user', JSON.stringify(response.data.user));
            }
        }
        catch (err) {
            // Keep default admin user fallback if not logged in
            if (!user.value) {
                user.value = defaultAdminUser;
            }
        }
    }
    async function logout() {
        try {
            if (token.value && token.value !== 'dev_bypass_token') {
                await apiClient.post('/auth/logout');
            }
        }
        catch (err) {
            // Ignore network errors on logout
        }
        finally {
            token.value = 'dev_bypass_token';
            user.value = defaultAdminUser;
            localStorage.removeItem('aicte_token');
            localStorage.removeItem('aicte_user');
        }
    }
    return {
        token,
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        isOfficer,
        isSeniorAuthority,
        userBureauCode,
        login,
        logout,
        fetchMe,
    };
});
