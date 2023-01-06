import { html, LitElement, customElement, TemplateResult, property } from 'lit-element';
import { repeat } from 'lit/directives/repeat.js';
import '@yeti-wc/list';

export default {
	title: 'Components/Listbox',
};

const DUNGEON_CREATURES = ['Beholders', 'Harpy', 'Troglodyte', 'Medusa', 'Minotaur'];

@customElement('yt-list-box-demo')
class ListBoxDemoComponent extends LitElement {
	@property()
	orientation = 'vertical';

	@property()
	disabledIndexes = [];

	@property({ attribute: true })
	wrap = true;

	@property({ attribute: true })
	multi = false;

	protected render(): TemplateResult {
		return html` <yt-list .wrap="${this.wrap}" .multi="${this.multi}" .orientation="${this.orientation}">
			${repeat(
				DUNGEON_CREATURES,
				creature => creature,
				(creature, i) =>
					html` <yt-list-item .disabled="${this.disabledIndexes.includes(i)}"> ${creature}</yt-list-item>`
			)}
		</yt-list>`;
	}

	protected override createRenderRoot(): Element | ShadowRoot {
		return this;
	}
}

export const Default = (): TemplateResult => {
	return html` <yt-list-box-demo></yt-list-box-demo>`;
};

export const OrientationHorizontal = (): TemplateResult => {
	return html` <yt-list-box-demo orientation="horizontal"></yt-list-box-demo>`;
};

export const DisabledOptions = (): TemplateResult => {
	return html` <yt-list-box-demo .disabledIndexes="${[0, 2]}"></yt-list-box-demo>`;
};

export const Wrap = (): TemplateResult => {
	return html` <yt-list-box-demo .wrap="${false}"></yt-list-box-demo>`;
};

export const MultiSelection = (): TemplateResult => {
	return html` <yt-list-box-demo .multi="${true}"></yt-list-box-demo>`;
};
