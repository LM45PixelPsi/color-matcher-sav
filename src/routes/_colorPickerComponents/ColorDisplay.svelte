<script>
	import { afterUpdate } from 'svelte';
	import { mainHex } from '../colorPickerStore';

	function mainColorDisplayIsHover(node) {
		function onMouseEnter() {
			visible = true;
		}

		function onMouseLeave() {
			visible = false;
		}

		node.addEventListener('mouseenter', onMouseEnter);
		node.addEventListener('touchstart', onMouseEnter);

		node.addEventListener('mouseleave', onMouseLeave);
		node.addEventListener('touchend', onMouseLeave);
	}

	let copyButtonInfo = 'Copy hex';
	let hexCopied = '';

	afterUpdate(() => {
		if (hexCopied !== $mainHex && copyButtonInfo !== 'Copy hex') {
			copyButtonInfo = 'Copy hex';
		}
	});
</script>

<div id="color-show">
	<div use:mainColorDisplayIsHover id="main-color-display" style="background: {$mainHex}; ">
		&nbsp
	</div>
	<div
		class="hexDisplayContainer"
		style="
			background: {$mainHex};
			"
	>
		&nbsp
	</div>
</div>

<style>
	.hexDisplayContainer {
		border-radius: 0 0 var(--br) var(--br);
		padding: 0 7px 7px 7px;
	}
	#main-color-display {
		height: 100vh;
		width: 100vw;
		display: flex;
		justify-content: flex-end;
		padding: 7px;
		transition: 0.2s;
	}
</style>
