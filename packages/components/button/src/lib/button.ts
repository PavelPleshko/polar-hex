import { LitElement, html, customElement } from 'lit-element';
import { TemplateResult } from 'lit';

@customElement('yt-button')
export class YtButtonElement extends LitElement {
	override render(): TemplateResult {
		return html` <button type="button">Click Me!</button>`;
	}
}
