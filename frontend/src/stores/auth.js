import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/api/client';
export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('aicte_token'));
    const user = ref(localStorage.getItem('aicte_user')
        ? JSON.parse(localStorage.getItem('aicte_user'))
        : null);
    const loading = ref(false);
    const error = ref(null);
    const isAuthenticated = computed(() => !!token.value && !!user.value);
    const isAdmin = computed(() => user.value?.role === 'admin');
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
        if (!token.value)
            return;
        try {
            const response = await apiClient.get('/auth/me');
            user.value = response.data.user;
            localStorage.setItem('aicte_user', JSON.stringify(response.data.user));
        }
        catch (err) {
            logout();
        }
    }
    async function logout() {
        try {
            if (token.value) {
                await apiClient.post('/auth/logout');
            }
        }
        catch (err) {
            // Ignore network errors on logout
        }
        finally {
            token.value = null;
            user.value = null;
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
