import { customElement, html, LitElement, property, state, query } from 'lit-element';
import { TemplateResult } from 'lit';
import { ClassInfo, classMap } from 'lit/directives/class-map.js';
import { CSSResultGroup } from '@lit/reactive-element/css-tag';

// @ts-expect-error: figure out the way to avoid errors for scss imports
import style from './ripple.scss';

export const RIPPLE_TAG_NAME = 'yt-ripple';

enum RippleState {
	idle,
	pressed,
}

const rippleConfig = {
	startScale: 0.2,
	animationDuration: 300,
};

interface AnimationCoordinate {
	x: number;
	y: number;
}

@customElement(RIPPLE_TAG_NAME)
export class RippleComponent extends LitElement {
	static override get styles(): CSSResultGroup {
		return [style];
	}

	@query('.yt-ripple') private _rippleElement!: HTMLElement;

	private _rippleSizePx = 0;
	private _rippleScale = 0;

	@property({ type: Boolean, reflect: true }) disabled = false;

	@state() state = RippleState.idle;

	onPress(event: Event): void {
		this.state = RippleState.pressed;
		this._calculateRippleSize();

		const { start, end } = this._getAnimationCoordinates(event);

		const animation = this._rippleElement.animate(
			{
				top: [0, 0],
				left: [0, 0],
				height: [this._rippleSizePx + 'px', this._rippleSizePx + 'px'],
				width: [this._rippleSizePx + 'px', this._rippleSizePx + 'px'],
				transform: [
					`translate(${start.x}px, ${start.y}px) scale(1)`,
					`translate(${end.x}px, ${end.y}px) scale(${this._rippleScale})`,
				],
				opacity: [0],
			},
			{ duration: rippleConfig.animationDuration }
		);
	}

	protected override render(): TemplateResult {
		return html`<span class="${classMap(this._getRippleContainerClasses())}"></span>`;
	}

	private _getRippleContainerClasses(): ClassInfo {
		return {
			'yt-ripple': true,
			'yt-ripple--pressed': this.state === RippleState.pressed,
		};
	}

	private _getHostDimensions(): DOMRect {
		return (this.parentElement ?? this).getBoundingClientRect();
	}

	private _calculateRippleSize(): void {
		const hostDimensions = this._getHostDimensions();
		const rippleDiameter = Math.max(hostDimensions.height, hostDimensions.width);
		const rippleRadius = rippleDiameter / 2;

		const rippleSizeStart = Math.floor(rippleDiameter * rippleConfig.startScale);

		this._rippleScale = rippleDiameter / rippleSizeStart;
		this._rippleSizePx = rippleSizeStart;
	}

	private _getAnimationCoordinates(event: Event): { start: AnimationCoordinate; end: AnimationCoordinate } {
		const { scrollX, scrollY } = window;
		const { left, top, width, height } = this._getHostDimensions();
		const documentX = scrollX + left;
		const documentY = scrollY + top;

		let startCoordinate: AnimationCoordinate;
		if (event instanceof PointerEvent) {
			const { pageX, pageY } = event;
			startCoordinate = { x: pageX - documentX, y: pageY - documentY };
		} else {
			// TODO does not work well
			startCoordinate = {
				x: width / 2,
				y: height / 2,
			};
		}

		return {
			start: { x: startCoordinate.x - this._rippleSizePx / 2, y: startCoordinate.y - this._rippleSizePx / 2 },
			end: {
				x: (width - this._rippleSizePx) / 2,
				y: (height - this._rippleSizePx) / 2,
			},
		};
	}
}
