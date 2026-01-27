import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcsspxtoviewport from 'postcss-px-to-viewport-8-plugin'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        postcsspxtoviewport({
          viewportWidth: 375,
          unitPrecision: 5,
          propList: ['*'],
          viewportUnit: 'vw',
          fontViewportUnit: 'vw',
          selectorBlackList: ['.ant-'],
          minPixelValue: 1,
          mediaQuery: false,
          replace: true,
        }),
      ],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
