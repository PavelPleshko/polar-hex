import { customElement, html, LitElement, property, queryAsync } from 'lit-element';
import { TemplateResult } from 'lit';
import { ClassInfo, classMap } from 'lit/directives/class-map.js';

import { ripple, RIPPLE_TAG_NAME, RippleComponent } from '@yeti-wc/ripple';

import { ButtonVariant } from './config/button.variant';
import { ButtonState } from './config/button.state';
import { ButtonSize } from './config/button.size';
import { ButtonColor } from './config/button.color';
import { ButtonShape } from './config/button.shape';

const BASE_BTN_CLASS = 'yt-button';

@customElement('yt-button')
export class YtButtonElement extends LitElement implements ButtonState {
	@queryAsync(RIPPLE_TAG_NAME) private _rippleElement!: Promise<RippleComponent | null>;

	@property() type = 'button';

	@property() variant = ButtonVariant.raised;

	@property() size = ButtonSize.default;

	@property() color: ButtonColor | null = null;

	@property() shape = ButtonShape.normal;

	@property({ type: Boolean, reflect: true }) disabled = false;

	@property()
	label: TemplateResult | string = '';

	protected override render(): TemplateResult {
		return html` <button
			type="${this.type}"
			?disabled=${this.disabled}
			class="${classMap(this._getRuntimeClasses())}"
			${ripple(this._rippleElement)}>
			<yt-ripple></yt-ripple>
			${this.label}
		</button>`;
	}

	protected override createRenderRoot(): Element | ShadowRoot {
		return this;
	}

	protected _getRuntimeClasses(): ClassInfo {
		return {
			[BASE_BTN_CLASS]: true,
			[`${BASE_BTN_CLASS}--variant--raised`]: this.variant === ButtonVariant.raised,
			[`${BASE_BTN_CLASS}--variant--outlined`]: this.variant === ButtonVariant.outlined,
			[`${BASE_BTN_CLASS}--variant--text`]: this.variant === ButtonVariant.text,
			[`${BASE_BTN_CLASS}--size--small`]: this.size === ButtonSize.small,
			[`${BASE_BTN_CLASS}--size--large`]: this.size === ButtonSize.large,
			[`${BASE_BTN_CLASS}--color--${this.color}`]: !!this.color,
			[`${BASE_BTN_CLASS}--shape--round`]: this.shape === ButtonShape.round,
		};
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'yt-button': YtButtonElement;
	}
}
