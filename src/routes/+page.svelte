<script>
	import ColorDisplay from './_colorPickerComponents/ColorDisplay.svelte';
	import RangeInput from './_colorPickerComponents/RangeInput.svelte';
	import FullScreenDisplay from '$lib/components/FullScreenDisplay/FullScreenDisplay.svelte';
	import HexInput from './_colorPickerComponents/HexInput.svelte';
	import CompareColor from './_colorPickerComponents/CompareColor.svelte';
	import { afterUpdate, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { colorSpaces } from './colorSpace';

	import {
		inputTextOnFocus,
		mainHex,
		compareColorHex1,
		compareColorHex2,
		whichHexIsSelected,
		compareColor1IsOpen,
		compareColor2IsOpen,
		compareColorSize1,
		compareColorSize2,
		colorModeSelected
	} from './colorPickerStore';

	import { colord, extend } from 'colord';
	import cmykPlugin from 'colord/plugins/cmyk';

	import TopRightButtonsOfColorPicker from './_colorPickerComponents/TopRightButtonsOfColorPicker.svelte';
	extend([cmykPlugin]);

	// === localStorage

	function createNewColorPickerStorage() {
		return {
			mainHex: $mainHex,
			inputTextOnFocus: $inputTextOnFocus,
			compareColorHex1: $compareColorHex1,
			compareColorHex2: $compareColorHex2,
			whichHexIsSelected: $whichHexIsSelected,
			compareColor1IsOpen: $compareColor1IsOpen,
			compareColor2IsOpen: $compareColor2IsOpen,
			compareColorSize1: $compareColorSize1,
			compareColorSize2: $compareColorSize2,
			colorModeSelected: $colorModeSelected
		};
	}

	let controllerIsHiddenOnstart = false;

	function setColorPickerLocalStorage() {
		localStorage.setItem('colorPickerStorageSetup', JSON.stringify(createNewColorPickerStorage()));
	}

	// set hash

	afterUpdate(() => {
		const colorPickerSetup = {
			m: $mainHex,
			i: $inputTextOnFocus,
			h1: $compareColorHex1,
			h2: $compareColorHex2,
			w: $whichHexIsSelected,
			c1: $compareColor1IsOpen,
			c2: $compareColor2IsOpen,
			s1: $compareColorSize1,
			s2: $compareColorSize2,
			x: $colorModeSelected
		};

		const colorPickerSetupParam = btoa(JSON.stringify(colorPickerSetup));

		const colorPickerReadyToSend = '#' + colorPickerSetupParam;

		window.location.hash = colorPickerReadyToSend;
	});

	//@dev Hash will allways have priority on local storage for loading data.

	onMount(async () => {
		const storedValueOfColorPicker = localStorage.getItem('colorPickerStorageSetup');
		const storedOfColorPickerParsed = storedValueOfColorPicker
			? JSON.parse(storedValueOfColorPicker)
			: null;

		let initialHash;

		//@dev Bug when $colorModeSelected is not load first
		if ($page.url.hash) {
			initialHash = JSON.parse(atob($page.url.hash.substring(1)));
			$colorModeSelected = initialHash.x;
		} else if (storedValueOfColorPicker) {
			$colorModeSelected = storedOfColorPickerParsed.colorModeSelected;
		}

		await new Promise((resolve) => setTimeout(resolve, 0));

		if (initialHash) {
			$mainHex = initialHash.m;
			$inputTextOnFocus = initialHash.i;
			$compareColorHex1 = initialHash.h1;
			$compareColorHex2 = initialHash.h2;
			$whichHexIsSelected = initialHash.w;
			$compareColor1IsOpen = initialHash.c1;
			$compareColor2IsOpen = initialHash.c2;
			$compareColorSize1 = initialHash.s1;
			$compareColorSize2 = initialHash.s2;
		} else if (storedValueOfColorPicker) {
			$mainHex = storedOfColorPickerParsed.mainHex;
			$inputTextOnFocus = storedOfColorPickerParsed.inputTextOnFocus;
			$compareColorHex1 = storedOfColorPickerParsed.compareColorHex1;
			$compareColorHex2 = storedOfColorPickerParsed.compareColorHex2;
			$whichHexIsSelected = storedOfColorPickerParsed.whichHexIsSelected;
			$compareColor1IsOpen = storedOfColorPickerParsed.compareColor1IsOpen;
			$compareColor2IsOpen = storedOfColorPickerParsed.compareColor2IsOpen;
			$compareColorSize1 = storedOfColorPickerParsed.compareColorSize1;
			$compareColorSize2 = storedOfColorPickerParsed.compareColorSize2;
		}
	});

	// --- MAIN FUNC

	let hslValueOfMainColor = colord($mainHex).toHsl();
	let rgbValueOfMainColor = colord($mainHex).toRgb();
	let cmykValueOfMainColor = colord($mainHex).toCmyk();
	let hsvValueOfMainColor = colord($mainHex).toHsv();

	let hslValueOfCompareColor1 = colord($compareColorHex1).toHsl();
	let rgbValueOfCompareColor1 = colord($compareColorHex1).toRgb();
	let cmykValueOfCompareColor1 = colord($compareColorHex1).toCmyk();
	let hsvValueOfCompareColor1 = colord($compareColorHex1).toHsv();

	let hslValueOfCompareColor2 = colord($compareColorHex2).toHsl();
	let rgbValueOfCompareColor2 = colord($compareColorHex2).toRgb();
	let cmykValueOfCompareColor2 = colord($compareColorHex2).toCmyk();
	let hsvValueOfCompareColor2 = colord($compareColorHex2).toHsv();

	function resetInputRangeForMainHex() {
		hslValueOfMainColor = colord($mainHex).toHsl();
		rgbValueOfMainColor = colord($mainHex).toRgb();
		cmykValueOfMainColor = colord($mainHex).toCmyk();
		hsvValueOfMainColor = colord($mainHex).toHsv();
	}

	function resetInputRangeForCompareColor1() {
		hslValueOfCompareColor1 = colord($compareColorHex1).toHsl();
		rgbValueOfCompareColor1 = colord($compareColorHex1).toRgb();
		cmykValueOfCompareColor1 = colord($compareColorHex1).toCmyk();
		hsvValueOfCompareColor1 = colord($compareColorHex1).toHsv();
	}

	function resetInputRangeForCompareColor2() {
		hslValueOfCompareColor2 = colord($compareColorHex2).toHsl();
		rgbValueOfCompareColor2 = colord($compareColorHex2).toRgb();
		cmykValueOfCompareColor2 = colord($compareColorHex2).toCmyk();
		hsvValueOfCompareColor2 = colord($compareColorHex2).toHsv();
	}

	// -- WaveLength

	function convertWaveLengthToHex(input) {
		var w = parseFloat(input);

		let r, g, b, factor;

		if (w >= 380 && w < 440) {
			r = -(w - 440) / (440 - 380);
			g = 0.0;
			b = 1.0;
		} else if (w >= 440 && w < 490) {
			r = 0.0;
			g = (w - 440) / (490 - 440);
			b = 1.0;
		} else if (w >= 490 && w < 510) {
			r = 0.0;
			g = 1.0;
			b = -(w - 510) / (510 - 490);
		} else if (w >= 510 && w < 580) {
			r = (w - 510) / (580 - 510);
			g = 1.0;
			b = 0.0;
		} else if (w >= 580 && w < 645) {
			r = 1.0;
			g = -(w - 645) / (645 - 580);
			b = 0.0;
		} else if (w >= 645 && w < 781) {
			r = 1.0;
			g = 0.0;
			b = 0.0;
		} else {
			r = 0.0;
			g = 0.0;
			b = 0.0;
		}

		if (w >= 380 && w < 420) factor = 0.3 + (0.7 * (w - 380)) / (420 - 380);
		else if (w >= 420 && w < 701) factor = 1.0;
		else if (w >= 701 && w < 781) factor = 0.3 + (0.7 * (780 - w)) / (780 - 700);
		else factor = 0.0;

		var gamma = 0.8;
		var R = Math.round(r > 0 ? 255 * Math.pow(r * factor, gamma) : 0);
		var G = Math.round(g > 0 ? 255 * Math.pow(g * factor, gamma) : 0);
		var B = Math.round(b > 0 ? 255 * Math.pow(b * factor, gamma) : 0);

		return colord(`rgb(${R}, ${G}, ${B})`).toHex();
	}

	let WaveLengthValueOfMainColor = 500;

	// --- CompareColor setup

	$: if ($inputTextOnFocus === false) {
		if ($colorModeSelected === 'rgb') {
			$mainHex = colord(rgbValueOfMainColor).toHex();
			$compareColorHex1 = colord(rgbValueOfCompareColor1).toHex();
			$compareColorHex2 = colord(rgbValueOfCompareColor2).toHex();
		} else if ($colorModeSelected === 'hsl') {
			$mainHex = colord(hslValueOfMainColor).toHex();
			$compareColorHex1 = colord(hslValueOfCompareColor1).toHex();
			$compareColorHex2 = colord(hslValueOfCompareColor2).toHex();
		} else if ($colorModeSelected === 'cmyk') {
			$mainHex = colord(cmykValueOfMainColor).toHex();
			$compareColorHex1 = colord(cmykValueOfCompareColor1).toHex();
			$compareColorHex2 = colord(cmykValueOfCompareColor2).toHex();
		} else if ($colorModeSelected === 'hsv') {
			$mainHex = colord(hsvValueOfMainColor).toHex();
			$compareColorHex1 = colord(hsvValueOfCompareColor1).toHex();
			$compareColorHex2 = colord(hsvValueOfCompareColor2).toHex();
		} else if ($colorModeSelected === 'wavelength') {
			$mainHex = convertWaveLengthToHex(WaveLengthValueOfMainColor);
		}
	}

	// Input Range style

	$: inputRangeGradient = {
		mainColor: {
			general: {
				hueGradient:
					'linear-gradient(90deg,  #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
				waveLengthGradient:
					'linear-gradient(90deg,  #610061 0%, #8100cc 10%, #2e00ff 20%, #007bff 30%, #00efff 40%, #0fff00 50%, #7eff00 60%, #d2ff00 70%, #ffd900 80%, #ff7e00 90% , #ff0000 100%)'
			},
			hsl: {
				saturationGradient: `linear-gradient(90deg, hsl(${hslValueOfMainColor.h} 0% ${hslValueOfMainColor.l}%) 0%, hsl(${hslValueOfMainColor.h} 100% ${hslValueOfMainColor.l}%) 100%)`,
				lightnessGradient: `linear-gradient(90deg, hsl(${hslValueOfMainColor.h} ${hslValueOfMainColor.s}% 0%) 0%, hsl(${hslValueOfMainColor.h} ${hslValueOfMainColor.s}% 50%) 50%, hsl(${hslValueOfMainColor.h} ${hslValueOfMainColor.s}% 100%) 100%)`
			},
			rgb: {
				rGradient: `linear-gradient(90deg, rgb(0, ${rgbValueOfMainColor.g},${rgbValueOfMainColor.b}) 0%, rgb(255, ${rgbValueOfMainColor.g},${rgbValueOfMainColor.b}) 100%)`,
				gGradient: `linear-gradient(90deg, rgb(${rgbValueOfMainColor.r}, 0,${rgbValueOfMainColor.b}), rgb(${rgbValueOfMainColor.r}, 255, ${rgbValueOfMainColor.b}) 100%)`,
				bGradient: `linear-gradient(90deg, rgb(${rgbValueOfMainColor.r}, ${rgbValueOfMainColor.g}, 0), rgb(${rgbValueOfMainColor.r}, ${rgbValueOfMainColor.g}, 255) 100%)`
			},
			cmyk: {
				c: `linear-gradient(90deg, ${colord({
					c: 0,
					m: cmykValueOfMainColor.m,
					y: cmykValueOfMainColor.y,
					k: cmykValueOfMainColor.k
				}).toHex()} 0%, ${colord({
					c: 100,
					m: cmykValueOfMainColor.m,
					y: cmykValueOfMainColor.y,
					k: cmykValueOfMainColor.k
				}).toHex()} 100%)`,
				m: `linear-gradient(90deg, ${colord({
					c: cmykValueOfMainColor.c,
					m: 0,
					y: cmykValueOfMainColor.y,
					k: cmykValueOfMainColor.k
				}).toHex()} 0%, 
			${colord({
				c: cmykValueOfMainColor.c,
				m: 100,
				y: cmykValueOfMainColor.y,
				k: cmykValueOfMainColor.k
			}).toHex()} 100%)`,
				y: `linear-gradient(90deg, ${colord({
					c: cmykValueOfMainColor.c,
					m: cmykValueOfMainColor.m,
					y: 0,
					k: cmykValueOfMainColor.k
				}).toHex()} 0%, 
			${colord({
				c: cmykValueOfMainColor.c,
				m: cmykValueOfMainColor.m,
				y: 100,
				k: cmykValueOfMainColor.k
			}).toHex()} 100%)`,
				k: `linear-gradient(90deg, ${colord({
					c: cmykValueOfMainColor.c,
					m: cmykValueOfMainColor.m,
					y: cmykValueOfMainColor.y,
					k: 0
				}).toHex()} 0%, 
			${colord({
				c: cmykValueOfMainColor.c,
				m: cmykValueOfMainColor.m,
				y: cmykValueOfMainColor.y,
				k: 100
			}).toHex()} 100%)`
			},
			hsv: {
				s: `linear-gradient(90deg, ${colord({
					h: hsvValueOfMainColor.h,
					s: 0,
					v: hsvValueOfMainColor.v
				}).toHex()} 0%, 
			${colord({
				h: hsvValueOfMainColor.h,
				s: 100,
				v: hsvValueOfMainColor.v
			}).toHex()} 100%)`,
				v: `linear-gradient(90deg, ${colord({
					h: hsvValueOfMainColor.h,
					s: hsvValueOfMainColor.s,
					v: 0
				}).toHex()} 0%, 
			${colord({
				h: hsvValueOfMainColor.h,
				s: hsvValueOfMainColor.s,
				v: 100
			}).toHex()} 100%)`
			}
		},
		compareColor1: {
			general: {
				hueGradient:
					'linear-gradient(90deg,  #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
			},
			hsl: {
				saturationGradient: `linear-gradient(90deg, hsl(${hslValueOfCompareColor1.h} 0% ${hslValueOfCompareColor1.l}%) 0%, hsl(${hslValueOfCompareColor1.h} 100% ${hslValueOfCompareColor1.l}%) 100%)`,
				lightnessGradient: `linear-gradient(90deg, hsl(${hslValueOfCompareColor1.h} ${hslValueOfCompareColor1.s}% 0%) 0%, hsl(${hslValueOfCompareColor1.h} ${hslValueOfCompareColor1.s}% 50%) 50%, hsl(${hslValueOfMainColor.h} ${hslValueOfMainColor.s}% 100%) 100%)`
			},
			rgb: {
				rGradient: `linear-gradient(90deg, rgb(0, ${rgbValueOfCompareColor1.g},${rgbValueOfCompareColor1.b}) 0%, rgb(255, ${rgbValueOfCompareColor1.g},${rgbValueOfCompareColor1.b}) 100%)`,
				gGradient: `linear-gradient(90deg, rgb(${rgbValueOfCompareColor1.r}, 0,${rgbValueOfCompareColor1.b}), rgb(${rgbValueOfCompareColor1.r}, 255, ${rgbValueOfCompareColor1.b}) 100%)`,
				bGradient: `linear-gradient(90deg, rgb(${rgbValueOfCompareColor1.r}, ${rgbValueOfCompareColor1.g}, 0), rgb(${rgbValueOfCompareColor1.r}, ${rgbValueOfCompareColor1.g}, 255) 100%)`
			},
			cmyk: {
				c: `linear-gradient(90deg, ${colord({
					c: 0,
					m: cmykValueOfCompareColor1.m,
					y: cmykValueOfCompareColor1.y,
					k: cmykValueOfCompareColor1.k
				}).toHex()} 0%, ${colord({
					c: 100,
					m: cmykValueOfCompareColor1.m,
					y: cmykValueOfCompareColor1.y,
					k: cmykValueOfCompareColor1.k
				}).toHex()} 100%)`,
				m: `linear-gradient(90deg, ${colord({
					c: cmykValueOfCompareColor1.c,
					m: 0,
					y: cmykValueOfCompareColor1.y,
					k: cmykValueOfCompareColor1.k
				}).toHex()} 0%, 
			${colord({
				c: cmykValueOfCompareColor1.c,
				m: 100,
				y: cmykValueOfCompareColor1.y,
				k: cmykValueOfCompareColor1.k
			}).toHex()} 100%)`,
				y: `linear-gradient(90deg, ${colord({
					c: cmykValueOfCompareColor1.c,
					m: cmykValueOfCompareColor1.m,
					y: 0,
					k: cmykValueOfCompareColor1.k
				}).toHex()} 0%, 
			${colord({
				c: cmykValueOfCompareColor1.c,
				m: cmykValueOfCompareColor1.m,
				y: 100,
				k: cmykValueOfCompareColor1.k
			}).toHex()} 100%)`,
				k: `linear-gradient(90deg, ${colord({
					c: cmykValueOfCompareColor1.c,
					m: cmykValueOfCompareColor1.m,
					y: cmykValueOfCompareColor1.y,
					k: 0
				}).toHex()} 0%, 
			${colord({
				c: cmykValueOfCompareColor1.c,
				m: cmykValueOfCompareColor1.m,
				y: cmykValueOfCompareColor1.y,
				k: 100
			}).toHex()} 100%)`
			},
			hsv: {
				s: `linear-gradient(90deg, ${colord({
					h: hsvValueOfCompareColor1.h,
					s: 0,
					v: hsvValueOfCompareColor1.v
				}).toHex()} 0%, 
			${colord({
				h: hsvValueOfCompareColor1.h,
				s: 100,
				v: hsvValueOfCompareColor1.v
			}).toHex()} 100%)`,
				v: `linear-gradient(90deg, ${colord({
					h: hsvValueOfCompareColor1.h,
					s: hsvValueOfCompareColor1.s,
					v: 0
				}).toHex()} 0%, 
			${colord({
				h: hsvValueOfCompareColor1.h,
				s: hsvValueOfCompareColor1.s,
				v: 100
			}).toHex()} 100%)`
			}
		},
		compareColor2: {
			general: {
				hueGradient:
					'linear-gradient(90deg,  #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
			},
			hsl: {
				saturationGradient: `linear-gradient(90deg, hsl(${hslValueOfCompareColor2.h} 0% ${hslValueOfCompareColor2.l}%) 0%, hsl(${hslValueOfCompareColor2.h} 100% ${hslValueOfCompareColor2.l}%) 100%)`,
				lightnessGradient: `linear-gradient(90deg, hsl(${hslValueOfCompareColor2.h} ${hslValueOfCompareColor2.s}% 0%) 0%, hsl(${hslValueOfCompareColor2.h} ${hslValueOfCompareColor2.s}% 50%) 50%, hsl(${hslValueOfMainColor.h} ${hslValueOfMainColor.s}% 100%) 100%)`
			},
			rgb: {
				rGradient: `linear-gradient(90deg, rgb(0, ${rgbValueOfCompareColor2.g},${rgbValueOfCompareColor2.b}) 0%, rgb(255, ${rgbValueOfCompareColor2.g},${rgbValueOfCompareColor2.b}) 100%)`,
				gGradient: `linear-gradient(90deg, rgb(${rgbValueOfCompareColor2.r}, 0,${rgbValueOfCompareColor2.b}), rgb(${rgbValueOfCompareColor2.r}, 255, ${rgbValueOfCompareColor2.b}) 100%)`,
				bGradient: `linear-gradient(90deg, rgb(${rgbValueOfCompareColor2.r}, ${rgbValueOfCompareColor2.g}, 0), rgb(${rgbValueOfCompareColor2.r}, ${rgbValueOfCompareColor2.g}, 255) 100%)`
			},
			cmyk: {
				c: `linear-gradient(90deg, ${colord({
					c: 0,
					m: cmykValueOfCompareColor2.m,
					y: cmykValueOfCompareColor2.y,
					k: cmykValueOfCompareColor2.k
				}).toHex()} 0%, ${colord({
					c: 100,
					m: cmykValueOfCompareColor2.m,
					y: cmykValueOfCompareColor2.y,
					k: cmykValueOfCompareColor2.k
				}).toHex()} 100%)`,
				m: `linear-gradient(90deg, ${colord({
					c: cmykValueOfCompareColor2.c,
					m: 0,
					y: cmykValueOfCompareColor2.y,
					k: cmykValueOfCompareColor2.k
				}).toHex()} 0%, 
			${colord({
				c: cmykValueOfCompareColor2.c,
				m: 100,
				y: cmykValueOfCompareColor2.y,
				k: cmykValueOfCompareColor2.k
			}).toHex()} 100%)`,
				y: `linear-gradient(90deg, ${colord({
					c: cmykValueOfCompareColor2.c,
					m: cmykValueOfCompareColor2.m,
					y: 0,
					k: cmykValueOfCompareColor2.k
				}).toHex()} 0%, 
			${colord({
				c: cmykValueOfCompareColor2.c,
				m: cmykValueOfCompareColor2.m,
				y: 100,
				k: cmykValueOfCompareColor2.k
			}).toHex()} 100%)`,
				k: `linear-gradient(90deg, ${colord({
					c: cmykValueOfCompareColor2.c,
					m: cmykValueOfCompareColor2.m,
					y: cmykValueOfCompareColor2.y,
					k: 0
				}).toHex()} 0%, 
			${colord({
				c: cmykValueOfCompareColor2.c,
				m: cmykValueOfCompareColor2.m,
				y: cmykValueOfCompareColor2.y,
				k: 100
			}).toHex()} 100%)`
			},
			hsv: {
				s: `linear-gradient(90deg, ${colord({
					h: hsvValueOfCompareColor2.h,
					s: 0,
					v: hsvValueOfCompareColor2.v
				}).toHex()} 0%, 
			${colord({
				h: hsvValueOfCompareColor2.h,
				s: 100,
				v: hsvValueOfCompareColor2.v
			}).toHex()} 100%)`,
				v: `linear-gradient(90deg, ${colord({
					h: hsvValueOfCompareColor2.h,
					s: hsvValueOfCompareColor2.s,
					v: 0
				}).toHex()} 0%, 
			${colord({
				h: hsvValueOfCompareColor2.h,
				s: hsvValueOfCompareColor2.s,
				v: 100
			}).toHex()} 100%)`
			}
		}
	};

	// Display
	let readyToDisplay = false;

	onMount(() => {
		readyToDisplay = true;
	});
	//

	// Media query

	$: innerWidth = 0;
	$: innerHeight = 0;
	$: maxWidth = 800;

	$: if (innerHeight * (5 / 8) > innerWidth) {
		maxWidth = 'none';
	} else if (innerWidth * (6 / 13) > innerHeight) {
		maxWidth = 360;
	} else {
		maxWidth = innerHeight * (4 / 8);
	}

	// wavelength setup

	let showOptions = true;
	onMount(() => {
		if ($colorModeSelected === 'wavelength') {
			showOptions = false;
		}

		$whichHexIsSelected = 'mainHex';
	});

	$: wavelengthSetup = $colorModeSelected === 'wavelength' ? true : false;
</script>

<svelte:window bind:innerWidth bind:innerHeight on:beforeunload={setColorPickerLocalStorage} />

<svelte:head>
	<title>Color Matcher - Easily Create and Share Color Combinations</title>
	<meta
		name="description"
		content="Color Matcher is a free web app for creating color palettes. Share your creations through a unique URL. Supports HSL, HSV, CMYK, RGB color modes and wavelength visualization."
	/>

	<!-- Meta SEO -->
	<meta
		name="keywords"
		content="color matcher, color schemes, color palette, color combinations, color generator, design tool, free tool, color harmony, design, color matching"
	/>
	<meta name="author" content="L" />
	<meta name="robots" content="index, follow" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta charset="UTF-8" />

	<!-- Open Graph (Facebook, LinkedIn, etc.) -->
	<meta property="og:title" content="Color Matcher - Easily Create and Share Color Combinations" />
	<meta
		property="og:description"
		content="Color Matcher is a free and open-source web app designed to help users create color combinations with adjustable proportions. The app allows users to intuitively design color schemes and easily share their creations through a simple URL."
	/>
	<!-- <meta property="og:image" content="https://www.color-matcher.app/preview.jpg"/> -->
	<meta property="og:url" content="https://www.color-matcher.app" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Color Matcher" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Color Matcher - Easily Create and Share Color Combinations" />
	<meta
		name="twitter:description"
		content="Color Matcher is a free web app for creating color palettes. Share your creations through a unique URL. Supports HSL, HSV, CMYK, RGB color modes and wavelength visualization."
	/>
	<!-- <meta name="twitter:image" content="https://www.color-matcher.app/preview.jpg"/> Replace with actual image URL -->
</svelte:head>

{#if readyToDisplay}
	<FullScreenDisplay {controllerIsHiddenOnstart}>
		<div slot="mainDisplay">
			<ColorDisplay />
			<div id="compareColorContainer">
				{#if $compareColor2IsOpen && !wavelengthSetup}
					<CompareColor
						bind:colorOfThisCompareColor={$compareColorHex2}
						bind:sizeOfThisCompareColor={$compareColorSize2}
					/>
				{/if}
				{#if $compareColor1IsOpen && !wavelengthSetup}
					<CompareColor
						bind:colorOfThisCompareColor={$compareColorHex1}
						bind:sizeOfThisCompareColor={$compareColorSize1}
					/>
				{/if}
			</div>
		</div>
		<div slot="topRightButtons">
			<TopRightButtonsOfColorPicker {wavelengthSetup} />
		</div>
		<div id="controlsContainer" slot="controls">
			<div class="color-settings-container">
				{#if $compareColor2IsOpen && !wavelengthSetup}
					<HexInput
						resetInputRange={resetInputRangeForCompareColor2}
						bind:HexOfThisInput={$compareColorHex2}
						thisHexInputName="compareColor2"
						bind:sizeOfThisCompareColor={$compareColorSize2}
					/>
				{/if}
				{#if $compareColor1IsOpen && !wavelengthSetup}
					<HexInput
						resetInputRange={resetInputRangeForCompareColor1}
						bind:HexOfThisInput={$compareColorHex1}
						thisHexInputName="compareColor1"
						bind:sizeOfThisCompareColor={$compareColorSize1}
					/>
				{/if}
				<HexInput
					{wavelengthSetup}
					resetInputRange={resetInputRangeForMainHex}
					bind:HexOfThisInput={$mainHex}
					thisHexInputName="mainHex"
					{showOptions}
				/>
				{#if $whichHexIsSelected == 'mainHex'}
					<div class="inputRangeContainer" style="border: 3px solid {$mainHex}; ">
						{#if $colorModeSelected === 'rgb'}
							<RangeInput
								name={colorSpaces.rgb.colorsParams[0]}
								minValue={colorSpaces.rgb.minValue[0]}
								maxValue={colorSpaces.rgb.maxValue[0]}
								bind:value={rgbValueOfMainColor.r}
								trackBg={inputRangeGradient.mainColor.rgb.rGradient}
							/>

							<RangeInput
								name={colorSpaces.rgb.colorsParams[1]}
								minValue={colorSpaces.rgb.minValue[1]}
								maxValue={colorSpaces.rgb.maxValue[1]}
								bind:value={rgbValueOfMainColor.g}
								trackBg={inputRangeGradient.mainColor.rgb.gGradient}
							/>

							<RangeInput
								name={colorSpaces.rgb.colorsParams[2]}
								minValue={colorSpaces.rgb.minValue[2]}
								maxValue={colorSpaces.rgb.maxValue[2]}
								bind:value={rgbValueOfMainColor.b}
								trackBg={inputRangeGradient.mainColor.rgb.bGradient}
							/>
						{:else if $colorModeSelected === 'wavelength'}
							<RangeInput
								{wavelengthSetup}
								name={colorSpaces.wavelength.colorsParams[0]}
								minValue={colorSpaces.wavelength.minValue[0]}
								maxValue={colorSpaces.wavelength.maxValue[0]}
								bind:value={WaveLengthValueOfMainColor}
								trackBg={inputRangeGradient.mainColor.general.waveLengthGradient}
							/>
						{:else if $colorModeSelected === 'hsl'}
							<RangeInput
								name={colorSpaces.hsl.colorsParams[0]}
								minValue={colorSpaces.hsl.minValue[0]}
								maxValue={colorSpaces.hsl.maxValue[0]}
								bind:value={hslValueOfMainColor.h}
								trackBg={inputRangeGradient.mainColor.general.hueGradient}
							/>

							<RangeInput
								name={colorSpaces.hsl.colorsParams[1]}
								minValue={colorSpaces.hsl.minValue[1]}
								maxValue={colorSpaces.hsl.maxValue[1]}
								bind:value={hslValueOfMainColor.s}
								trackBg={inputRangeGradient.mainColor.hsl.saturationGradient}
							/>

							<RangeInput
								name={colorSpaces.hsl.colorsParams[2]}
								minValue={colorSpaces.hsl.minValue[2]}
								maxValue={colorSpaces.hsl.maxValue[2]}
								bind:value={hslValueOfMainColor.l}
								trackBg={inputRangeGradient.mainColor.hsl.lightnessGradient}
							/>
						{:else if $colorModeSelected === 'hsv'}
							<RangeInput
								name={colorSpaces.hsv.colorsParams[0]}
								minValue={colorSpaces.hsv.minValue[0]}
								maxValue={colorSpaces.hsv.maxValue[0]}
								bind:value={hsvValueOfMainColor.h}
								trackBg={inputRangeGradient.mainColor.general.hueGradient}
							/>

							<RangeInput
								name={colorSpaces.hsv.colorsParams[1]}
								minValue={colorSpaces.hsv.minValue[1]}
								maxValue={colorSpaces.hsv.maxValue[1]}
								bind:value={hsvValueOfMainColor.s}
								trackBg={inputRangeGradient.mainColor.hsv.s}
							/>

							<RangeInput
								name={colorSpaces.hsv.colorsParams[2]}
								minValue={colorSpaces.hsv.minValue[2]}
								maxValue={colorSpaces.hsv.maxValue[2]}
								bind:value={hsvValueOfMainColor.v}
								trackBg={inputRangeGradient.mainColor.hsv.v}
							/>
						{:else if $colorModeSelected === 'cmyk'}
							<RangeInput
								name={colorSpaces.cmyk.colorsParams[0]}
								minValue={colorSpaces.cmyk.minValue[0]}
								maxValue={colorSpaces.cmyk.maxValue[0]}
								bind:value={cmykValueOfMainColor.c}
								trackBg={inputRangeGradient.mainColor.cmyk.c}
							/>

							<RangeInput
								name={colorSpaces.cmyk.colorsParams[1]}
								minValue={colorSpaces.cmyk.minValue[1]}
								maxValue={colorSpaces.cmyk.maxValue[1]}
								bind:value={cmykValueOfMainColor.m}
								trackBg={inputRangeGradient.mainColor.cmyk.m}
							/>

							<RangeInput
								name={colorSpaces.cmyk.colorsParams[2]}
								minValue={colorSpaces.cmyk.minValue[2]}
								maxValue={colorSpaces.cmyk.maxValue[2]}
								bind:value={cmykValueOfMainColor.y}
								trackBg={inputRangeGradient.mainColor.cmyk.y}
							/>

							<RangeInput
								name={colorSpaces.cmyk.colorsParams[3]}
								minValue={colorSpaces.cmyk.minValue[3]}
								maxValue={colorSpaces.cmyk.maxValue[3]}
								bind:value={cmykValueOfMainColor.k}
								trackBg={inputRangeGradient.mainColor.cmyk.k}
							/>
						{/if}
					</div>
				{:else if $whichHexIsSelected == 'compareColor1'}
					<div class="inputRangeContainer" style="border: 3px solid {$compareColorHex1}; ">
						{#if $colorModeSelected === 'rgb'}
							<RangeInput
								name={colorSpaces.rgb.colorsParams[0]}
								minValue={colorSpaces.rgb.minValue[0]}
								maxValue={colorSpaces.rgb.maxValue[0]}
								bind:value={rgbValueOfCompareColor1.r}
								trackBg={inputRangeGradient.compareColor1.rgb.rGradient}
							/>

							<RangeInput
								name={colorSpaces.rgb.colorsParams[1]}
								minValue={colorSpaces.rgb.minValue[1]}
								maxValue={colorSpaces.rgb.maxValue[1]}
								bind:value={rgbValueOfCompareColor1.g}
								trackBg={inputRangeGradient.compareColor1.rgb.gGradient}
							/>

							<RangeInput
								name={colorSpaces.rgb.colorsParams[2]}
								minValue={colorSpaces.rgb.minValue[2]}
								maxValue={colorSpaces.rgb.maxValue[2]}
								bind:value={rgbValueOfCompareColor1.b}
								trackBg={inputRangeGradient.compareColor1.rgb.bGradient}
							/>
						{:else if $colorModeSelected === 'hsl'}
							<RangeInput
								name={colorSpaces.hsl.colorsParams[0]}
								minValue={colorSpaces.hsl.minValue[0]}
								maxValue={colorSpaces.hsl.maxValue[0]}
								bind:value={hslValueOfCompareColor1.h}
								trackBg={inputRangeGradient.compareColor1.general.hueGradient}
							/>

							<RangeInput
								name={colorSpaces.hsl.colorsParams[1]}
								minValue={colorSpaces.hsl.minValue[1]}
								maxValue={colorSpaces.hsl.maxValue[1]}
								bind:value={hslValueOfCompareColor1.s}
								trackBg={inputRangeGradient.compareColor1.hsl.saturationGradient}
							/>

							<RangeInput
								name={colorSpaces.hsl.colorsParams[2]}
								minValue={colorSpaces.hsl.minValue[2]}
								maxValue={colorSpaces.hsl.maxValue[2]}
								bind:value={hslValueOfCompareColor1.l}
								trackBg={inputRangeGradient.compareColor1.hsl.lightnessGradient}
							/>
						{:else if $colorModeSelected === 'hsv'}
							<RangeInput
								name={colorSpaces.hsv.colorsParams[0]}
								minValue={colorSpaces.hsv.minValue[0]}
								maxValue={colorSpaces.hsv.maxValue[0]}
								bind:value={hsvValueOfCompareColor1.h}
								trackBg={inputRangeGradient.compareColor1.general.hueGradient}
							/>

							<RangeInput
								name={colorSpaces.hsv.colorsParams[1]}
								minValue={colorSpaces.hsv.minValue[1]}
								maxValue={colorSpaces.hsv.maxValue[1]}
								bind:value={hsvValueOfCompareColor1.s}
								trackBg={inputRangeGradient.compareColor1.hsv.s}
							/>

							<RangeInput
								name={colorSpaces.hsv.colorsParams[2]}
								minValue={colorSpaces.hsv.minValue[2]}
								maxValue={colorSpaces.hsv.maxValue[2]}
								bind:value={hsvValueOfCompareColor1.v}
								trackBg={inputRangeGradient.compareColor1.hsv.v}
							/>
						{:else if $colorModeSelected === 'cmyk'}
							<RangeInput
								name={colorSpaces.cmyk.colorsParams[0]}
								minValue={colorSpaces.cmyk.minValue[0]}
								maxValue={colorSpaces.cmyk.maxValue[0]}
								bind:value={cmykValueOfCompareColor1.c}
								trackBg={inputRangeGradient.compareColor1.cmyk.c}
							/>

							<RangeInput
								name={colorSpaces.cmyk.colorsParams[1]}
								minValue={colorSpaces.cmyk.minValue[1]}
								maxValue={colorSpaces.cmyk.maxValue[1]}
								bind:value={cmykValueOfCompareColor1.m}
								trackBg={inputRangeGradient.compareColor1.cmyk.m}
							/>

							<RangeInput
								name={colorSpaces.cmyk.colorsParams[2]}
								minValue={colorSpaces.cmyk.minValue[2]}
								maxValue={colorSpaces.cmyk.maxValue[2]}
								bind:value={cmykValueOfCompareColor1.y}
								trackBg={inputRangeGradient.compareColor1.cmyk.y}
							/>

							<RangeInput
								name={colorSpaces.cmyk.colorsParams[3]}
								minValue={colorSpaces.cmyk.minValue[3]}
								maxValue={colorSpaces.cmyk.maxValue[3]}
								bind:value={cmykValueOfCompareColor1.k}
								trackBg={inputRangeGradient.compareColor1.cmyk.k}
							/>
						{/if}
					</div>
				{:else if $whichHexIsSelected == 'compareColor2'}
					<div class="inputRangeContainer" style="border: 3px solid {$compareColorHex2}; ">
						{#if $colorModeSelected === 'rgb'}
							<RangeInput
								name={colorSpaces.rgb.colorsParams[0]}
								minValue={colorSpaces.rgb.minValue[0]}
								maxValue={colorSpaces.rgb.maxValue[0]}
								bind:value={rgbValueOfCompareColor2.r}
								trackBg={inputRangeGradient.compareColor2.rgb.rGradient}
							/>

							<RangeInput
								name={colorSpaces.rgb.colorsParams[1]}
								minValue={colorSpaces.rgb.minValue[1]}
								maxValue={colorSpaces.rgb.maxValue[1]}
								bind:value={rgbValueOfCompareColor2.g}
								trackBg={inputRangeGradient.compareColor2.rgb.gGradient}
							/>

							<RangeInput
								name={colorSpaces.rgb.colorsParams[2]}
								minValue={colorSpaces.rgb.minValue[2]}
								maxValue={colorSpaces.rgb.maxValue[2]}
								bind:value={rgbValueOfCompareColor2.b}
								trackBg={inputRangeGradient.compareColor2.rgb.bGradient}
							/>
						{:else if $colorModeSelected === 'hsl'}
							<RangeInput
								name={colorSpaces.hsl.colorsParams[0]}
								minValue={colorSpaces.hsl.minValue[0]}
								maxValue={colorSpaces.hsl.maxValue[0]}
								bind:value={hslValueOfCompareColor2.h}
								trackBg={inputRangeGradient.compareColor2.general.hueGradient}
							/>

							<RangeInput
								name={colorSpaces.hsl.colorsParams[1]}
								minValue={colorSpaces.hsl.minValue[1]}
								maxValue={colorSpaces.hsl.maxValue[1]}
								bind:value={hslValueOfCompareColor2.s}
								trackBg={inputRangeGradient.compareColor2.hsl.saturationGradient}
							/>

							<RangeInput
								name={colorSpaces.hsl.colorsParams[2]}
								minValue={colorSpaces.hsl.minValue[2]}
								maxValue={colorSpaces.hsl.maxValue[2]}
								bind:value={hslValueOfCompareColor2.l}
								trackBg={inputRangeGradient.compareColor2.hsl.lightnessGradient}
							/>
						{:else if $colorModeSelected === 'hsv'}
							<RangeInput
								name={colorSpaces.hsv.colorsParams[0]}
								minValue={colorSpaces.hsv.minValue[0]}
								maxValue={colorSpaces.hsv.maxValue[0]}
								bind:value={hsvValueOfCompareColor2.h}
								trackBg={inputRangeGradient.compareColor2.general.hueGradient}
							/>

							<RangeInput
								name={colorSpaces.hsv.colorsParams[1]}
								minValue={colorSpaces.hsv.minValue[1]}
								maxValue={colorSpaces.hsv.maxValue[1]}
								bind:value={hsvValueOfCompareColor2.s}
								trackBg={inputRangeGradient.compareColor2.hsv.s}
							/>

							<RangeInput
								name={colorSpaces.hsv.colorsParams[2]}
								minValue={colorSpaces.hsv.minValue[2]}
								maxValue={colorSpaces.hsv.maxValue[2]}
								bind:value={hsvValueOfCompareColor2.v}
								trackBg={inputRangeGradient.compareColor2.hsv.v}
							/>
						{:else if $colorModeSelected === 'cmyk'}
							<RangeInput
								name={colorSpaces.cmyk.colorsParams[0]}
								minValue={colorSpaces.cmyk.minValue[0]}
								maxValue={colorSpaces.cmyk.maxValue[0]}
								bind:value={cmykValueOfCompareColor2.c}
								trackBg={inputRangeGradient.compareColor2.cmyk.c}
							/>

							<RangeInput
								name={colorSpaces.cmyk.colorsParams[1]}
								minValue={colorSpaces.cmyk.minValue[1]}
								maxValue={colorSpaces.cmyk.maxValue[1]}
								bind:value={cmykValueOfCompareColor2.m}
								trackBg={inputRangeGradient.compareColor2.cmyk.m}
							/>

							<RangeInput
								name={colorSpaces.cmyk.colorsParams[2]}
								minValue={colorSpaces.cmyk.minValue[2]}
								maxValue={colorSpaces.cmyk.maxValue[2]}
								bind:value={cmykValueOfCompareColor2.y}
								trackBg={inputRangeGradient.compareColor2.cmyk.y}
							/>

							<RangeInput
								name={colorSpaces.cmyk.colorsParams[3]}
								minValue={colorSpaces.cmyk.minValue[3]}
								maxValue={colorSpaces.cmyk.maxValue[3]}
								bind:value={cmykValueOfCompareColor2.k}
								trackBg={inputRangeGradient.compareColor2.cmyk.k}
							/>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</FullScreenDisplay>
{/if}

<style>
	#compareColorContainer {
		position: absolute;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		box-sizing: border-box;

		padding: 12.26%;

		height: 100%;
		width: 100%;
	}

	.inputRangeContainer {
		display: flex;
		flex-direction: column;
		border-radius: var(--br);
		padding: 20px 20px 30px;
		gap: 23px;
	}

	.color-settings-container {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		justify-content: space-evenly;
	}
</style>
