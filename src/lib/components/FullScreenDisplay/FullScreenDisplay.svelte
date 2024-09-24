<script>
	import GlyphButton from '../buttons/GlyphButton.svelte';
	import {
		fullscreenUtils,
		tooltipOfControlsContainer
	} from '$lib/components/FullScreenDisplay/fullscreenStore';
	import { onMount, afterUpdate } from 'svelte';

	export let controllerIsHiddenOnstart = false;

	let hideControllers = false;
	let hideControllersClassStyle = true;
	let hideInterfaceToggleButton = false;
	let okForFullscreen = false;
	let fullscreenButtonSecondState = false;

	let fullscreenGlyphDescription = 'go fullscreen';
	function goFullScreen(id) {
		fullscreenUtils.toggleFullscreen(id);

		if (!document.fullscreenElement) {
			fullscreenButtonSecondState = true;
			fullscreenGlyphDescription = 'Exit fullscreen';
		} else {
			fullscreenGlyphDescription = 'Go fullscreen';
			fullscreenButtonSecondState = false;
		}
	}

	let timer;

	// Controls Display

	let controlsContainerHeight;
	let botInterfaceToggleButton;
	const marginBotControlsContainer = 50;

	onMount(() => {
		controlsContainerHeight = document.getElementById('controlsContainer').clientHeight;

		if (controllerIsHiddenOnstart) {
			setControllersVisibility();
			onMouseMove();
		} else {
			hideControllersClassStyle = false;
		}

		botInterfaceToggleButton = marginBotControlsContainer - 30 + 'px';
	});

	afterUpdate(() => {
		controlsContainerHeight = document.getElementById('controlsContainer').clientHeight;
	});

	let botOfControlsContainer = marginBotControlsContainer + 'px';

	$: topOfControlsContainer = marginBotControlsContainer + controlsContainerHeight + 'px';

	function setControllersVisibility() {
		if (hideControllers === false) {
			hideControllers = true;
			okForFullscreen = true;
			botOfControlsContainer = '-' + (controlsContainerHeight + 200) + 'px';
			hideControllersClassStyle = true;
			onMouseMove();
		} else {
			hideControllers = false;
			clearTimeout(timer);
			okForFullscreen = false;
			botOfControlsContainer = marginBotControlsContainer + 'px';
			hideControllersClassStyle = false;
		}
	}

	function onMouseMove() {
		clearTimeout(timer);
		hideInterfaceToggleButton = false;
		document.body.style.cursor = 'auto';
		if (okForFullscreen) {
			clearTimeout(timer);
			timer = setTimeout(() => {
				hideInterfaceToggleButton = true;
				document.body.style.cursor = 'none';
			}, 3000);
		}
	}

	function mainFullScreenFunctions(node) {
		node.addEventListener('dblclick', () => goFullScreen('#mainFullScreenDisplay'));
		node.addEventListener('mousemove', onMouseMove);

		return {
			destroy() {
				node.removeEventListener('dblclick', () => goFullScreen('#mainFullScreenDisplay'));
				node.removeEventListener('mousemove', onMouseMove);
			}
		};
	}

	//

	function isMobileOrTablet() {
		const userAgent = navigator.userAgent.toLowerCase();
		const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'tablet'];
		return mobileKeywords.some((keyword) => userAgent.includes(keyword));
	}

	const isMobileOrTabletDevice = isMobileOrTablet();

	//
</script>

<div id="mainFullScreenDisplay">
	<slot name="mainDisplay" />
	<div use:mainFullScreenFunctions id="zoneVide">&nbsp</div>

	<div id="topRightButtonsContainer" class:hideInterfaceToggleButton>
		{#if !isMobileOrTabletDevice}
			<div class="topRightButtonDisplay">
				<GlyphButton
					onClick={() => goFullScreen('#mainFullScreenDisplay')}
					description={fullscreenGlyphDescription}
					glyphName="fullscreen"
					tooltipLocation="left"
					inSecondState={fullscreenButtonSecondState}
				/>
			</div>
		{/if}

		<slot name="topRightButtons" />
	</div>

	<div
		id="InterfaceToggleButton"
		class:hideInterfaceToggleButton
		style="bottom: {botInterfaceToggleButton};"
	>
		<GlyphButton
			glyphName="showHideFullscreenInterface"
			onClick={() => setControllersVisibility()}
			viewBox="ViewBox100p40"
			inSecondState={hideControllers}
			showTooltips={false}
			buttonAspectRatio="10/4"
		/>
	</div>

	<div
		id="controlsContainer"
		class:hideControllersClassStyle
		style="bottom: {botOfControlsContainer};"
	>
		<slot name="controls">
			<h1>controls</h1>
		</slot>
	</div>
	{#if $tooltipOfControlsContainer}
		<span id="tooltipsContainer" style="bottom: {topOfControlsContainer};">
			{$tooltipOfControlsContainer}
		</span>
	{/if}
</div>

<style>
	.topRightButtonDisplay {
		background: var(--b1o3);
		height: 1.7rem;
		width: 1.7rem;
		padding: 0.3rem;
		border-radius: var(--br);
	}

	#topRightButtonsContainer {
		position: absolute;
		right: 20px;
		top: 20px;
		transition: 0.5s;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 20px;

		z-index: 10;
	}

	#tooltipsContainer {
		position: absolute;
		left: 50%;
		transform: translate(-50%, -7px);
		transition: 0.5s;
		background: var(--b1o3);
		border-radius: var(--br);
		padding: 7px 12px;
		user-select: none;

		color: var(--t1);
		font-family: var(--typo1);
		font-weight: 400;
		font-size: 0.9rem;

		z-index: 10;
	}

	#zoneVide {
		height: 100vh;
		width: 100vw;
		background: none;
		position: absolute;
		bottom: 0;
	}

	#InterfaceToggleButton {
		transition: 0.5s;
		background: var(--b1o3);
		border-radius: var(--br);
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		padding: 4px 8px 6px;
		height: 13px;

		z-index: 10;
	}

	#mainFullScreenDisplay {
		background: #19467a;
		height: 100vh;
		width: 100vw;
		position: relative;
		overflow: hidden;
	}

	#controlsContainer {
		transition: 0.7s;
		background: var(--b1o3);
		border-radius: var(--br);
		width: 80%;
		max-width: 600px;
		position: absolute;
		bottom: 50px;
		left: 50%;
		transform: translateX(-50%);
		padding: 10px 15px;

		z-index: 9;
	}

	.hideControllersClassStyle {
		/* bottom: 100vh !important; */
		opacity: 0;
	}
	.hideInterfaceToggleButton {
		opacity: 0 !important;
	}
</style>
