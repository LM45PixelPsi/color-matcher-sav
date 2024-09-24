const themeValue = JSON.parse(localStorage.getItem('colorMode'));
const defaultColorMode = 'dark';

document.body.setAttribute('data-color-mode', themeValue ?? defaultColorMode);
