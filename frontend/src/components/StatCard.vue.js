import { computed } from 'vue';
const props = defineProps();
const borderClass = computed(() => {
    switch (props.variant) {
        case 'danger':
            return 'border-l-4 border-l-red-500 border-slate-200';
        case 'warning':
            return 'border-l-4 border-l-amber-500 border-slate-200';
        case 'success':
            return 'border-l-4 border-l-emerald-500 border-slate-200';
        case 'info':
            return 'border-l-4 border-l-blue-600 border-slate-200';
        default:
            return 'border-slate-200';
    }
});
const valueColor = computed(() => {
    switch (props.variant) {
        case 'danger':
            return 'text-red-700';
        case 'warning':
            return 'text-amber-800';
        case 'success':
            return 'text-emerald-700';
        case 'info':
            return 'text-blue-700';
        default:
            return 'text-slate-900';
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: ([
            'bg-white rounded-lg border p-5 shadow-subtle transition-all duration-150 hover:shadow-elevated',
            __VLS_ctx.borderClass,
        ]) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "flex items-center justify-between" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "text-xs font-medium uppercase tracking-wider text-slate-500" },
});
(props.title);
var __VLS_0 = {};
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "mt-2.5 flex items-baseline gap-2" },
});
if (props.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div)({
        ...{ class: "h-8 w-16 animate-pulse rounded bg-slate-100" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (['text-2xl font-bold tracking-tight', __VLS_ctx.valueColor]) },
    });
    (props.value);
}
if (props.subtitle) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "mt-1 text-xs text-slate-500" },
    });
    (props.subtitle);
}
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['justify-between']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['font-medium']} */ ;
/** @type {__VLS_StyleScopedClasses['uppercase']} */ ;
/** @type {__VLS_StyleScopedClasses['tracking-wider']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-2.5']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-baseline']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['h-8']} */ ;
/** @type {__VLS_StyleScopedClasses['w-16']} */ ;
/** @type {__VLS_StyleScopedClasses['animate-pulse']} */ ;
/** @type {__VLS_StyleScopedClasses['rounded']} */ ;
/** @type {__VLS_StyleScopedClasses['bg-slate-100']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['text-slate-500']} */ ;
// @ts-ignore
var __VLS_1 = __VLS_0;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            borderClass: borderClass,
            valueColor: valueColor,
        };
    },
    __typeProps: {},
});
const __VLS_component = (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
});
export default {};
; /* PartiallyEnd: #4569/main.vue */
