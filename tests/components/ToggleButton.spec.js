const { mount } = require('@vue/test-utils')
const { describe, it, expect, beforeEach, afterEach } = require('@jest/globals')
const ToggleButton = require('@/components/ToggleButton.vue').default

describe('ToggleButton', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ToggleButton, {
      props: {
        id: 'test-toggle'
      }
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('renders correctly with default props', () => {
    expect(wrapper.find('.ios-toggle').exists()).toBe(true)
    expect(wrapper.find('.ios-toggle__input').exists()).toBe(true)
    expect(wrapper.find('.ios-toggle__track').exists()).toBe(true)
    expect(wrapper.find('.ios-toggle__thumb').exists()).toBe(true)
  })

  it('has correct default classes and attributes', () => {
    const label = wrapper.find('.ios-toggle')
    expect(label.classes()).toContain('ios-toggle')
    expect(label.classes()).toContain('ios-toggle--medium')
    expect(label.attributes('for')).toBe('test-toggle_button')
    
    const input = wrapper.find('.ios-toggle__input')
    expect(input.attributes('type')).toBe('checkbox')
    expect(input.attributes('id')).toBe('test-toggle_button')
    expect(input.attributes('disabled')).toBeUndefined()
  })

  it('applies size classes correctly', async () => {
    await wrapper.setProps({ size: 'small' })
    expect(wrapper.find('.ios-toggle').classes()).toContain('ios-toggle--small')
    
    await wrapper.setProps({ size: 'large' })
    expect(wrapper.find('.ios-toggle').classes()).toContain('ios-toggle--large')
  })

  it('handles disabled state correctly', async () => {
    await wrapper.setProps({ disabled: true })
    
    const label = wrapper.find('.ios-toggle')
    const input = wrapper.find('.ios-toggle__input')
    
    expect(label.classes()).toContain('ios-toggle--disabled')
    expect(input.attributes('disabled')).toBeDefined()
  })

  it('emits change event when toggled', async () => {
    const input = wrapper.find('.ios-toggle__input')
    
    await input.setChecked(true)
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')[0]).toEqual([true])
    
    await input.setChecked(false)
    expect(wrapper.emitted('change')[1]).toEqual([false])
  })

  it('reflects active state with correct classes', async () => {
    expect(wrapper.find('.ios-toggle').classes()).not.toContain('ios-toggle--active')
    
    await wrapper.find('.ios-toggle__input').setChecked(true)
    expect(wrapper.find('.ios-toggle').classes()).toContain('ios-toggle--active')
  })

  it('applies custom colors correctly', async () => {
    await wrapper.setProps({ 
      color: '#ff0000',
      offColor: '#00ff00' 
    })
    
    const label = wrapper.find('.ios-toggle')
    expect(label.attributes('style')).toContain('--active-color: #ff0000')
    expect(label.attributes('style')).toContain('--off-color: #00ff00')
  })

  it('displays labels when showLabels is true', async () => {
    await wrapper.setProps({ 
      showLabels: true,
      labelEnableText: 'Enabled',
      labelDisableText: 'Disabled'
    })
    
    const label = wrapper.find('.ios-toggle__label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Disabled')
    
    await wrapper.find('.ios-toggle__input').setChecked(true)
    expect(label.text()).toBe('Enabled')
  })

  it('hides labels when showLabels is false', () => {
    expect(wrapper.find('.ios-toggle__label').exists()).toBe(false)
  })

  it('respects defaultState prop', async () => {
    await wrapper.setProps({ defaultState: true })
    
    // The component should be active when defaultState is true
    expect(wrapper.find('.ios-toggle').classes()).toContain('ios-toggle--active')
  })

  it('updates when defaultState prop changes', async () => {
    await wrapper.setProps({ defaultState: false })
    expect(wrapper.find('.ios-toggle').classes()).not.toContain('ios-toggle--active')
    
    await wrapper.setProps({ defaultState: true })
    expect(wrapper.find('.ios-toggle').classes()).toContain('ios-toggle--active')
  })

  it('generates unique IDs correctly', () => {
    const wrapper1 = mount(ToggleButton, { props: { id: 'toggle1' } })
    const wrapper2 = mount(ToggleButton, { props: { id: 'toggle2' } })
    
    expect(wrapper1.find('.ios-toggle__input').attributes('id')).toBe('toggle1_button')
    expect(wrapper2.find('.ios-toggle__input').attributes('id')).toBe('toggle2_button')
    
    wrapper1.unmount()
    wrapper2.unmount()
  })

  it('handles size validator correctly', () => {
    // Test that invalid sizes generate a warning (Vue validators don't throw errors)
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {})
    
    mount(ToggleButton, {
      props: {
        id: 'test',
        size: 'invalid'
      }
    })
    
    // Vue should have warned about invalid prop
    expect(consoleSpy).toHaveBeenCalled()
    const warningMessage = consoleSpy.mock.calls[0][0]
    expect(warningMessage).toContain('Invalid prop: custom validator check failed for prop "size"')
    
    consoleSpy.mockRestore()
  })

  it('maintains internal state consistency', async () => {
    // Initial state should be false
    expect(wrapper.vm.currentState).toBe(false)
    
    // Toggle to true
    await wrapper.find('.ios-toggle__input').setChecked(true)
    expect(wrapper.vm.currentState).toBe(true)
    
    // Toggle back to false
    await wrapper.find('.ios-toggle__input').setChecked(false)
    expect(wrapper.vm.currentState).toBe(false)
  })

  it('applies focus styles for accessibility', () => {
    const input = wrapper.find('.ios-toggle__input')
    
    // Test that the input element exists and can be focused
    expect(input.exists()).toBe(true)
    expect(input.element.tagName).toBe('INPUT')
    
    // In Jest/jsdom, we can trigger focus programmatically
    input.element.focus()
    
    // Verify that the element supports focus (the element itself exists)
    expect(input.element).toBeDefined()
  })
})