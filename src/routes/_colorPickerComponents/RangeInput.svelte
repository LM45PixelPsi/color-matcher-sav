<script>
	import { glyphsBank } from '$lib/design/glyphs/glyphsBank';

	export let wavelengthSetup = false;

	export let value;
	export let name = 'name';

	export let minValue;
	export let maxValue;

	function isMobileOrTablet() {
		const userAgent = navigator.userAgent.toLowerCase();
		const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'tablet'];
		return mobileKeywords.some((keyword) => userAgent.includes(keyword));
	}

	const isMobileOrTabletDevice = isMobileOrTablet();

	export let trackBg = 'red';

	let isVisible = false;

	function toggleVisibility() {
		isVisible = !isVisible;
	}

	function valueIncrement() {
		if (value < maxValue && value < maxValue) {
			value++;
		}
	}

	function valueDecrement() {
		if (value <= maxValue && value > minValue) {
			value--;
		}
	}
</script>

<div
	role="group"
	class="inputs-container"
	on:mouseenter={toggleVisibility}
	on:mouseleave={toggleVisibility}
>
	<div class="txt-value-display">
		<h5>
			{name} = {value}
			{#if wavelengthSetup}
				nm
			{/if}
		</h5>
		<!-- Not displaying plus and minus button on mobile -->
		{#if !isMobileOrTabletDevice}
			<div class="btn-container" class:visible={isVisible}>
				<button aria-label="minus" on:click={valueDecrement}
					><svg viewBox={glyphsBank.settings.viewBox}>
						<path d={glyphsBank.basicIconForGlyphButton.minus} />
					</svg></button
				><button aria-label="plus" on:click={valueIncrement}
					><svg viewBox={glyphsBank.settings.viewBox}>
						<path d={glyphsBank.basicIconForGlyphButton.plus} />
					</svg></button
				>
			</div>
		{/if}
	</div>
	<div class="range-container">
		<input
			type="range"
			min={minValue}
			max={maxValue}
			maxlength="3"
			bind:value
			tabindex="-1"
			style="--track-background-color:{trackBg};"
		/>
	</div>
</div>

<style>
	button {
		aspect-ratio: 1/1;
		margin-right: 0.7rem;
	}

	.btn-container {
		transition: 0.2s ease-in-out;
		opacity: 0;
		display: flex;
		align-items: center;
	}

	.visible {
		opacity: 1;
	}

	svg {
		margin: auto;
		height: 15px;
		stroke-width: 0.8rem;
	}

	.txt-value-display {
		font-weight: 600;
		display: flex;
		align-items: center;
		cursor: default;
		justify-content: space-between;
		margin: 0 18px 2px;
		user-select: none;
	}

	.inputs-container {
		width: 100%;
		height: 30px;
	}

	.range-container {
		width: 100%;
	}

	/* --- INPUT RANGE --- */
	.inputs-container {
		--track-height: 14px;
		--track-border-radius: 20px;
		--thumb-width: 20px;
	}

	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		background: transparent;
		cursor: pointer;
		width: 100%;
	}

	/***** Track Styles *****/
	/***** Chrome, Safari, Opera, and Edge Chromium *****/
	input[type='range']::-webkit-slider-runnable-track {
		background: var(--track-background-color);
		height: var(--track-height);
		border-radius: var(--track-border-radius);
	}

	/******** Firefox ********/
	input[type='range']::-moz-range-track {
		background: var(--track-background-color);
		height: var(--track-height);
		border-radius: var(--track-border-radius);
	}
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		height: var(--thumb-width);
		width: var(--thumb-width);
		background: none;
		border-radius: 100%;
		margin-top: -3px;
		border: 2px solid var(--t1);
	}

	input[type='range']::-moz-range-thumb {
		border: 2px solid var(--t1); /*Removes extra border that FF applies*/
		border-radius: 100%;
		background: none;
		height: var(--thumb-width);
		width: var(--thumb-width);
	}
</style>
