import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useOverlapsStore } from '@/stores/overlaps';
import { useTheme } from '@/composables/useTheme';
import DemostackIcon from '@/components/demostack/DemostackIcon.vue';
import { Building2, BarChart3, Bell, UploadCloud, Shield, Sun, Moon, ChevronDown, } from 'lucide-vue-next';
const route = useRoute();
const authStore = useAuthStore();
const overlapsStore = useOverlapsStore();
const { theme, toggleTheme } = useTheme();
const isDark = computed(() => theme.value === 'dark');
const isOrgMenuOpen = ref(false);
const isProfileMenuOpen = ref(false);
const selectedBureau = ref('AICTE Central HQ');
const bureaus = [
    { code: 'HQ', name: 'AICTE Central HQ', role: 'Apex Regulatory Authority' },
    { code: 'PGRC', name: 'Public Grievance Redressal', role: 'Citizen & Student Intake' },
    { code: 'AB', name: 'Approval Bureau', role: 'Institutions & EOA' },
    { code: 'RPC', name: 'Ragging Prevention Cell', role: 'Statutory Anti-Ragging' },
    { code: 'PAPB', name: 'Policy & Planning', role: 'Faculty & Norms' },
    { code: 'VIG', name: 'Vigilance & Ethics Cell', role: 'Integrity Investigations' },
];
const workspaceNav = computed(() => [
    { name: 'Home', path: '/', iconName: 'HomeIcon' },
    {
        name: 'Grievances',
        path: '/complaints',
        iconName: 'DemostacksIcon',
        badge: 'Live',
    },
    {
        name: 'Overlaps',
        path: '/overlaps',
        iconName: 'ShowcasesIcon',
        badge: overlapsStore.pendingCount > 0 ? `${overlapsStore.pendingCount} AI` : 'AI',
    },
    { name: 'Institutions', path: '/institutions', iconLucide: Building2 },
    { name: 'Reports', path: '/reports', iconLucide: BarChart3 },
]);
const adminNav = computed(() => [
    ...(authStore.isAdmin ? [{ name: 'Administration', path: '/admin', iconLucide: Shield }] : []),
    { name: 'Notifications', path: '/notifications', iconLucide: Bell },
    { name: 'Data Ingestion', path: '/imports', iconLucide: UploadCloud },
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
    ...{ class: "w-64 border-r border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#1c1c1c] h-full flex flex-col justify-between p-3.5 transition-colors select-none" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "space-y-6" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.isOrgMenuOpen = !__VLS_ctx.isOrgMenuOpen;
        } },
    type: "button",
    ...{ class: "w-full flex items-center justify-between p-2 rounded-xl border border-slate-200 dark:border-[#2d2d2d] bg-slate-50 dark:bg-[#252526] hover:bg-slate-100 dark:hover:bg-[#2a2d2e] transition text-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center gap-2.5 min-w-0" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "size-8 rounded-lg bg-indigo-600 dark:bg-[#007acc] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "min-w-0 flex-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "font-medium text-xs text-slate-900 dark:text-[#d4d4d4] truncate" },
});
(__VLS_ctx.selectedBureau);
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-xs text-slate-500 dark:text-[#989898] truncate" },
});
const __VLS_0 = {}.ChevronDown;
/** @type {[typeof __VLS_components.ChevronDown, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ class: "w-3.5 h-3.5 text-slate-400 dark:text-[#989898] shrink-0 ml-1" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "w-3.5 h-3.5 text-slate-400 dark:text-[#989898] shrink-0 ml-1" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
if (__VLS_ctx.isOrgMenuOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "absolute left-0 top-full mt-1.5 w-60 rounded-xl border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] shadow-xl z-50 p-1.5 divide-y divide-slate-100 dark:divide-[#2d2d2d]" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#989898]" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "py-1" },
    });
    for (const [b] of __VLS_getVForSourceType((__VLS_ctx.bureaus))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isOrgMenuOpen))
                        return;
                    __VLS_ctx.selectedBureau = b.name;
                    __VLS_ctx.isOrgMenuOpen = false;
                } },
            key: (b.code),
            type: "button",
            ...{ class: ([
                    'w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex flex-col',
                    __VLS_ctx.selectedBureau === b.name
                        ? 'bg-slate-100 dark:bg-[#37373d] text-slate-900 dark:text-white font-medium'
                        : 'text-slate-600 dark:text-[#cccccc] hover:bg-slate-50 dark:hover:bg-[#2a2d2e]'
                ]) },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "font-medium" },
        });
        (b.code);
        (b.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "text-xs text-slate-400 dark:text-[#989898]" },
        });
        (b.role);
    }
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-2.5 px-0.5" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between text-xs text-slate-400 dark:text-[#989898]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex flex-wrap gap-1 mt-1.5" },
});
for (const [b] of __VLS_getVForSourceType((__VLS_ctx.bureaus))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        key: (b.code),
        title: (b.name),
        ...{ class: "rounded bg-slate-100 dark:bg-[#252526] px-1.5 py-0.5 text-xs font-mono font-medium text-slate-700 dark:text-[#cccccc] border border-slate-200 dark:border-[#2d2d2d]" },
    });
    (b.code);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#989898] mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
    ...{ class: "space-y-1" },
    'aria-label': "Workspace Navigation",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.workspaceNav))) {
    const __VLS_4 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        key: (item.name),
        to: (item.path),
        ...{ class: ([
                'group flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors',
                __VLS_ctx.isActive(item.path)
                    ? 'bg-slate-100 dark:bg-[#282828] text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-[#383838]'
                    : 'text-slate-600 dark:text-[#cccccc] hover:bg-slate-50 dark:hover:bg-[#222222] hover:text-slate-900 dark:hover:text-white border border-transparent'
            ]) },
    }));
    const __VLS_6 = __VLS_5({
        key: (item.name),
        to: (item.path),
        ...{ class: ([
                'group flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors',
                __VLS_ctx.isActive(item.path)
                    ? 'bg-slate-100 dark:bg-[#282828] text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-[#383838]'
                    : 'text-slate-600 dark:text-[#cccccc] hover:bg-slate-50 dark:hover:bg-[#222222] hover:text-slate-900 dark:hover:text-white border border-transparent'
            ]) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-2.5" },
    });
    if (item.iconName) {
        /** @type {[typeof DemostackIcon, ]} */ ;
        // @ts-ignore
        const __VLS_8 = __VLS_asFunctionalComponent(DemostackIcon, new DemostackIcon({
            name: (item.iconName),
            className: ([
                'w-4 h-4 transition-colors',
                __VLS_ctx.isActive(item.path)
                    ? 'text-indigo-600 dark:text-[#4fc1ff]'
                    : 'text-slate-400 dark:text-[#989898] group-hover:text-slate-700 dark:group-hover:text-[#cccccc]'
            ]),
        }));
        const __VLS_9 = __VLS_8({
            name: (item.iconName),
            className: ([
                'w-4 h-4 transition-colors',
                __VLS_ctx.isActive(item.path)
                    ? 'text-indigo-600 dark:text-[#4fc1ff]'
                    : 'text-slate-400 dark:text-[#989898] group-hover:text-slate-700 dark:group-hover:text-[#cccccc]'
            ]),
        }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    }
    else {
        const __VLS_11 = ((item.iconLucide));
        // @ts-ignore
        const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({
            ...{ class: ([
                    'w-4 h-4 transition-colors',
                    __VLS_ctx.isActive(item.path)
                        ? 'text-indigo-600 dark:text-[#4fc1ff]'
                        : 'text-slate-400 dark:text-[#989898] group-hover:text-slate-700 dark:group-hover:text-[#cccccc]'
                ]) },
        }));
        const __VLS_13 = __VLS_12({
            ...{ class: ([
                    'w-4 h-4 transition-colors',
                    __VLS_ctx.isActive(item.path)
                        ? 'text-indigo-600 dark:text-[#4fc1ff]'
                        : 'text-slate-400 dark:text-[#989898] group-hover:text-slate-700 dark:group-hover:text-[#cccccc]'
                ]) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.name);
    if (item.badge) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "rounded bg-indigo-50 dark:bg-[#4fc1ff]/15 px-1.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-[#4fc1ff]" },
        });
        (item.badge);
    }
    var __VLS_7;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#989898] mb-2" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
    ...{ class: "space-y-1" },
    'aria-label': "Admin Navigation",
});
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.adminNav))) {
    const __VLS_15 = {}.RouterLink;
    /** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(__VLS_15, new __VLS_15({
        key: (item.name),
        to: (item.path),
        ...{ class: ([
                'group flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors',
                __VLS_ctx.isActive(item.path)
                    ? 'bg-slate-100 dark:bg-[#282828] text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-[#383838]'
                    : 'text-slate-600 dark:text-[#cccccc] hover:bg-slate-50 dark:hover:bg-[#222222] hover:text-slate-900 dark:hover:text-white border border-transparent'
            ]) },
    }));
    const __VLS_17 = __VLS_16({
        key: (item.name),
        to: (item.path),
        ...{ class: ([
                'group flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors',
                __VLS_ctx.isActive(item.path)
                    ? 'bg-slate-100 dark:bg-[#282828] text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-[#383838]'
                    : 'text-slate-600 dark:text-[#cccccc] hover:bg-slate-50 dark:hover:bg-[#222222] hover:text-slate-900 dark:hover:text-white border border-transparent'
            ]) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    __VLS_18.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "flex items-center gap-2.5" },
    });
    const __VLS_19 = ((item.iconLucide));
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent(__VLS_19, new __VLS_19({
        ...{ class: ([
                'w-4 h-4 transition-colors',
                __VLS_ctx.isActive(item.path)
                    ? 'text-indigo-600 dark:text-[#4fc1ff]'
                    : 'text-slate-400 dark:text-[#989898] group-hover:text-slate-700 dark:group-hover:text-[#cccccc]'
            ]) },
    }));
    const __VLS_21 = __VLS_20({
        ...{ class: ([
                'w-4 h-4 transition-colors',
                __VLS_ctx.isActive(item.path)
                    ? 'text-indigo-600 dark:text-[#4fc1ff]'
                    : 'text-slate-400 dark:text-[#989898] group-hover:text-slate-700 dark:group-hover:text-[#cccccc]'
            ]) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (item.name);
    var __VLS_18;
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "relative pt-3 border-t border-slate-200 dark:border-[#2d2d2d]" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.isProfileMenuOpen = !__VLS_ctx.isProfileMenuOpen;
        } },
    type: "button",
    ...{ class: "w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#252526] transition text-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "size-9 rounded-full bg-slate-900 dark:bg-[#007acc] text-white flex items-center justify-center font-bold text-xs shrink-0" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "min-w-0 flex-1" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "font-medium text-xs text-slate-900 dark:text-[#d4d4d4] truncate" },
});
(__VLS_ctx.authStore.user?.name || 'Dr. Rajiv Sharma');
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-xs text-slate-500 dark:text-[#989898] truncate" },
});
(__VLS_ctx.authStore.user?.email || 'admin@aicte.gov.in');
const __VLS_23 = {}.ChevronDown;
/** @type {[typeof __VLS_components.ChevronDown, ]} */ ;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent(__VLS_23, new __VLS_23({
    ...{ class: "w-3.5 h-3.5 text-slate-400 dark:text-[#989898] shrink-0" },
}));
const __VLS_25 = __VLS_24({
    ...{ class: "w-3.5 h-3.5 text-slate-400 dark:text-[#989898] shrink-0" },
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
if (__VLS_ctx.isProfileMenuOpen) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "absolute bottom-full left-0 mb-2 w-60 rounded-xl border border-slate-200 dark:border-[#2d2d2d] bg-white dark:bg-[#252526] shadow-xl z-50 p-1.5 divide-y divide-slate-100 dark:divide-[#2d2d2d]" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "px-2 py-2" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs font-semibold text-slate-900 dark:text-white" },
    });
    (__VLS_ctx.authStore.user?.name || 'Dr. Rajiv Sharma');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "text-xs text-slate-500 dark:text-[#989898]" },
    });
    (__VLS_ctx.authStore.user?.role || 'Director IT & Chief Administrator');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "py-1" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.isProfileMenuOpen))
                    return;
                __VLS_ctx.toggleTheme();
                __VLS_ctx.isProfileMenuOpen = false;
            } },
        type: "button",
        ...{ class: "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-[#cccccc] hover:bg-slate-50 dark:hover:bg-[#2a2d2e] transition" },
    });
    if (__VLS_ctx.isDark) {
        const __VLS_27 = {}.Sun;
        /** @type {[typeof __VLS_components.Sun, ]} */ ;
        // @ts-ignore
        const __VLS_28 = __VLS_asFunctionalComponent(__VLS_27, new __VLS_27({
            ...{ class: "w-3.5 h-3.5" },
        }));
        const __VLS_29 = __VLS_28({
            ...{ class: "w-3.5 h-3.5" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    }
    else {
        const __VLS_31 = {}.Moon;
        /** @type {[typeof __VLS_components.Moon, ]} */ ;
        // @ts-ignore
        const __VLS_32 = __VLS_asFunctionalComponent(__VLS_31, new __VLS_31({
            ...{ class: "w-3.5 h-3.5" },
        }));
        const __VLS_33 = __VLS_32({
            ...{ class: "w-3.5 h-3.5" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.isDark ? 'Light' : 'Dark');
}
/** @type {__VLS_StyleScopedClasses['w-64']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-[#2d2d2d]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#1c1c1c]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-col']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['p-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['select-none']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-6']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-[#2d2d2d]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#252526]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-[#2a2d2e]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['size-8']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-indigo-600']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#007acc]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-sm']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#d4d4d4]']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#989898]']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#989898]']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-1']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['top-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-60']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-[#2d2d2d]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#252526]']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-y']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:divide-[#2d2d2d]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#989898]']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#989898]']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['px-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#989898]']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-wrap']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#252526]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-mono']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#cccccc]']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-[#2d2d2d]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#989898]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-indigo-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#4fc1ff]/15']} */ ;
/** @type {__VLS_StyleScopedClasses['px-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-0.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-indigo-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#4fc1ff]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#989898]']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['space-y-1']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['pt-3']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-[#2d2d2d]']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['p-2']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-[#252526]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['text-left']} */ ;
/** @type {__VLS_StyleScopedClasses['size-9']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#007acc]']} */ ;
/** @type {__VLS_StyleScopedClasses['text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-center']} */ ;
/** @type {__VLS_StyleScopedClasses['font-bold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['min-w-0']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-1']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#d4d4d4]']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#989898]']} */ ;
/** @type {__VLS_StyleScopedClasses['truncate']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-400']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#989898]']} */ ;
/** @type {__VLS_StyleScopedClasses['shrink-0']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-full']} */ ;
/** @type {__VLS_StyleScopedClasses['left-0']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-60']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
/** @type {__VLS_StyleScopedClasses['border-slate-200']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:border-[#2d2d2d]']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-white']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:bg-[#252526]']} */ ;
/** @type {__VLS_StyleScopedClasses['shadow-xl']} */ ;
/** @type {__VLS_StyleScopedClasses['z-50']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-y']} */ ;
/** @type {__VLS_StyleScopedClasses['divide-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:divide-[#2d2d2d]']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2']} */ ;
/** @type {__VLS_StyleScopedClasses['py-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-semibold']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-900']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-white']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#989898]']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['px-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['py-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-lg']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-700']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#cccccc]']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-slate-50']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-[#2a2d2e]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['w-3.5']} */ ;
/** @type {__VLS_StyleScopedClasses['h-3.5']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DemostackIcon: DemostackIcon,
            Sun: Sun,
            Moon: Moon,
            ChevronDown: ChevronDown,
            authStore: authStore,
            toggleTheme: toggleTheme,
            isDark: isDark,
            isOrgMenuOpen: isOrgMenuOpen,
            isProfileMenuOpen: isProfileMenuOpen,
            selectedBureau: selectedBureau,
            bureaus: bureaus,
            workspaceNav: workspaceNav,
            adminNav: adminNav,
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
