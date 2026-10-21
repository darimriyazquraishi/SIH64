import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/api/client';
export const useComplaintsStore = defineStore('complaints', () => {
    const complaints = ref([]);
    const currentComplaint = ref(null);
    const total = ref(0);
    const page = ref(1);
    const perPage = ref(15);
    const pages = ref(1);
    const loading = ref(false);
    const error = ref(null);
    // Filters
    const search = ref('');
    const statusFilter = ref('');
    const priorityFilter = ref('');
    const bureauFilter = ref('');
    const isOverdueFilter = ref('');
    async function fetchComplaints() {
        loading.value = true;
        error.value = null;
        try {
            const params = {
                page: page.value,
                per_page: perPage.value,
            };
            if (search.value)
                params.search = search.value;
            if (statusFilter.value)
                params.status = statusFilter.value;
            if (priorityFilter.value)
                params.priority = priorityFilter.value;
            if (bureauFilter.value)
                params.bureau_id = bureauFilter.value;
            if (isOverdueFilter.value !== '')
                params.is_overdue = isOverdueFilter.value;
            const response = await apiClient.get('/complaints', { params });
            complaints.value = response.data.items;
            total.value = response.data.total;
            page.value = response.data.page;
            pages.value = response.data.pages;
        }
        catch (err) {
            error.value = err.response?.data?.error || 'Failed to fetch complaints';
        }
        finally {
            loading.value = false;
        }
    }
    async function fetchComplaintDetail(id) {
        loading.value = true;
        error.value = null;
        try {
            const response = await apiClient.get(`/complaints/${id}`);
            currentComplaint.value = response.data.complaint;
            return currentComplaint.value;
        }
        catch (err) {
            error.value = err.response?.data?.error || 'Failed to fetch complaint detail';
            return null;
        }
        finally {
            loading.value = false;
        }
    }
    async function createComplaint(data) {
        loading.value = true;
        error.value = null;
        try {
            const response = await apiClient.post('/complaints', data);
            await fetchComplaints();
            return { success: true, complaint: response.data.complaint };
        }
        catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to lodge complaint' };
        }
        finally {
            loading.value = false;
        }
    }
    async function updateStatus(complaintId, newStatus, remarks) {
        try {
            const response = await apiClient.post(`/complaints/${complaintId}/actions`, {
                status: newStatus,
                remarks,
            });
            currentComplaint.value = response.data.complaint;
            await fetchComplaints();
            return { success: true };
        }
        catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to update status' };
        }
    }
    async function assignOfficer(complaintId, userId, remarks) {
        try {
            const response = await apiClient.post(`/complaints/${complaintId}/assign`, {
                user_id: userId,
                remarks,
            });
            currentComplaint.value = response.data.complaint;
            await fetchComplaints();
            return { success: true };
        }
        catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to assign officer' };
        }
    }
    async function transferBureau(complaintId, targetBureauId, remarks) {
        try {
            const response = await apiClient.post(`/complaints/${complaintId}/transfer`, {
                target_bureau_id: targetBureauId,
                remarks,
            });
            currentComplaint.value = response.data.complaint;
            await fetchComplaints();
            return { success: true };
        }
        catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to transfer bureau' };
        }
    }
    function resetFilters() {
        search.value = '';
        statusFilter.value = '';
        priorityFilter.value = '';
        bureauFilter.value = '';
        isOverdueFilter.value = '';
        page.value = 1;
        fetchComplaints();
    }
    return {
        complaints,
        currentComplaint,
        total,
        page,
        perPage,
        pages,
        loading,
        error,
        search,
        statusFilter,
        priorityFilter,
        bureauFilter,
        isOverdueFilter,
        fetchComplaints,
        fetchComplaintDetail,
        createComplaint,
        updateStatus,
        assignOfficer,
        transferBureau,
        resetFilters,
    };
});
