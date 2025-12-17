<script setup>
const props = defineProps({
    items: {
        type: Array,
        required: true,
        default: () => []
    },
    allowMultiple: {
        type: Boolean,
        default: false
    },
    defaultOpenIds: {
        type: Array,
        default: () => []
    },
    headingLevel: {
        type: Number,
        default: 3,
        validator: (value) => [2, 3, 4, 5, 6].includes(value)
    }
})

const emit = defineEmits(['toggle', 'change'])

// Track which accordion items are open
const openItems = ref([...props.defaultOpenIds])

const accordionRef = ref(null)
const buttonRefs = ref(new Map())

const componentId = useId()

// Check if an item is open
const isOpen = (id) => openItems.value.includes(id)

// Toggle an accordion item
const toggleItem = (id) => {
    const index = openItems.value.indexOf(id)
    const willBeOpen = index === -1

    if (index > -1) {
        openItems.value = openItems.value.filter(itemId => itemId !== id)
        emit('toggle', id, false)
    } else {
        if (!props.allowMultiple) {
            openItems.value = [id]
        } else {
            openItems.value = [...openItems.value, id]
        }
        emit('toggle', id, true)
    }

    emit('change', [...openItems.value])

    // Maintain focus on the button after toggle
    nextTick(() => {
        const button = buttonRefs.value.get(id)
        if (button && document.activeElement !== button) {
            button.focus()
        }
    })
}

// Keyboard navigation
const handleKeydown = (event, index) => {
    const items = props.items
    const itemCount = items.length
    let targetIndex = null

    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault()
            targetIndex = (index + 1) % itemCount
            break
        case 'ArrowUp':
            event.preventDefault()
            targetIndex = (index - 1 + itemCount) % itemCount
            break
        case 'Home':
            event.preventDefault()
            targetIndex = 0
            break
        case 'End':
            event.preventDefault()
            targetIndex = itemCount - 1
            break
        case 'Enter':
        case ' ':
            event.preventDefault()
            toggleItem(items[index].id)
            return
    }

    if (targetIndex !== null) {
        const targetId = items[targetIndex].id
        const targetButton = buttonRefs.value.get(targetId)
        targetButton?.focus()
    }
}

const setButtonRef = (id, el) => {
    if (el) {
        buttonRefs.value.set(id, el)
    } else {
        buttonRefs.value.delete(id)
    }
}

const getButtonId = (id) => `${componentId}-button-${id}`
const getPanelId = (id) => `${componentId}-panel-${id}`
// Heading tag
const HeadingTag = computed(() => `h${props.headingLevel}`)

defineExpose({
    openAll: () => {
        if (props.allowMultiple) {
            openItems.value = props.items.map(item => item.id)
        }
    },
    closeAll: () => {
        openItems.value = []
    },
    toggle: toggleItem,
    isOpen
})
</script>

<template>
    <div ref="accordionRef" class="accordion" role="presentation">
        <div v-if="!items || items.length === 0" class="accordion__empty" role="status" aria-live="polite"
            aria-label="No accordion items available">
            <slot name="empty">
                <p>No items available</p>
            </slot>
        </div>

        <div v-for="(item, index) in items" :key="item.id" class="accordion__item"
            :class="{ 'accordion__item--open': isOpen(item.id) }">
            <component :is="HeadingTag" class="accordion__heading">
                <button :id="getButtonId(item.id)" :ref="(el) => setButtonRef(item.id, el)" type="button"
                    class="accordion__trigger" :aria-expanded="isOpen(item.id)" :aria-controls="getPanelId(item.id)"
                    @click="toggleItem(item.id)" @keydown="handleKeydown($event, index)">
                    <span class="accordion__trigger-content">
                        <span v-if="item.icon || $slots.icon" class="accordion__icon">
                            <slot name="icon" :item="item">
                                <span v-html="item.icon" />
                            </slot>
                        </span>

                        <span class="accordion__title">
                            <slot name="title" :item="item">
                                {{ item.title }}
                            </slot>
                        </span>
                    </span>

                    <span class="accordion__indicator" aria-hidden="true">
                        <Icon name="chevron-down" :size="14" />
                    </span>
                </button>
            </component>

            <div :id="getPanelId(item.id)" role="region" :aria-labelledby="getButtonId(item.id)"
                class="accordion__panel" :class="{ 'accordion__panel--open': isOpen(item.id) }"
                :hidden="!isOpen(item.id)">
                <div class="accordion__content">
                    <slot name="content" :item="item" :is-open="isOpen(item.id)">
                        <div v-html="item.content" />
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.accordion {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: $accordion-gap;
}

.accordion__empty {
    padding: $accordion-padding;
    text-align: center;
    color: $color-text-secondary;
    background: $color-component-background;
    border-radius: $radius-sm;
}

.accordion__item {
    border-radius: $radius-sm;
    background: $color-component-background;

    &--open {
        .accordion__indicator {
            transform: rotate(180deg);
        }
    }
}

.accordion__heading {
    margin: 0;
    padding: 0;
    font-size: inherit;
    font-weight: inherit;
}

.accordion__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: $accordion-padding;
    margin: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text;
    transition: background-color $transition-fast;

    &:focus-visible {
        outline: 2px solid $color-primary;
        outline-offset: -2px;
        border-radius: $radius-sm;
    }

    &:focus:not(:focus-visible) {
        outline: none;
    }

    &[aria-expanded="true"] .accordion__title {
        color: $color-text-tertiary;
    }

    @media (max-width: $breakpoint-md) {
        padding: $space-lg $space-md;
    }
}

.accordion__trigger-content {
    display: flex;
    align-items: center;
    gap: $space-md;
    flex: 1;
    min-width: 0;
}

.accordion__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-text-secondary;
}

.accordion__title {
    flex: 1;
    min-width: 0;
    font-size: $font-size-accordion-title;
    font-weight: $font-weight-medium;
    line-height: $line-height-accordion-title;
    color: $color-text;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: $breakpoint-md) {
        font-size: $font-size-accordion-title-mobile;
    }
}

.accordion__indicator {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: $space-md;
    color: $color-text-secondary;
    transition: transform $transition-base;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
}

.accordion__panel {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows $transition-base;

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    // Closed state optimization
    &:not(&--open) {
        content-visibility: auto;
    }

    &--open {
        grid-template-rows: 1fr;
    }
}


.accordion__content {
    overflow: hidden;
    padding: 0 $accordion-padding;
    color: $color-text-secondary;

    .accordion__panel--open & {
        padding-bottom: $accordion-padding-bottom;
    }


    p {
        margin: 0 0 $space-md;
        font-size: $font-size-base;
        line-height: $line-height-body;
        color: $color-text-secondary;

        &:last-child {
            margin-bottom: 0;
        }
    }

    ul,
    ol {
        margin: 0 0 $space-md;
        padding-left: $space-lg;

        &:last-child {
            margin-bottom: 0;
        }
    }

    a {
        color: $color-primary;
        text-decoration: underline;

        &:hover {
            text-decoration: none;
        }

        &:focus-visible {
            outline: 2px solid $color-primary;
            outline-offset: 2px;
            border-radius: $radius-sm;
        }
    }
}

// High contrast mode support
@media (prefers-contrast: high) {
    .accordion__item {
        border-width: 2px;
    }

    .accordion__trigger:focus-visible {
        outline-width: 3px;
    }
}
</style>