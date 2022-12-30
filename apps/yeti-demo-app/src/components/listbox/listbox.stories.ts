import { html, LitElement, customElement, TemplateResult, state, property } from 'lit-element';
import { repeat } from 'lit/directives/repeat.js';
import '@yeti-wc/list';

export default {
	title: 'List',
};

const DUNGEON_CREATURES = ['Beholders', 'Harpy', 'Troglodyte', 'Medusa', 'Minotaur'];
const HEAVEN_CREATURES = ['Knights', 'Archangels', 'Fanatics', 'Shooters'];

@customElement('yt-list-box-demo')
class ListBoxDemoComponent extends LitElement {
	@state()
	private _creatures = DUNGEON_CREATURES;

	@property()
	orientation = 'vertical';

	protected render(): TemplateResult {
		return html` <button type="button" @click="${() => this._switch()}">Switch items</button>
			<yt-list .orientation="${this.orientation}">
				${repeat(
					this._creatures,
					creature => creature,
					creature => html` <yt-list-item> ${creature}</yt-list-item>`
				)}
			</yt-list>`;
	}

	protected override createRenderRoot(): Element | ShadowRoot {
		return this;
	}

	private _switch(): void {
		this._creatures = this._creatures === DUNGEON_CREATURES ? HEAVEN_CREATURES : DUNGEON_CREATURES;
	}
}

export const InteractiveListBox = (): TemplateResult => {
	return html` <yt-list-box-demo></yt-list-box-demo>`;
};

export const OrientationHorizontal = (): TemplateResult => {
	return html` <yt-list-box-demo orientation="horizontal"></yt-list-box-demo>`;
};
