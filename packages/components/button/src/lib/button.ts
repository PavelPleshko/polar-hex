import { customElement, html, LitElement, property } from 'lit-element';
import { TemplateResult } from 'lit';
import { ClassInfo, classMap } from 'lit/directives/class-map.js';
import { CSSResultGroup } from '@lit/reactive-element/css-tag';

import { ButtonVariant } from './config/button.variant';
import { ButtonState } from './config/button.state';

// @ts-expect-error: figure out the way to avoid errors for scss imports
import style from './styles/button.scss';
import { ButtonSize } from './config/button.size';
import { ButtonColor } from './config/button.color';
import { ButtonShape } from './config/button.shape';

const BASE_BTN_CLASS = 'yt-button';

@customElement('yt-button')
export class YtButtonElement extends LitElement implements ButtonState {
	static override shadowRootOptions: ShadowRootInit = { mode: 'open', delegatesFocus: true };

	static override get styles(): CSSResultGroup {
		return [style];
	}

	@property({ attribute: 'type' }) type = 'button';

	@property() variant = ButtonVariant.raised;

	@property() size = ButtonSize.default;

	@property() color: ButtonColor | null = null;

	@property() shape = ButtonShape.normal;

	@property({ attribute: 'disabled' }) disabled = false;

	protected override render(): TemplateResult {
		return html` <button
			type="${this.type}"
			?disabled=${this.disabled}
			class="${classMap(this._getRuntimeClasses())}">
			<slot></slot>
		</button>`;
	}

	protected _getRuntimeClasses(): ClassInfo {
		return {
			// TODO optimize classes assignment
			[BASE_BTN_CLASS]: true,
			[`${BASE_BTN_CLASS}--variant--raised`]: this.variant === ButtonVariant.raised,
			[`${BASE_BTN_CLASS}--variant--outlined`]: this.variant === ButtonVariant.outlined,
			[`${BASE_BTN_CLASS}--variant--text`]: this.variant === ButtonVariant.text,
			[`${BASE_BTN_CLASS}--size--small`]: this.size === ButtonSize.small,
			[`${BASE_BTN_CLASS}--size--large`]: this.size === ButtonSize.large,
			[`${BASE_BTN_CLASS}--color--success`]: this.color === ButtonColor.success,
			[`${BASE_BTN_CLASS}--color--info`]: this.color === ButtonColor.info,
			[`${BASE_BTN_CLASS}--color--error`]: this.color === ButtonColor.error,
			[`${BASE_BTN_CLASS}--color--warning`]: this.color === ButtonColor.warning,
			[`${BASE_BTN_CLASS}--shape--round`]: this.shape === ButtonShape.round,
		};
	}
}
