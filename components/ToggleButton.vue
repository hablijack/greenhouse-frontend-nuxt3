<template>
  <label :for="`${id}_button`" :class="{ active: isActive }" class="toggle-button">
    <input
      type="checkbox"
      :disabled="disabled"
      :id="`${id}_button`"
      v-model="checkedValue"
    />
    <span class="toggle-switch">
      <span class="toggle-label">
        {{ isActive ? labelEnableText : labelDisableText }}
      </span>
    </span>
  </label>
</template>

<script setup>
const props = defineProps({
  disabled: { type: Boolean, default: false },
  color: String,
  labelEnableText: { type: String, default: "On" },
  labelDisableText: { type: String, default: "Off" },
  id: { type: String, default: "primary" },
  defaultState: { type: Boolean, default: false },
})

const emit = defineEmits(['change'])

const currentState = ref(props.defaultState)

watch(() => props.defaultState, (newValue) => {
  currentState.value = Boolean(newValue)
})

const isActive = computed(() => currentState.value)

const checkedValue = computed({
  get: () => currentState.value,
  set: (newValue) => {
    currentState.value = newValue
    emit('change', newValue)
  }
})
</script>

<style scoped>
.toggle-button {
  vertical-align: middle;
  user-select: none;
  cursor: pointer;
}

.toggle-button input[type="checkbox"] {
  opacity: 0;
  position: absolute;
  width: 1px;
  height: 1px;
}

.toggle-switch {
  display: inline-block;
  margin: 5px;
  height: 45px;
  border-radius: 20px;
  width: 120px;
  background: #dfdfdf;
  box-shadow: inset 0 0 1px #dfdfdf;
  position: relative;
  transition: all 0.25s;
}

.toggle-switch::after,
.toggle-switch::before {
  content: "";
  position: absolute;
  display: block;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  left: 0;
  top: -3px;
  transform: translateX(0);
  transition: all 0.25s cubic-bezier(0.5, -0.6, 0.5, 1.6);
}

.toggle-switch::after {
  background: #343a40;
  box-shadow: 0 0 1px #666;
}

.toggle-switch::before {
  background: #343a40;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  opacity: 0;
}

.active .toggle-switch {
  background: black;
  box-shadow: inset 0 0 1px black;
}

.active .toggle-switch::after,
.active .toggle-switch::before {
  transform: translateX(70px);
}

.active .toggle-switch::after {
  left: 71px;
  background: #343a40;
  box-shadow: 0 0 1px #343a40;
}

.toggle-label {
  color: white;
  margin-left: 57px;
  font-size: 28px;
  line-height: 44px;
}

.active .toggle-label {
  color: white;
  margin-left: 10px;
  font-size: 28px;
  line-height: 44px;
}
</style>
