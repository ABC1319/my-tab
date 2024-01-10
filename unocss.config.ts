import { defineConfig } from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      'scale-in-from-left-top': 'animate-[scale-in-keyframes-from-left-top_0.2s]',
      'scale-out-from-left-top': 'animate-[scale-out-keyframes-from-left-top_0.2s]',
      'scale-in-from-right-top': 'animate-[scale-in-keyframes-from-right-top_0.2s]',
      'scale-out-from-right-top': 'animate-[scale-out-keyframes-from-right-top_0.2s]',

      'scale-in-from-right-bottom': 'animate-[scale-in-keyframes-from-right-bottom_0.2s]',
      'scale-out-from-right-bottom': 'animate-[scale-out-keyframes-from-right-bottom_0.2s]',
      'scale-in-from-left-bottom': 'animate-[scale-in-keyframes-from-left-bottom_0.2s]',
      'scale-out-from-left-bottom': 'animate-[scale-out-keyframes-from-left-bottom_0.2s]',
    },
    [/^btn-(\w+)$/, ([_, color]) => `op50 px2.5 py1 transition-all duration-200 ease-out no-underline! hover:(op100 text-${color} bg-${color}/10) border border-base! rounded`],
  ],

  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
