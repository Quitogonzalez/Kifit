const { hairlineWidth } = require('nativewind/theme')

module.exports = {
  content: ['./app/**/*.{tsx,ts}', './components/**/*.{tsx,ts}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',
          green: '#22C55E',
          orange: '#F97316',
          red: '#EF4444',
        },
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
}
