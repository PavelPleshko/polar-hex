import { customElement, html, LitElement, property } from 'lit-element';
import { TemplateResult } from 'lit';
import { ClassInfo, classMap } from 'lit/directives/class-map.js';

import { ButtonVariant } from './config/button.variant';
import { ButtonState } from './config/button.state';
// import styles from './styles/button.scss';

const BASE_BTN_CLASS = 'yt-button';

@customElement('yt-button')
export class YtButtonElement extends LitElement implements ButtonState {
	static override shadowRootOptions: ShadowRootInit = { mode: 'open', delegatesFocus: true };

	@property({ attribute: 'type' }) type = 'button';

	@property() variant = ButtonVariant.raised;

	@property({ attribute: 'disabled' }) disabled = false;

	protected override render(): TemplateResult {
		return html` <button
			type="${this.type}"
			.disabled="${this.disabled}"
			class="${classMap(this._getRuntimeClasses())}">
			<slot></slot>
		</button>`;
	}

	protected _getRuntimeClasses(): ClassInfo {
		return {
			[BASE_BTN_CLASS]: true,
			[`${BASE_BTN_CLASS}--raised`]: this.variant === ButtonVariant.raised,
			[`${BASE_BTN_CLASS}--outlined`]: this.variant === ButtonVariant.outlined,
			[`${BASE_BTN_CLASS}--text`]: this.variant === ButtonVariant.text,
		};
	}
}
