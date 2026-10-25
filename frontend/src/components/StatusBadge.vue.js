import { computed } from 'vue';
import { Inbox, Clock, AlertTriangle, HelpCircle, ArrowUpRight, CheckCircle2, Check } from 'lucide-vue-next';
const props = withDefaults(defineProps(), {
    size: 'sm',
    variant: 'inline',
});
const badgeConfig = computed(() => {
    switch (props.status) {
        case 'Received':
            return {
                icon: Inbox,
                dot: 'bg-slate-400 dark:bg-[#989898]',
                iconColor: 'text-slate-500 dark:text-[#989898]',
                textColor: 'text-slate-700 dark:text-[#cccccc]',
                tagBg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#2d2d2d] dark:text-[#cccccc] dark:border-[#3e3e42]',
            };
        case 'Under Review':
            return {
                icon: Clock,
                dot: 'bg-amber-500 dark:bg-[#cca700]',
                iconColor: 'text-amber-600 dark:text-[#cca700]',
                textColor: 'text-amber-800 dark:text-[#e5b567]',
                tagBg: 'bg-amber-50/80 text-amber-800 border-amber-200 dark:bg-[#cca700]/15 dark:text-[#e5b567] dark:border-[#cca700]/30',
            };
        case 'Action Required':
            return {
                icon: AlertTriangle,
                dot: 'bg-orange-500 dark:bg-[#ce9178]',
                iconColor: 'text-orange-600 dark:text-[#ce9178]',
                textColor: 'text-orange-800 dark:text-[#ce9178]',
                tagBg: 'bg-orange-50/80 text-orange-800 border-orange-200 dark:bg-[#ce9178]/15 dark:text-[#ce9178] dark:border-[#ce9178]/30',
            };
        case 'Awaiting Response':
            return {
                icon: HelpCircle,
                dot: 'bg-sky-500 dark:bg-[#4fc1ff]',
                iconColor: 'text-sky-600 dark:text-[#4fc1ff]',
                textColor: 'text-sky-800 dark:text-[#4fc1ff]',
                tagBg: 'bg-sky-50/80 text-sky-800 border-sky-200 dark:bg-[#4fc1ff]/15 dark:text-[#4fc1ff] dark:border-[#4fc1ff]/30',
            };
        case 'Escalated':
            return {
                icon: ArrowUpRight,
                dot: 'bg-rose-600 dark:bg-[#f14c4c]',
                iconColor: 'text-rose-600 dark:text-[#f48771]',
                textColor: 'text-rose-800 dark:text-[#f48771] font-semibold',
                tagBg: 'bg-rose-50/80 text-rose-800 border-rose-200 dark:bg-[#f48771]/15 dark:text-[#f48771] dark:border-[#f48771]/30',
            };
        case 'Disposed':
            return {
                icon: CheckCircle2,
                dot: 'bg-emerald-600 dark:bg-[#89d185]',
                iconColor: 'text-emerald-600 dark:text-[#89d185]',
                textColor: 'text-emerald-800 dark:text-[#89d185]',
                tagBg: 'bg-emerald-50/80 text-emerald-800 border-emerald-200 dark:bg-[#89d185]/15 dark:text-[#89d185] dark:border-[#89d185]/30',
            };
        case 'Closed':
            return {
                icon: Check,
                dot: 'bg-zinc-400 dark:bg-[#989898]',
                iconColor: 'text-zinc-500 dark:text-[#989898]',
                textColor: 'text-zinc-700 dark:text-[#989898]',
                tagBg: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-[#252526] dark:text-[#989898] dark:border-[#3e3e42]',
            };
        default:
            return {
                icon: Inbox,
                dot: 'bg-slate-400 dark:bg-[#989898]',
                iconColor: 'text-slate-500 dark:text-[#989898]',
                textColor: 'text-slate-700 dark:text-[#cccccc]',
                tagBg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-[#2d2d2d] dark:text-[#cccccc] dark:border-[#3e3e42]',
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
        ...{ class: "inline-flex items-center gap-2 text-xs whitespace-nowrap" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
        ...{ class: (['rounded-full shrink-0', __VLS_ctx.size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5', __VLS_ctx.badgeConfig.dot]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: (__VLS_ctx.badgeConfig.textColor) },
    });
    (props.status);
}
else if (__VLS_ctx.variant === 'tag') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ([
                'inline-flex items-center gap-1.5 rounded border whitespace-nowrap text-xs font-medium',
                __VLS_ctx.size === 'sm' ? 'px-2 py-0.5' : 'px-2.5 py-1',
                __VLS_ctx.badgeConfig.tagBg,
            ]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
        ...{ class: (['w-1.5 h-1.5 rounded-full shrink-0', __VLS_ctx.badgeConfig.dot]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (props.status);
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: ([
                'inline-flex items-center gap-1.5 rounded-full border whitespace-nowrap text-xs font-medium',
                __VLS_ctx.size === 'sm' ? 'px-2.5 py-0.5' : 'px-3 py-1',
                __VLS_ctx.badgeConfig.tagBg,
            ]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span)({
        ...{ class: (['w-1.5 h-1.5 rounded-full shrink-0', __VLS_ctx.badgeConfig.dot]) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (props.status);
}
/** @type {__VLS_StyleScopedClasses['inline-flex']} */ ;
/** @type {__VLS_StyleScopedClasses['items-center']} */ ;
/** @type {__VLS_StyleScopedClasses['gap-2']} */ ;
/** @type {__VLS_StyleScopedClasses['text-xs']} */ ;
/** @type {__VLS_StyleScopedClasses['whitespace-nowrap']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            badgeConfig: badgeConfig,
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
