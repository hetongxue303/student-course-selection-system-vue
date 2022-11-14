import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class',
  theme: {
    extend: {
      screens: {},
      colors: {
        white: '#ffffff',
        black: '#000000'
      },
      fontFamily: {},
      spacing: {},
      borderRadius: {}
    }
  },
  plugins: []
})
