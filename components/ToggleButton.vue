<template>
  <label 
    :class="[
      'ios-toggle',
      `ios-toggle--${size}`,
      { 
        'ios-toggle--active': isActive,
        'ios-toggle--disabled': disabled
      }
    ]"
    :for="inputId"
    :style="{
      '--active-color': color,
      '--off-color': offColor
    }"
  >
    <input
      :id="inputId"
      type="checkbox"
      :disabled="disabled"
      v-model="checkedValue"
      class="ios-toggle__input"
    >
    <div class="ios-toggle__track">
      <div class="ios-toggle__thumb"></div>
    </div>
    <!-- Optional labels for backward compatibility -->
    <span v-if="showLabels" class="ios-toggle__label">
      {{ isActive ? labelEnableText : labelDisableText }}
    </span>
  </label>
</template>

<script setup>
const props = defineProps({
  // Existing props (backward compatibility)
  disabled: { type: Boolean, default: false },
  color: { type: String, default: '#28a745' },
  labelEnableText: { type: String, default: "On" },
  labelDisableText: { type: String, default: "Off" },
  id: { type: String, default: "primary" },
  defaultState: { type: Boolean, default: false },
  
  // New props (optional enhancements)
  size: { type: String, default: 'medium', validator: v => ['small', 'medium', 'large'].includes(v) },
  showLabels: { type: Boolean, default: false }, // Hide labels by default for iOS look
  offColor: { type: String, default: '#e0e0e0' }   // Custom off-track color
})

const emit = defineEmits(['change'])

const currentState = ref(props.defaultState)

watch(() => props.defaultState, (newValue) => {
  currentState.value = Boolean(newValue)
})

const isActive = computed(() => currentState.value)

const inputId = computed(() => `${props.id}_button`)

const checkedValue = computed({
  get: () => currentState.value,
  set: (newValue) => {
    currentState.value = newValue
    emit('change', newValue)
  }
})
</script>

<style scoped>
.ios-toggle {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.2s ease;
}

.ios-toggle__input {
  opacity: 0;
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.ios-toggle__track {
  position: relative;
  border-radius: 34px;
  background-color: var(--off-color, #e0e0e0);
  transition: background-color 0.2s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.ios-toggle__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.ios-toggle--active .ios-toggle__track {
  background-color: var(--active-color, #28a745);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.ios-toggle--active .ios-toggle__thumb {
  transform: translateX(var(--thumb-offset));
}

.ios-toggle--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.ios-toggle--disabled .ios-toggle__thumb {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Hover effects */
.ios-toggle:hover:not(.ios-toggle--disabled) .ios-toggle__thumb {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.15);
}

.ios-toggle--active:hover:not(.ios-toggle--disabled) .ios-toggle__thumb {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25), 0 2px 4px rgba(0, 0, 0, 0.15);
}

/* Focus styles for accessibility */
.ios-toggle__input:focus-visible + .ios-toggle__track {
  outline: 2px solid var(--active-color, #28a745);
  outline-offset: 2px;
}

.ios-toggle__label {
  margin-left: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--active-color, #28a745);
  transition: color 0.2s ease;
}

/* Size variants */
.ios-toggle--small .ios-toggle__track {
  width: 56px;
  height: 32px;
}

.ios-toggle--small .ios-toggle__thumb {
  width: 28px;
  height: 28px;
}

.ios-toggle--small {
  --thumb-offset: 24px;
}

.ios-toggle--small .ios-toggle__label {
  font-size: 12px;
  margin-left: 8px;
}

.ios-toggle--medium .ios-toggle__track {
  width: 76px;
  height: 44px;
}

.ios-toggle--medium .ios-toggle__thumb {
  width: 40px;
  height: 40px;
}

.ios-toggle--medium {
  --thumb-offset: 32px;
}

.ios-toggle--medium .ios-toggle__label {
  font-size: 14px;
  margin-left: 12px;
}

.ios-toggle--large .ios-toggle__track {
  width: 96px;
  height: 56px;
}

.ios-toggle--large .ios-toggle__thumb {
  width: 52px;
  height: 52px;
}

.ios-toggle--large {
  --thumb-offset: 40px;
}

.ios-toggle--large .ios-toggle__label {
  font-size: 16px;
  margin-left: 16px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .ios-toggle__track {
    border: 2px solid currentColor;
  }
  
  .ios-toggle--disabled {
    opacity: 0.8;
  }
}

/* Reduce motion support */
@media (prefers-reduced-motion: reduce) {
  .ios-toggle__track,
  .ios-toggle__thumb {
    transition: none;
  }
}
</style>
