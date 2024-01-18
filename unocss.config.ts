import { defineConfig } from 'unocss/vite'
import { presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  shortcuts: [
    {
      'animate-in': 'animate-[enter_0.15s]',
      'animate-out': 'animate-[out_0.01s]',

      'fade-in': 'animate-[fade-in-animate_0.3s]',
      'fade-out': 'animate-[fade-out-animate_0.3s]',
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
