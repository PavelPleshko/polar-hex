import { customElement, html, LitElement, property } from 'lit-element';
import { TemplateResult } from 'lit';
import { ClassInfo, classMap } from 'lit/directives/class-map.js';
import { CSSResultGroup } from '@lit/reactive-element/css-tag';
import { forwardAttribute } from '@yeti-wc/utils';

@customElement('yt-checkbox')
export class Checkbox extends LitElement {
	@forwardAttribute('id')
	_id = 'checkbox-id-1';

	@forwardAttribute('name')
	_name = 'checkbox-id-1';

	@property({ type: Boolean }) disabled = false;

	protected override render(): TemplateResult {
		return html`<input type="checkbox" .name="${this._name}" .id="${this._id}" ?disabled="${this.disabled}" />
			<slot></slot>`;
	}
}
