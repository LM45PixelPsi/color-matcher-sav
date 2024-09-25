<script>
	import GlyphButton from '$lib/components/buttons/GlyphButton.svelte';

	import { colorSpaces } from '../colorSpace';

	import { colorModeSelected } from '../colorPickerStore';

	import { gitHubLink } from '$lib/externalLinks.js';

	// Show other color mode

	$: navShowColorMode = false;

	function showOtherColorMode() {
		if (navShowColorMode == true) {
			navShowColorMode = false;
		} else {
			navShowColorMode = true;
		}
	}

	//
	function changeColorMode(nameOfMode) {
		$colorModeSelected = nameOfMode;

		showOtherColorMode();
	}

	function openGitHub() {
		window.open(gitHubLink, '_blank');
	}

	const colorSpacesArray = Object.entries(colorSpaces);
</script>

<!-- The fullscreen button is in $lib/FullscreenDisplay/FullscreenDisplay.svelte -->

<div class="topRightButtonDisplay">
	<GlyphButton
		glyphName="gitHubLogo"
		onClick={openGitHub}
		tooltipLocation="left"
		description="GitHub"
	/>
</div>

<div class="topRightButtonDisplay">
	<GlyphButton
		glyphName="deployNav1"
		onClick={showOtherColorMode}
		inSecondState={navShowColorMode}
		description="Select Color mode"
		tooltipLocation="left"
	/>
</div>

<div id="navColorModeContainer" class:navShowColorMode>
	<ul class="ulContainer">
		{#each colorSpacesArray as [key, color]}
			{#if $colorModeSelected !== color.slug}
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<li class="liContainer" onclick={() => changeColorMode(color.slug)}>
					<h5>{color.name}</h5>
				</li>
			{/if}
		{/each}
	</ul>
</div>

<style>
	.ulContainer {
		display: flex;
		gap: 10px;
	}

	.liContainer {
		background: var(--b1o3);
		padding: 4px 8px;
		border-radius: var(--br);
	}

	h5 {
		user-select: none;
		opacity: 0.8;
		transition: 0.4s;
	}

	h5:hover {
		opacity: 1;
	}

	#navColorModeContainer {
		transition: 1s;
		position: absolute;
		right: -400px;
	}

	.navShowColorMode {
		right: 0px !important;
	}

	.topRightButtonDisplay {
		background: var(--b1o3);
		height: 1.7rem;
		width: 1.7rem;
		padding: 0.3rem;
		border-radius: var(--br);
		transition: 1s;
		margin: 0 0 20px auto;
	}
</style>
