import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiClient from '@/api/client';
export const useOverlapsStore = defineStore('overlaps', () => {
    const overlaps = ref([]);
    const pendingCount = ref(0);
    const total = ref(0);
    const loading = ref(false);
    const error = ref(null);
    async function fetchOverlaps(reviewStatus = 'pending') {
        loading.value = true;
        error.value = null;
        try {
            const response = await apiClient.get('/overlaps', {
                params: { review_status: reviewStatus }
            });
            overlaps.value = response.data.overlaps;
            total.value = response.data.total;
            pendingCount.value = response.data.pending_count;
        }
        catch (err) {
            error.value = err.response?.data?.error || 'Failed to fetch potential overlaps';
        }
        finally {
            loading.value = false;
        }
    }
    async function reviewOverlap(linkId, decision, remarks) {
        try {
            const response = await apiClient.post(`/overlaps/${linkId}/review`, {
                decision,
                remarks,
            });
            // Refresh current queue
            await fetchOverlaps();
            return { success: true, overlap: response.data.overlap };
        }
        catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to submit review' };
        }
    }
    async function rescanAll() {
        loading.value = true;
        try {
            const response = await apiClient.post('/overlaps/rescan');
            await fetchOverlaps();
            return { success: true, message: response.data.message };
        }
        catch (err) {
            return { success: false, error: err.response?.data?.error || 'Failed to run overlap rescan' };
        }
        finally {
            loading.value = false;
        }
    }
    return {
        overlaps,
        pendingCount,
        total,
        loading,
        error,
        fetchOverlaps,
        reviewOverlap,
        rescanAll,
    };
});
