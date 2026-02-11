require('@testing-library/jest-dom')
const { config } = require('@vue/test-utils')

// Auto-import Vue composition API
const { ref, computed, watch } = require('vue')

// Global test configuration
config.global.stubs = {
  // Add any global component stubs if needed
}

// Make Vue composition API available globally
global.ref = ref
global.computed = computed
global.watch = watch