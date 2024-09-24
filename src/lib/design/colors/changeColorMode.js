// @ts-nocheck
export function changeColorMode(color) {
	localStorage.setItem('colorMode', JSON.stringify(color));

	const storedColorMode = localStorage.getItem('colorMode');

	document.body.setAttribute('data-color-mode', color);
}

// 	import { changeColorMode } from '$lib/design/colors/changeColor';

// <button on:click={() => changeColorMode('colorTheme')}>X</button>
