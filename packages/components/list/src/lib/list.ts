import { LitElement, customElement, property } from 'lit-element';

@customElement('yt-list')
export class ListComponent extends LitElement {
	@property({ type: String, reflect: true })
	override role = 'listbox';

	protected override createRenderRoot(): Element | ShadowRoot {
		return this;
	}
}
