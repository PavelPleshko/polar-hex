import { customElement, html, LitElement, property, state, query } from 'lit-element';
import { PropertyValues, TemplateResult } from 'lit';
import { ClassInfo, classMap } from 'lit/directives/class-map.js';

export const RIPPLE_TAG_NAME = 'ph-ripple';

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
	private _inFlightRippleAnimation: Animation | null = null;

	@query('.yt-ripple') private _rippleElement!: HTMLElement;

	private _rippleSizePx = 0;
	private _rippleScale = 0;

	@property({ type: Boolean, reflect: true }) disabled = false;

	@state() state = RippleState.idle;

	onPress(event: Event): void {
		this.state = RippleState.pressed;
		this._inFlightRippleAnimation?.cancel();
		this._calculateRippleSize();

		const { start, end } = this._getAnimationCoordinates(event);

		this._inFlightRippleAnimation = this._rippleElement.animate(
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

		this._inFlightRippleAnimation.addEventListener('finish', () => {
			this._inFlightRippleAnimation = null;
		});
	}

	cancelPress(): void {
		this.state = RippleState.idle;
		this._inFlightRippleAnimation?.cancel();
	}

	protected override render(): TemplateResult {
		return html`<span class="${classMap(this._getRippleContainerClasses())}"></span>`;
	}

	protected override update(changedProperties: PropertyValues<this>): void {
		if (changedProperties.has('disabled') && this.disabled) {
			this.cancelPress();
		}
		super.update(changedProperties);
	}

	protected override createRenderRoot(): Element | ShadowRoot {
		return this;
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
		const softEdgeSize = Math.max(0.35 * rippleDiameter, 75);

		const rippleSizeStart = Math.floor(rippleDiameter * rippleConfig.startScale);

		this._rippleScale = (rippleDiameter + softEdgeSize) / rippleSizeStart;
		this._rippleSizePx = rippleSizeStart;
	}

	private _getAnimationCoordinates(event: Event): { start: AnimationCoordinate; end: AnimationCoordinate } {
		const { scrollX, scrollY } = window;
		const { left, top, width, height } = this._getHostDimensions();
		const documentX = scrollX + left;
		const documentY = scrollY + top;

		let startCoordinate: AnimationCoordinate;
		if (event instanceof PointerEvent && !this._isKeyboardEvent(event)) {
			const { pageX, pageY } = event;
			startCoordinate = { x: pageX - documentX, y: pageY - documentY };
		} else {
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

	private _isKeyboardEvent(event: PointerEvent): boolean {
		return event.detail === 0;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'yt-ripple': RippleComponent;
	}
}
