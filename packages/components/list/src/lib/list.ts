import { LitElement, customElement, property, state } from 'lit-element';

import { uniqueIdGenerator } from '@yeti-wc/utils';
import { ListItemComponent, LIST_ITEM_SELECTOR } from './list-item';
import { ListManager } from './list-managers/list-manager';
import { ActiveDescendantListManager } from './list-managers/active-descendant.list-manager';

const getNextId = uniqueIdGenerator('yt-listbox');

const nodesContainListItems = (nodeList: NodeList): boolean => {
	return Array.from(nodeList).some(node => node instanceof ListItemComponent);
};

@customElement('yt-list')
export class ListComponent extends LitElement {
	private _contentObserver = new MutationObserver(mutations => this._onContentChange(mutations));

	private _listManager!: ListManager<ListItemComponent>;

	private _listItems: ListItemComponent[] = [];

	@state()
	private _selectedItem: ListItemComponent | null = null;

	@property({ type: String, reflect: true })
	override role = 'listbox';

	@property({ type: Boolean, attribute: 'aria-disabled', reflect: true })
	disabled = false;

	@property({ type: Number, reflect: true, attribute: 'tabindex' })
	override tabIndex = 0;

	@property({ attribute: 'id', type: String, reflect: true })
	override id = getNextId();

	@property({ attribute: 'aria-activedescendant', reflect: true, state: true })
	activeDescendant: string | null = null;

	override connectedCallback(): void {
		super.connectedCallback();
		this._attachEventListeners();
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback();
		this._contentObserver.disconnect();
	}

	protected override createRenderRoot(): Element | ShadowRoot {
		return this;
	}

	private _attachEventListeners(): void {
		this._contentObserver.observe(this, { childList: true, attributes: false });
		this._listManager = new ActiveDescendantListManager();
		this._listItems = this._queryItems();
		this._listManager.attachToElement(this, this._listItems);
	}

	/**
	 * This handler needs to launch re-querying of the child list item elements
	 * only if something has changed: there are list-item nodes added or removed.
	 */
	private _onContentChange(mutationRecords: MutationRecord[]): void {
		const hasChanged = mutationRecords.some(({ addedNodes, removedNodes }) => {
			return nodesContainListItems(addedNodes) || nodesContainListItems(removedNodes);
		});

		if (hasChanged) {
			this._listItems = this._queryItems();
			this._updateItems();
		}
	}

	private _updateItems(): void {
		this._listManager.updateItems(this._listItems);
	}

	private _queryItems(): ListItemComponent[] {
		return Array.from(this.renderRoot.querySelectorAll(LIST_ITEM_SELECTOR));
	}
}
