import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNotificationsStore } from '@/stores/notifications';
import ThemeToggle from '@/components/ThemeToggle.vue';
import { Bell, Search, Plus, Home, FileText, GitCompare, Building2, BarChart3, Shield, UploadCloud, } from 'lucide-vue-next';
const authStore = useAuthStore();
const notifStore = useNotificationsStore();
const router = useRouter();
const route = useRoute();
const isNotifOpen = ref(false);
const searchQuery = ref('');
const searchInput = ref(null);
const pageDetails = computed(() => {
    const p = route.path;
    if (p === '/')
        return { title: 'Home', icon: Home };
    if (p.startsWith('/complaints'))
        return { title: 'Grievances', icon: FileText };
    if (p.startsWith('/overlaps'))
        return { title: 'Cross-Bureau Overlaps', icon: GitCompare };
    if (p.startsWith('/institutions'))
        return { title: 'Institutions', icon: Building2 };
    if (p.startsWith('/reports'))
        return { title: 'Reports & Analytics', icon: BarChart3 };
    if (p.startsWith('/notifications'))
        return { title: 'Notifications', icon: Bell };
    if (p.startsWith('/imports'))
        return { title: 'Data Ingestion', icon: UploadCloud };
    if (p.startsWith('/admin'))
        return { title: 'Administration', icon: Shield };
    return { title: 'AICTE Portal', icon: Home };
});
function handleSearchKeydown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInput.value?.focus();
    }
}
function handleSearchSubmit() {
    if (!searchQuery.value.trim())
        return;
    router.push({ path: '/complaints', query: { q: searchQuery.value.trim() } });
}
onMounted(() => {
    window.addEventListener('keydown', handleSearchKeydown);
    if (authStore.isAuthenticated) {
        notifStore.fetchNotifications();
    }
});
onUnmounted(() => {
    window.removeEventListener('keydown', handleSearchKeydown);
});
function handleNotificationClick(notif) {
    notifStore.markAsRead(notif.id);
    isNotifOpen.value = false;
    if (notif.related_complaint_id) {
        router.push(`/complaints/${notif.related_complaint_id}`);
    }
    else if (notif.notification_type === 'overlap_detected') {
        router.push('/overlaps');
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "flex h-16 items-center justify-between border-b md:rounded-t-2xl border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#1c1c1c] px-4 md:px-7 select-none transition-colors" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-4" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2" },
});
const __VLS_0 = ((__VLS_ctx.pageDetails.icon));
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "w-4 h-4 text-slate-700 dark:text-[#cccccc]" },
    'aria-hidden': "true",
}));
const __VLS_2 = __VLS_1({
    ...{ class: "w-4 h-4 text-slate-700 dark:text-[#cccccc]" },
    'aria-hidden': "true",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "text-base font-medium tracking-tight text-slate-900 dark:text-[#d4d4d4]" },
});
(__VLS_ctx.pageDetails.title);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hidden sm:flex items-center bg-slate-100 dark:bg-[#252526] rounded-xl px-3 py-1.5 w-64 md:w-80 border border-transparent focus-within:border-blue-500 dark:focus-within:border-[#007acc] transition" },
});
const __VLS_4 = {}.Search;
/** @type {[typeof __VLS_components.Search, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ class: "w-3.5 h-3.5 text-slate-400 dark:text-[#aaaaaa] shrink-0 mr-2" },
}));
const __VLS_6 = __VLS_5({
    ...{ class: "w-3.5 h-3.5 text-slate-400 dark:text-[#aaaaaa] shrink-0 mr-2" },
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    ...{ onKeydown: (__VLS_ctx.handleSearchSubmit) },
    ref: "searchInput",
    value: (__VLS_ctx.searchQuery),
    type: "text",
    placeholder: "Quick search cases, institutions...",
    ...{ class: "bg-transparent text-xs w-full text-slate-900 dark:text-[#cccccc] placeholder-slate-400 dark:placeholder-[#aaaaaa] focus:outline-none" },
});
/** @type {typeof __VLS_ctx.searchInput} */ ;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "hidden md:flex items-center gap-0.5 rounded bg-white dark:bg-[#1c1c1c] px-1.5 py-0.5 border border-slate-200 dark:border-[#383838] text-xs font-mono text-slate-400 dark:text-[#989898]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2 sm:gap-3" },
});
const __VLS_8 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    to: "/complaints?action=new",
    ...{ class: "inline-flex items-center gap-1.5 rounded-full bg-slate-900 dark:bg-[#007acc] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 dark:hover:bg-[#1177bb] transition shadow-sm" },
}));
const __VLS_10 = __VLS_9({
    to: "/complaints?action=new",
    ...{ class: "inline-flex items-center gap-1.5 rounded-full bg-slate-900 dark:bg-[#007acc] px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800 dark:hover:bg-[#1177bb] transition shadow-sm" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
const __VLS_12 = {}.Plus;
/** @type {[typeof __VLS_components.Plus, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ class: "w-3.5 h-3.5" },
}));
const __VLS_14 = __VLS_13({
    ...{ class: "w-3.5 h-3.5" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
var __VLS_11;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.isNotifOpen = !__VLS_ctx.isNotifOpen;
        } },
    type: "button",
    ...{ class: "rounded-full size-9 border border-slate-200 dark:border-[#2d2d2d] flex items-center justify-center text-slate-500 dark:text-[#989898] hover:bg-slate-100 dark:hover:bg-[#252526] hover:text-slate-900 dark:hover:text-white transition" },
    'aria-label': "View notifications",
});
const __VLS_16 = {}.Bell;
/** @type {[typeof __VLS_components.Bell, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ class: "w-4 h-4" },
}));
const __VLS_18 = __VLS_17({
    ...{ class: "w-4 h-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
if (__VLS_ctx.notifStore.unreadCount > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
        ...{ class: "absolute top-1 right-1 flex size-2 rounded-full bg-red-600 dark:bg-[#c72e2e]" },
    });
}
if (__VLS_ctx.isNotifOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] shadow-2xl z-50 overflow-hidden" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center justify-between border-b border-slate-100 dark:border-[#2d2d2d] px-4 py-3 bg-slate-50 dark:bg-[#1c1c1c]" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "text-xs font-semibold text-slate-900 dark:text-white" },
    });
    if (__VLS_ctx.notifStore.unreadCount > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "rounded px-1.5 py-0.5 bg-red-100 dark:bg-[#441416] text-xs font-medium text-red-700 dark:text-[#f48771]" },
        });
        (__VLS_ctx.notifStore.unreadCount);
    }
    if (__VLS_ctx.notifStore.unreadCount > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isNotifOpen))
                        return;
                    if (!(__VLS_ctx.notifStore.unreadCount > 0))
                        return;
                    __VLS_ctx.notifStore.markAllRead();
                } },
            ...{ class: "text-xs font-medium text-blue-600 dark:text-[#4fc1ff] hover:underline" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#2d2d2d]" },
    });
    for (const [notif] of __VLS_getVForSourceType((__VLS_ctx.notifStore.notifications.slice(0, 5)))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isNotifOpen))
                        return;
                    __VLS_ctx.handleNotificationClick(notif);
                } },
            key: (notif.id),
            ...{ class: "p-3 text-xs hover:bg-slate-50 dark:hover:bg-[#282828] cursor-pointer transition" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "flex items-start justify-between gap-2" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "font-medium text-slate-900 dark:text-[#cccccc]" },
        });
        (notif.title);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-xs text-slate-400 dark:text-[#989898] shrink-0" },
        });
        (notif.created_at?.slice(11, 16));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
            ...{ class: "mt-1 text-slate-500 dark:text-[#989898] leading-relaxed [text-wrap:pretty]" },
        });
        (notif.message);
    }
    if (__VLS_ctx.notifStore.notifications.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "p-6 text-center text-xs text-slate-400 dark:text-[#989898]" },
        });
    }
}
/** @type {[typeof ThemeToggle, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(ThemeToggle, new ThemeToggle({}));
const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-16']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['md:rounded-t-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-[#2d2d2d]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#1c1c1c]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['md:px-7']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-4']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#cccccc]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-base']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-tight']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#d4d4d4]']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#252526]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-64']} */ ;
/** @type {__VLS_StyleScopedClasses['md:w-80']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['focus-within:border-blue-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:focus-within:border-[#007acc]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#aaaaaa]']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mr-2']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-transparent']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#cccccc]']} */ ;
/** @type {__VLS_StyleScopedClasses['placeholder-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:placeholder-[#aaaaaa]']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['md:flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#1c1c1c]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-[#383838]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#989898]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:gap-3']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#007acc]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-[#1177bb]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['size-9']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-[#2d2d2d]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#989898]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-[#252526]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['top-1']} */ ;
/** @type {__VLS_StyleScopedClasses['right-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['size-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#c72e2e]']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['right-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-80']} */ ;
/** @type {__VLS_StyleScopedClasses['sm:w-96']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-[#2d2d2d]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#252526]']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-2xl']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-hidden']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['border-b']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-[#2d2d2d]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-4']} */ ;
/** @type {__VLS_StyleScopedClasses['py-3']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#1c1c1c]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#441416]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-red-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#f48771]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-blue-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#4fc1ff]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:underline']} */ ;
/** @type {__VLS_StyleScopedClasses['max-h-80']} */ ;
/** @type {__VLS_StyleScopedClasses['overflow-y-auto']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-y']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:divide-[#2d2d2d]']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-slate-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-[#282828]']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor-pointer']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-start']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#cccccc]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#989898]']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#989898]']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['[text-wrap:pretty]']} */ ;
/** @type {__VLS_StyleScopedClasses['p-6']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#989898]']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ThemeToggle: ThemeToggle,
            Bell: Bell,
            Search: Search,
            Plus: Plus,
            notifStore: notifStore,
            isNotifOpen: isNotifOpen,
            searchQuery: searchQuery,
            searchInput: searchInput,
            pageDetails: pageDetails,
            handleSearchSubmit: handleSearchSubmit,
            handleNotificationClick: handleNotificationClick,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
