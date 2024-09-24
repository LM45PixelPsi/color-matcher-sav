<script>
	import { glyphsBank } from '$lib/design/glyphs/glyphsBank';
	import anime from 'animejs';

	let { inSecondState = false, glyphName, viewBox = 'viewBox', animeDuration = 600 } = $props();

	function onClickAnim() {}

	function generateRandomId() {
		return 'path' + glyphName + '-' + Math.random().toString(36).substring(2, 9);
	}

	const pathId = generateRandomId();

	let glyphPath = glyphsBank.basicIconForGlyphButton.glyphName;

	$effect(() => {
		if (inSecondState) {
			glyphPath = glyphsBank.basicIconForGlyphButton[glyphName].secondState;
			anime({
				targets: `#${pathId}`,
				d: glyphPath.base,
				direction: 'normal',
				easing: 'easeInOutQuad',
				duration: animeDuration
			});
		} else if (!inSecondState) {
			glyphPath = glyphsBank.basicIconForGlyphButton[glyphName];

			anime({
				targets: `#${pathId}`,
				d: glyphPath.base,
				direction: 'normal',
				easing: 'easeInOutQuad',
				duration: animeDuration
			});
		}
	});

	function actionSet(node) {
		function onMouseEnter() {
			if (glyphPath.hover) {
				let animatedPath = [];
				for (let i = 0; i < glyphPath.hover.length; i++) {
					animatedPath.push(glyphPath.hover[i]);
				}
				anime({
					targets: `#${pathId}`,
					d: animatedPath,
					direction: 'normal',
					easing: 'easeInOutQuad',
					duration: animeDuration
				});
			}
		}
		function onMouseLeave() {
			if (glyphPath.hover) {
				anime({
					targets: `#${pathId}`,
					d: glyphPath.base,
					direction: 'normal',
					easing: 'easeInOutQuad',
					duration: animeDuration
				});
			}
		}
		node.addEventListener('mouseenter', onMouseEnter);
		node.addEventListener('mousehover', onMouseEnter);
		node.addEventListener('touchstart', onMouseEnter);
		node.addEventListener('mouseleave', onMouseLeave);
		node.addEventListener('touchend', onMouseLeave);

		return {
			destroy() {
				node.removeEventListener('mouseenter', onMouseEnter);
				node.removeEventListener('mousehover', onMouseEnter);
				node.removeEventListener('touchstart', onMouseEnter);
				node.removeEventListener('mouseleave', onMouseLeave);
				node.removeEventListener('touchend', onMouseLeave);
			}
		};
	}
</script>

<!-- svelte-ignore a11y_interactive_supports_focus -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<svg viewBox={glyphsBank.settings[viewBox]} use:actionSet onclick={onClickAnim} role="button">
	<path id={pathId} d={glyphsBank.basicIconForGlyphButton[glyphName].base} />
</svg>

<style>
	svg {
		opacity: 0.8;
		transition: 0.4s;
	}

	svg:hover {
		opacity: 1;
	}
</style>
