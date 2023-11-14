import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CustomModal from '../CustomModal.vue'

describe('Card Component', () => {
  it('should render', () => {
    const wrapper = mount(CustomModal)

    expect(wrapper.html()).toBeTruthy()
  })
})
