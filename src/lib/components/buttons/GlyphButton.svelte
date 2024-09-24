<script>
	import SvgMorph from './svgMorphForButtons.svelte';

	let {
		glyphName = 'randomize',
		description = glyphName,
		tooltipLocation = 'top',
		onClick = () => {},
		inSecondState = false,
		viewBox = 'viewBox',
		showTooltips = true,
		buttonAspectRatio = '1/1',
		buttonHide = false,
		useAction = () => {},
		tooltipsSpaceBetween = '8px',
		animeDuration
	} = $props();

	let spaceBetweenSetup = `calc(100% + ${tooltipsSpaceBetween})`;
</script>

<button
	use:useAction
	aria-label={description}
	onclick={onClick}
	class:buttonHide
	style="aspect-ratio: {buttonAspectRatio};"
>
	<SvgMorph {glyphName} {inSecondState} {viewBox} {animeDuration} />
	<!-- Tooltips -->
	{#if showTooltips}
		{#if tooltipLocation == 'top'}
			<span class="tooltip top" style="bottom:{spaceBetweenSetup}; user-select: none;"
				>{description}</span
			>
		{:else if tooltipLocation == 'bot'}
			<span class="tooltip bot" style="top:{spaceBetweenSetup}; user-select: none;"
				>{description}</span
			>
		{:else if tooltipLocation == 'right'}
			<span class="tooltip left" style="left:{spaceBetweenSetup}; user-select: none;"
				>{description}</span
			>
		{:else if tooltipLocation == 'left'}
			<span class="tooltip right" style="right:{spaceBetweenSetup}; user-select: none;"
				>{description}</span
			>
		{:else if tooltipLocation == 'top-left'}
			<span class="tooltip top-left" style="bottom:{spaceBetweenSetup}; user-select: none;"
				>{description}</span
			>
		{:else if tooltipLocation == 'top-right'}
			<span class="tooltip top-right" style="bottom:{spaceBetweenSetup}; user-select: none;"
				>{description}</span
			>
		{:else if tooltipLocation == 'bot-left'}
			<span class="tooltip bot-left" style="top:{spaceBetweenSetup}; user-select: none;"
				>{description}</span
			>
		{:else if tooltipLocation == 'bot-right'}
			<span class="tooltip bot-right" style="top:{spaceBetweenSetup}; user-select: none;"
				>{description}</span
			>
		{/if}
	{/if}
	<!-- ------- -->
</button>

<style>
	button {
		position: relative;

		border-radius: var(--br);
		height: 100%;
		transition: 0.4s;
	}

	.buttonHide {
		opacity: 0;
		cursor: default;
	}

	/* button:active {
		transform: scale(0.89);
	} */

	/* Tooltips */

	span {
		color: var(--t1);
		text-align: center;
		font-family: var(--typo1);
		font-weight: 400;
		font-size: 0.9rem;
	}

	button:hover .tooltip {
		visibility: visible;
		opacity: 1;
	}

	.tooltip {
		visibility: hidden;

		background-color: var(--b1o3);
		text-align: center;
		padding: 5px 10px;
		border-radius: var(--br);

		opacity: 0;
		transition: opacity 1s;

		white-space: nowrap;
		position: absolute;
		z-index: 1;
	}
	.top {
		transform: translateX(-50%);

		left: 50%;
	}
	.top-left {
		transform: translateX(-100%);
		border-radius: var(--br) var(--br) 0 var(--br);

		left: 50%;
	}
	.top-right {
		transform: translateX(100%);
		border-radius: var(--br) var(--br) var(--br) 0;

		right: 50%;
	}
	.bot {
		transform: translateX(-50%);

		left: 50%;
	}
	.bot-left {
		transform: translateX(-100%);
		border-radius: var(--br) 0px var(--br) var(--br);

		left: 50%;
	}
	.bot-right {
		transform: translateX(100%);
		border-radius: 0px var(--br) var(--br) var(--br);

		right: 50%;
	}
	.right {
		right: calc(100% + 10px);
	}
	.left {
		left: calc(100% + 10px);
	}

	/* Arrow */
	/* .top::after {
		content: ' ';
		position: absolute;
		top: 100%;
		left: 50%;
		margin-left: -5px;
		border-width: 5px;
		border-style: solid;
		border-color: var(--b1o3) transparent transparent transparent;
	}

	.bot::after {
		content: ' ';
		position: absolute;
		bottom: 100%;
		left: 50%;
		margin-left: -5px;
		border-width: 5px;
		border-style: solid;
		border-color: transparent transparent var(--b1o3) transparent;
	}
	.right::after {
		content: ' ';
		position: absolute;
		top: 50%;
		left: 100%;
		margin-top: -5px;
		border-width: 5px;
		border-style: solid;
		border-color: transparent transparent transparent var(--b1o3);
	}
	.left::after {
		content: ' ';
		position: absolute;
		top: 50%;
		right: 100%;
		margin-top: -5px;
		border-width: 5px;
		border-style: solid;
		border-color: transparent var(--b1o3) transparent transparent;
	} */

	/*  */

	/* .top-left::after {
		content: ' ';
		position: absolute;
		top: 100%; 
		right: 1.3%;
		margin-left: -5px;
		border-width: 3px;
		border-style: solid;
		border-color: var(--b1o3) var(--b1o3) transparent transparent;
	} */
</style>
