export const colorSpaces = {
	hsl: {
		name: 'HSL',
		slug: 'hsl',
		colorsParams: ['H', 'S', 'L'],
		minValue: [0, 0, 0],
		maxValue: [360, 100, 100]
	},
	rgb: {
		name: 'RGB',
		slug: 'rgb',
		colorsParams: ['R', 'G', 'B'],
		minValue: [0, 0, 0],
		maxValue: [255, 255, 255]
	},
	cmyk: {
		name: 'CMYK',
		slug: 'cmyk',
		colorsParams: ['C', 'M', 'Y', 'K'],
		minValue: [0, 0, 0, 0],
		maxValue: [100, 100, 100, 100]
	},
	hsv: {
		name: 'HSV',
		slug: 'hsv',
		colorsParams: ['H', 'S', 'V'],
		minValue: [0, 0, 0],
		maxValue: [360, 100, 100]
	},
	wavelength: {
		name: 'WaveLength',
		slug: 'wavelength',
		colorsParams: ['Wavelength'],
		minValue: [380],
		maxValue: [645]
	}
};
