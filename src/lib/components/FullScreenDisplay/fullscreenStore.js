import { readable, writable } from 'svelte/store';

function utils() {
	const { subscribe } = readable();

	return {
		subscribe,

		toggleFullscreen: (id) => {
			let elem = document.querySelector(id);

			if (!document.fullscreenElement) {
				elem.requestFullscreen().catch((err) => {
					alert(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
				});
			} else {
				document.exitFullscreen();
			}
		}
	};
}

// function UXsetup(){
// 	const {su}
// }

export const fullscreenUtils = utils();
export const tooltipOfControlsContainer = writable('');
