import { computed } from 'vue';
import { ChevronsUp, ChevronUp, Minus, ChevronDown } from 'lucide-vue-next';
const props = withDefaults(defineProps(), {
    size: 'sm',
    variant: 'inline',
});
const config = computed(() => {
    switch (props.priority?.toLowerCase()) {
        case 'critical':
            return {
                icon: ChevronsUp,
                iconColor: 'text-red-600 dark:text-[#f48771]',
                textColor: 'text-red-700 dark:text-[#f48771] font-semibold',
                tagBg: 'bg-red-50 text-red-700 border-red-200 dark:bg-[#f48771]/15 dark:text-[#f48771] dark:border-[#f48771]/30',
                dotColor: 'bg-red-600 dark:bg-[#f14c4c]',
                label: 'Critical',
            };
        case 'high':
            return {
                icon: ChevronUp,
                iconColor: 'text-amber-600 dark:text-[#ce9178]',
                textColor: 'text-amber-800 dark:text-[#ce9178] font-medium',
                tagBg: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-[#ce9178]/15 dark:text-[#ce9178] dark:border-[#ce9178]/30',
                dotColor: 'bg-amber-600 dark:bg-[#ce9178]',
                label: 'High',
            };
        case 'medium':
            return {
                icon: Minus,
                iconColor: 'text-blue-600 dark:text-[#4fc1ff]',
                textColor: 'text-blue-800 dark:text-[#4fc1ff] font-medium',
                tagBg: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-[#4fc1ff]/15 dark:text-[#4fc1ff] dark:border-[#4fc1ff]/30',
                dotColor: 'bg-blue-600 dark:bg-[#4fc1ff]',
                label: 'Medium',
            };
        case 'low':
            return {
                icon: ChevronDown,
                iconColor: 'text-slate-500 dark:text-[#989898]',
                textColor: 'text-slate-600 dark:text-[#989898] font-normal',
                tagBg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#252526] dark:text-[#989898] dark:border-[#3e3e42]',
                dotColor: 'bg-slate-500 dark:bg-[#989898]',
                label: 'Low',
            };
        default:
            return {
                icon: Minus,
                iconColor: 'text-slate-500 dark:text-[#989898]',
                textColor: 'text-slate-600 dark:text-[#989898] font-normal',
                tagBg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#252526] dark:text-[#989898] dark:border-[#3e3e42]',
                dotColor: 'bg-slate-500 dark:bg-[#989898]',
                label: props.priority || 'Medium',
            };
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_withDefaultsArg = (function (t) { return t; })({
    size: 'sm',
    variant: 'inline',
});
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
if (__VLS_ctx.variant === 'inline') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "inline-flex items-center gap-1.5 text-xs whitespace-nowrap" },
    });
    const __VLS_0 = ((__VLS_ctx.config.icon));
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: (['shrink-0', __VLS_ctx.size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4', __VLS_ctx.config.iconColor]) },
        'aria-hidden': "true",
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: (['shrink-0', __VLS_ctx.size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4', __VLS_ctx.config.iconColor]) },
        'aria-hidden': "true",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (__VLS_ctx.config.textColor) },
    });
    (__VLS_ctx.config.label);
}
else if (__VLS_ctx.variant === 'tag') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ([
                'inline-flex items-center gap-1.5 rounded border whitespace-nowrap text-xs font-medium',
                __VLS_ctx.size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1',
                __VLS_ctx.config.tagBg,
            ]) },
    });
    const __VLS_4 = ((__VLS_ctx.config.icon));
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
        ...{ class: (['shrink-0', __VLS_ctx.size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5', __VLS_ctx.config.iconColor]) },
        'aria-hidden': "true",
    }));
    const __VLS_6 = __VLS_5({
        ...{ class: (['shrink-0', __VLS_ctx.size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5', __VLS_ctx.config.iconColor]) },
        'aria-hidden': "true",
    }, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.config.label);
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ([
                'inline-flex items-center gap-1.5 rounded-full border whitespace-nowrap text-xs font-medium',
                __VLS_ctx.size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-0.5',
                __VLS_ctx.config.tagBg,
            ]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
        ...{ class: (['w-1.5 h-1.5 rounded-full shrink-0', __VLS_ctx.config.dotColor]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (__VLS_ctx.config.label);
}
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-1.5']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            config: config,
        };
    },
    __typeProps: {},
    props: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeProps: {},
    props: {},
});
; /* PartiallyEnd: #4569/main.vue */
