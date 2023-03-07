<template>
  <label
    :for="id + '_button'"
    :class="{ active: isActive }"
    class="toggle__button"
  >
    <input
      type="checkbox"
      :disabled="disabled"
      :id="id + '_button'"
      v-model="checkedValue"
    />
    <span class="toggle__switch">
      <span class="toggle__switch__label">
        {{ isActive ? labelEnableText : labelDisableText }}
      </span>
    </span>
  </label>
</template>

<script>
export default {
  name: "ToggleButton",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },

    color: {
      type: String,
    },

    labelEnableText: {
      type: String,
      default: "On",
    },

    labelDisableText: {
      type: String,
      default: "Off",
    },

    id: {
      type: String,
      default: "primary",
    },

    defaultState: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      currentState: this.defaultState,
    };
  },

  watch: {
    defaultState: function defaultState() {
      this.currentState = Boolean(this.defaultState);
    },
  },

  computed: {
    // currentState() {
    //     return this.defaultState;
    // },

    isActive() {
      return this.currentState;
    },

    enableText() {
      return this.labelEnableText;
    },

    disabledText() {
      return this.labelDisableText;
    },

    checkedValue: {
      get() {
        return this.currentState;
      },

      set(newValue) {
        this.currentState = newValue;
        this.$emit("change", newValue);
      },
    },
  },
};
</script>

<style scoped>
.toggle__button {
  vertical-align: middle;
  user-select: none;
  cursor: pointer;
}
.toggle__button input[type="checkbox"] {
  opacity: 0;
  position: absolute;
  width: 1px;
  height: 1px;
}
.toggle__button .toggle__switch {
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

.toggle__button .toggle__switch::after,
.toggle__button .toggle__switch::before {
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

.toggle__button .toggle__switch::after {
  background: #343a40;
  box-shadow: 0 0 1px #666;
}
.toggle__button .toggle__switch::before {
  background: #343a40;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  opacity: 0;
}

.active .toggle__switch {
  background: black;
  box-shadow: inset 0 0 1px black;
}

.active .toggle__switch::after,
.active .toggle__switch::before {
  transform: translateX(100px - 30px);
}

.active .toggle__switch::after {
  left: 71px;
  background: #343a40;
  box-shadow: 0 0 1px #343a40;
}

.toggle__switch__label {
  color: white;
  margin-left: 57px;
  font-size: 28px;
  line-height: 44px;
}

.active .toggle__switch__label {
  color: white;
  margin-left: 10px;
  font-size: 28px;
  line-height: 44px;
}
</style>
