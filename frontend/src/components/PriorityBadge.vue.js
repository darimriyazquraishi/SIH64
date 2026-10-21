import { computed } from 'vue';
const props = defineProps();
const config = computed(() => {
    switch (props.priority?.toLowerCase()) {
        case 'critical':
            return {
                bg: 'bg-red-50 text-red-700 border-red-300 font-semibold',
                dot: 'bg-red-600 animate-ping',
                text: 'Critical',
            };
        case 'high':
            return {
                bg: 'bg-amber-50 text-amber-800 border-amber-300',
                dot: 'bg-amber-600',
                text: 'High',
            };
        case 'medium':
            return {
                bg: 'bg-blue-50 text-blue-800 border-blue-300',
                dot: 'bg-blue-600',
                text: 'Medium',
            };
        case 'low':
            return {
                bg: 'bg-slate-100 text-slate-700 border-slate-300',
                dot: 'bg-slate-500',
                text: 'Low',
            };
        default:
            return {
                bg: 'bg-slate-100 text-slate-700 border-slate-300',
                dot: 'bg-slate-500',
                text: props.priority || 'Medium',
            };
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: ([
            'inline-flex items-center gap-1.5 border rounded-full',
            props.size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs font-medium',
            __VLS_ctx.config.bg,
        ]) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "relative flex h-2 w-2" },
});
if (props.priority?.toLowerCase() === 'critical') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
        ...{ class: "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" },
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
    ...{ class: (['relative inline-flex rounded-full h-2 w-2', __VLS_ctx.config.dot]) },
});
(__VLS_ctx.config.text);
/** @type {__VLS_StyleScopedClasses['relative']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-2']} */ ;
/** @type {__VLS_StyleScopedClasses['w-2']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-ping']} */ ;
/** @type {__VLS_StyleScopedClasses['absolute']} */ ;
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded-full']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-red-400']} */ ;
/** @type {__VLS_StyleScopedClasses['opacity-75']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            config: config,
        };
    },
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
