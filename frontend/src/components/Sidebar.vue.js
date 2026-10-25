import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useOverlapsStore } from '@/stores/overlaps';
import { LayoutDashboard, FileText, GitCompare, Building2, BarChart3, Bell, UploadCloud, Settings, ShieldAlert, } from 'lucide-vue-next';
const route = useRoute();
const authStore = useAuthStore();
const overlapsStore = useOverlapsStore();
const navigation = computed(() => [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Complaints', path: '/complaints', icon: FileText },
    {
        name: 'Overlaps',
        path: '/overlaps',
        icon: GitCompare,
        badge: overlapsStore.pendingCount > 0 ? overlapsStore.pendingCount : null,
    },
    { name: 'Institutions', path: '/institutions', icon: Building2 },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Import', path: '/imports', icon: UploadCloud },
    ...(authStore.isAdmin ? [{ name: 'Administration', path: '/admin', icon: Settings }] : []),
]);
function isActive(path) {
    if (path === '/')
        return route.path === '/';
    return route.path.startsWith(path);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.aside, __VLS_intrinsicElements.aside)({
    ...{ class: "w-64 border-r border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] min-h-[calc(100vh-4rem)] flex flex-col justify-between p-3.5 transition-colors" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#858585]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
    ...{ class: "mt-2 space-y-0.5" },
    'aria-label': "Portal Navigation",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.navigation))) {
    const __VLS_0 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        key: (item.name),
        to: (item.path),
        ...{ class: ([
                'group flex items-center justify-between rounded px-3 py-2 text-xs font-medium transition-colors',
                __VLS_ctx.isActive(item.path)
                    ? 'bg-slate-100 dark:bg-[#37373d] text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-[#cccccc] hover:bg-slate-50 dark:hover:bg-[#2a2d2e] hover:text-slate-900 dark:hover:text-white',
            ]) },
    }));
    const __VLS_2 = __VLS_1({
        key: (item.name),
        to: (item.path),
        ...{ class: ([
                'group flex items-center justify-between rounded px-3 py-2 text-xs font-medium transition-colors',
                __VLS_ctx.isActive(item.path)
                    ? 'bg-slate-100 dark:bg-[#37373d] text-slate-900 dark:text-white font-semibold'
                    : 'text-slate-600 dark:text-[#cccccc] hover:bg-slate-50 dark:hover:bg-[#2a2d2e] hover:text-slate-900 dark:hover:text-white',
            ]) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-2.5" },
    });
    const __VLS_4 = ((item.icon));
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ class: ([
                'h-4 w-4 transition-colors',
                __VLS_ctx.isActive(item.path)
                    ? 'text-blue-600 dark:text-[#007acc]'
                    : 'text-slate-400 dark:text-[#858585] group-hover:text-slate-600 dark:group-hover:text-[#cccccc]',
            ]) },
        'aria-hidden': "true",
    }));
    const __VLS_6 = __VLS_5({
        ...{ class: ([
                'h-4 w-4 transition-colors',
                __VLS_ctx.isActive(item.path)
                    ? 'text-blue-600 dark:text-[#007acc]'
                    : 'text-slate-400 dark:text-[#858585] group-hover:text-slate-600 dark:group-hover:text-[#cccccc]',
            ]) },
        'aria-hidden': "true",
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.name);
    if (item.badge) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-amber-600 dark:bg-[#cca700] text-xs font-semibold text-white dark:text-[#1e1e1e]" },
        });
        (item.badge);
    }
    var __VLS_3;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "rounded border border-slate-200 dark:border-[#2d2d2d] bg-slate-50 dark:bg-[#1e1e1e] p-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2 text-slate-800 dark:text-[#d4d4d4] font-medium text-xs" },
});
const __VLS_8 = {}.ShieldAlert;
/** @type {[typeof __VLS_components.ShieldAlert, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ class: "w-4 h-4 text-amber-600 dark:text-[#cca700]" },
    'aria-hidden': "true",
}));
const __VLS_10 = __VLS_9({
    ...{ class: "w-4 h-4 text-amber-600 dark:text-[#cca700]" },
    'aria-hidden': "true",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "mt-1 text-xs text-slate-500 dark:text-[#858585] leading-relaxed" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "border-t border-slate-100 dark:border-[#2d2d2d] pt-3 px-3" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between text-xs text-slate-400 dark:text-[#858585]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "font-mono" },
});
/** @type {__VLS_StyleScopedClasses['w-64']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-[#2d2d2d]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#252526]']} */ ;
/** @type {__VLS_StyleScopedClasses['min-h-[calc(100vh-4rem)]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#858585]']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-5']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-[20px]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-amber-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#cca700]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#1e1e1e]']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-[#2d2d2d]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#1e1e1e]']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#d4d4d4]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-amber-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#cca700]']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#858585]']} */ ;
/** @type {__VLS_StyleScopedClasses['leading-relaxed']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-[#2d2d2d]']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['px-3']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#858585]']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            ShieldAlert: ShieldAlert,
            navigation: navigation,
            isActive: isActive,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
