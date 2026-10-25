import { useTheme } from '@/composables/useTheme';
import { Sun, Moon } from 'lucide-vue-next';
const { theme, toggleTheme } = useTheme();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.toggleTheme) },
    type: "button",
    ...{ class: "relative rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-[#858585] dark:hover:bg-[#2d2d2d] dark:hover:text-[#cccccc] transition-colors focus:outline-none focus:ring-1 focus:ring-[#007acc]" },
    title: (__VLS_ctx.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'),
    'aria-label': "Toggle color theme",
});
if (__VLS_ctx.theme === 'dark') {
    const __VLS_0 = {}.Sun;
    /** @type {[typeof __VLS_components.Sun, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "h-4 w-4 text-[#cca700] transition-transform duration-200" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "h-4 w-4 text-[#cca700] transition-transform duration-200" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
else {
    const __VLS_4 = {}.Moon;
    /** @type {[typeof __VLS_components.Moon, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ class: "h-4 w-4 text-slate-600 transition-transform duration-200" },
    }));
    const __VLS_6 = __VLS_5({
        ...{ class: "h-4 w-4 text-slate-600 transition-transform duration-200" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
}
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['p-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:bg-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['hover:text-slate-800']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:text-[#858585]']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:bg-[#2d2d2d]']} */ ;
/** @type {__VLS_StyleScopedClasses['dark:hover:text-[#cccccc]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-colors']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:outline-none']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-1']} */ ;
/** @type {__VLS_StyleScopedClasses['focus:ring-[#007acc]']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-[#cca700]']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
/** @type {__VLS_StyleScopedClasses['h-4']} */ ;
/** @type {__VLS_StyleScopedClasses['w-4']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-600']} */ ;
/** @type {__VLS_StyleScopedClasses['transition-transform']} */ ;
/** @type {__VLS_StyleScopedClasses['duration-200']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            Sun: Sun,
            Moon: Moon,
            theme: theme,
            toggleTheme: toggleTheme,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
