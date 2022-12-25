import { html, LitElement, customElement, TemplateResult, state } from 'lit-element';
import { repeat } from 'lit/directives/repeat.js';
import 'packages/components/list';

export default {
	title: 'List',
};

@customElement('yt-list-box-demo')
class ListBoxDemoComponent extends LitElement {
	@state()
	private _creatures = ['Beholders', 'Harpy', 'Troglodyte', 'Medusa', 'Minotaur'];

	protected render(): TemplateResult {
		return html` <yt-list>
			${repeat(this._creatures, creature => html` <yt-list-item> ${creature} </yt-list-item>`)}
		</yt-list>`;
	}

	protected override createRenderRoot(): Element | ShadowRoot {
		return this;
	}
}

export const InteractiveListBox = (): TemplateResult => {
	return html` <yt-list-box-demo></yt-list-box-demo>`;
};
