import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Modal from '../Modal.vue'

describe('Card Component', () => {
  it('should render', () => {
    const wrapper = mount(Modal)

    expect(wrapper.html()).toBeTruthy()
  })
})
