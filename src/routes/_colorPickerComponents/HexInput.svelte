<script>
	import GlyphButton from '$lib/components/buttons/GlyphButton.svelte';
	import { colord, random } from 'colord';
	import { afterUpdate, onMount } from 'svelte';
	import {
		inputTextOnFocus,
		compareColorHex1,
		whichHexIsSelected,
		compareColor1IsOpen,
		compareColor2IsOpen,
		mainHex,
		compareColorHex2
	} from '../colorPickerStore';

	import { tooltipOfControlsContainer } from '$lib/components/FullScreenDisplay/fullscreenStore';

	let copyButtonSecondState = false;
	let copyButtonInfo = 'Copy hex';
	let hexCopied = '';

	export let resetInputRange = () => {};
	export let HexOfThisInput;
	export let thisHexInputName;
	// export let mobileDisplay = false;
	export let sizeOfThisCompareColor = 40;

	export let showOptions = true;

	// --- tooltip modifer
	function isMobileOrTablet() {
		const userAgent = navigator.userAgent.toLowerCase();
		const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'tablet'];
		return mobileKeywords.some((keyword) => userAgent.includes(keyword));
	}

	const isMobileOrTabletDevice = isMobileOrTablet();

	function changeTooltipFullSreenTxt(text) {
		if (!isMobileOrTabletDevice) {
			$tooltipOfControlsContainer = text;
		}
	}

	// Remove tooltips on mobile device

	function displayTooltipsOnFullscreenDisplay(n) {
		if (!isMobileOrTabletDevice) {
			function coucou() {
				const ariaLabel = n.getAttribute('aria-label');
				changeTooltipFullSreenTxt(ariaLabel);
			}

			function bye() {
				changeTooltipFullSreenTxt('');
			}

			n.addEventListener('mouseenter', coucou);
			n.addEventListener('mouseleave', bye);
		}
	}

	let publicNameOfThisColor;

	if (thisHexInputName == 'mainHex') {
		publicNameOfThisColor = 'background color';
	} else if (thisHexInputName == 'compareColor1') {
		publicNameOfThisColor = 'second color';
	} else if (thisHexInputName == 'compareColor2') {
		publicNameOfThisColor = 'third color';
	}

	//  --- Input control

	$: {
		let inputValue = HexOfThisInput;

		if (!inputValue.startsWith('#') && inputValue !== '') {
			HexOfThisInput = '#' + inputValue;
		}

		if (colord(HexOfThisInput).isValid() == false) {
			changeTooltipFullSreenTxt(`Hex invalid, this is not a color !`);
		} else {
			changeTooltipFullSreenTxt('');
		}
	}

	// remove focus on press enter (mobile)
	function enterKeyDown(e) {
		if (e.key === 'Enter') {
			document.activeElement.blur();
		}
	}

	// select all the hex on dbclick

	function selectAllTxtOnDbClick(n) {
		n.addEventListener('dblclick', () => n.select());
		return {
			destroy() {
				n.removeEventListener('dblclick', () => n.select());
			}
		};
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(HexOfThisInput);
		changeTooltipFullSreenTxt(`Hex of the ${publicNameOfThisColor} copied !`);
		hexCopied = HexOfThisInput;
		copyButtonSecondState = true;
	}

	afterUpdate(() => {
		if (hexCopied !== HexOfThisInput) {
			copyButtonInfo = `Copy the hex of the ${publicNameOfThisColor}`;
			copyButtonSecondState = false;
		}
	});

	let randomGlyphBoolean = false;

	function randomButtonFunction() {
		HexOfThisInput = random().toHex();
		resetInputRange();
		if (randomGlyphBoolean) {
			randomGlyphBoolean = false;
		} else {
			randomGlyphBoolean = true;
		}
	}

	function resetInputRangeOnInputText(n) {
		inputTextOnFocus.set(true);
		if (colord(HexOfThisInput).isValid()) {
			resetInputRange();
		} else {
		}
	}

	// --- CompareColor size

	function colorSizeIncrement() {
		if (sizeOfThisCompareColor < 95) {
			sizeOfThisCompareColor = sizeOfThisCompareColor + 7.5;
		}
	}
	function colorSizeDecrement() {
		if (sizeOfThisCompareColor > 7.5) {
			sizeOfThisCompareColor = sizeOfThisCompareColor - 7.5;
		}
	}

	// ====

	function changeHexSelected() {
		if ($whichHexIsSelected !== thisHexInputName) {
			$whichHexIsSelected = thisHexInputName;
			changeTooltipFullSreenTxt(`The ${publicNameOfThisColor} is selected !`);
		}
	}

	$: descriptionOfTheAddOneCompareColorButton =
		$compareColor1IsOpen === false
			? 'Add a second color'
			: $compareColor1IsOpen === true && $compareColor2IsOpen === false
				? 'Add a third color'
				: '';

	$: descriptionOfTheSelectColorButton =
		$whichHexIsSelected !== thisHexInputName ? `Select the ${publicNameOfThisColor}` : '';

	function addOneCompareColor() {
		if ($compareColor1IsOpen === false) {
			$whichHexIsSelected = 'compareColor1';
			$compareColorHex1 = colord($mainHex).invert().toHex();
			$compareColor1IsOpen = true;
			changeTooltipFullSreenTxt('The second color is open !');
		} else if ($compareColor1IsOpen === true && $compareColor2IsOpen == false) {
			$whichHexIsSelected = 'compareColor2';
			$compareColorHex2 = colord($compareColorHex1).rotate(50).toHex();
			$compareColor2IsOpen = true;
			changeTooltipFullSreenTxt('The third color is open !');
		}
	}

	function suppCompareColor() {
		if (thisHexInputName === 'compareColor1') {
			$whichHexIsSelected = 'mainHex';
			$compareColor1IsOpen = false;
			changeTooltipFullSreenTxt('The second color is removed !');
		} else if (thisHexInputName === 'compareColor2') {
			$whichHexIsSelected = 'mainHex';
			$compareColor2IsOpen = false;
			changeTooltipFullSreenTxt('The third color is removed !');
		}
	}

	let customRadioIsTchecked;
	afterUpdate(() => {
		customRadioIsTchecked = $whichHexIsSelected === thisHexInputName ? false : true;
	});

	onMount(() => {
		resetInputRange();
	});

	export let wavelengthSetup;

	$: adddd = $compareColor1IsOpen == true && $compareColor2IsOpen == true ? true : false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->

<div id="hexDisplay" style="border: 3px solid {HexOfThisInput};">
	<div class="t-container">
		<div class="hex-container">
			{#if showOptions}
				<GlyphButton
					glyphName="onSelec"
					inSecondState={customRadioIsTchecked}
					onClick={changeHexSelected}
					useAction={displayTooltipsOnFullscreenDisplay}
					description={descriptionOfTheSelectColorButton}
					showTooltips={false}
				/>
			{/if}
			<input
				id="{thisHexInputName}HexInputText"
				class="HexInputText"
				autocomplete="off"
				spellcheck="false"
				type="text"
				bind:value={HexOfThisInput}
				maxlength="7"
				on:keydown={enterKeyDown}
				on:input={resetInputRangeOnInputText}
				on:blur={() => {
					inputTextOnFocus.set(false);
				}}
				use:selectAllTxtOnDbClick
			/>
		</div>
		{#if showOptions}
			<div class="btn-container">
				{#if thisHexInputName == 'compareColor1' || thisHexInputName == 'compareColor2'}
					<GlyphButton
						glyphName="deleteThisOne"
						onClick={suppCompareColor}
						showTooltips={false}
						useAction={displayTooltipsOnFullscreenDisplay}
						description="Delete the {publicNameOfThisColor}"
					/>
					<GlyphButton
						glyphName="incrementSize"
						onClick={colorSizeIncrement}
						showTooltips={false}
						useAction={displayTooltipsOnFullscreenDisplay}
						description="Increment the size of the {publicNameOfThisColor}"
					/>

					<GlyphButton
						glyphName="decrementSize"
						onClick={colorSizeDecrement}
						showTooltips={false}
						useAction={displayTooltipsOnFullscreenDisplay}
						description="Decrement the size of the {publicNameOfThisColor}"
					/>
				{/if}
				{#if thisHexInputName == 'mainHex' && !wavelengthSetup}
					<GlyphButton
						glyphName="addOneMore"
						onClick={addOneCompareColor}
						inSecondState={adddd}
						description={descriptionOfTheAddOneCompareColorButton}
						showTooltips={false}
						useAction={displayTooltipsOnFullscreenDisplay}
						buttonHide={adddd}
					/>
				{/if}

				<GlyphButton
					tooltipsSpaceBetween="16px"
					description="Randomize the {publicNameOfThisColor}"
					onClick={randomButtonFunction}
					glyphName="randomize"
					tooltipLocation="top-left"
					inSecondState={randomGlyphBoolean}
					showTooltips={false}
					useAction={displayTooltipsOnFullscreenDisplay}
				/>
			</div>
		{/if}
	</div>
</div>

<style>
	.HexInputText {
		width: 100%;
	}
	.t-container {
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 30px;
	}

	@media screen and (max-width: 430px) {
		.t-container {
			height: 27px;
		}
	}

	.hex-container {
		display: flex;
		justify-content: space-between;
		gap: 10px;
	}

	.btn-container {
		display: flex;
		width: 100%;
		justify-content: flex-end;
		gap: 10px;
	}
	#hexDisplay {
		border-radius: var(--br);
		background: var(--b1o3);
		padding: 5px 10px;
	}
</style>
