<script>
	export let colorOfThisCompareColor;
	export let sizeOfThisCompareColor;

	function generateRandomId() {
		return 'compareColor' + '-' + Math.random().toString(36).substring(2, 9);
	}

	const compareColorId = generateRandomId();

	$: heightOfCompareColor = `${sizeOfThisCompareColor}%`;
</script>

<div
	id={compareColorId}
	class="CompareColorContainer"
	style="background: {colorOfThisCompareColor}; 
	height: {heightOfCompareColor}; "
>
	&nbsp
</div>

<style>
	.CompareColorContainer {
		border-radius: var(--br);

		transition: 0.3s;
		width: 100%;
	}
</style>
