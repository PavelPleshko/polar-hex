import { html, LitElement, customElement, TemplateResult, property } from 'lit-element';
import { repeat } from 'lit/directives/repeat.js';
import '@ph-wc/list';

export default {
	title: 'Components/Listbox',
};

const DUNGEON_CREATURES = ['Beholders', 'Harpy', 'Troglodyte', 'Medusa', 'Minotaur'];

@customElement('ph-list-box-demo')
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
		return html` <ph-list .wrap="${this.wrap}" .multi="${this.multi}" .orientation="${this.orientation}">
			${repeat(
				DUNGEON_CREATURES,
				creature => creature,
				(creature, i) =>
					html` <ph-list-item .disabled="${this.disabledIndexes.includes(i)}"> ${creature}</ph-list-item>`
			)}
		</ph-list>`;
	}

	protected override createRenderRoot(): Element | ShadowRoot {
		return this;
	}
}

export const Default = (): TemplateResult => {
	return html` <ph-list-box-demo></ph-list-box-demo>`;
};

export const OrientationHorizontal = (): TemplateResult => {
	return html` <ph-list-box-demo orientation="horizontal"></ph-list-box-demo>`;
};

export const DisabledOptions = (): TemplateResult => {
	return html` <ph-list-box-demo .disabledIndexes="${[0, 2]}"></ph-list-box-demo>`;
};

export const Wrap = (): TemplateResult => {
	return html` <ph-list-box-demo .wrap="${false}"></ph-list-box-demo>`;
};

export const MultiSelection = (): TemplateResult => {
	return html` <ph-list-box-demo .multi="${true}"></ph-list-box-demo>`;
};
