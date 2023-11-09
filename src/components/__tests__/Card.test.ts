import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from '../Card.vue'

describe('Card Component', () => {
  it('should render', () => {
    const wrapper = mount(Card)

    expect(wrapper.html()).toBeTruthy()
  })
})
