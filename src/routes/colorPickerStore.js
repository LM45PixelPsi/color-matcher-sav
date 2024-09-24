import { writable } from 'svelte/store';

//@param Hex of each color parts
export const mainHex = writable('#0f2852');
export const compareColorHex1 = writable('');
export const compareColorHex2 = writable('');

//@param If color comparators is open or not
export const compareColor1IsOpen = writable(false);
export const compareColor2IsOpen = writable(false);

//@param The size of color comparators
export const compareColorSize1 = writable(32.5);
export const compareColorSize2 = writable(32.5);

//@param Which color mode is selected
export const colorModeSelected = writable('hsl');

//@param Which hex input is selected
export const whichHexIsSelected = writable('mainHex');

//@dev Needed for reduce bugs
export const inputTextOnFocus = writable(false);
