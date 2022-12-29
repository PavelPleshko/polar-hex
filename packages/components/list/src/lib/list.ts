import { LitElement, customElement, property, state } from 'lit-element';
import { PropertyValues } from 'lit';

import { uniqueIdGenerator } from '@yeti-wc/utils';
import { ListItemComponent, LIST_ITEM_SELECTOR } from './list-item';
import { ListManager } from './list-managers/list-manager';
import { ActiveDescendantListManager } from './list-managers/active-descendant.list-manager';
import { ListOrientation } from './types';

const getNextId = uniqueIdGenerator('yt-listbox');

const nodesContainListItems = (nodeList: NodeList): boolean => {
	return Array.from(nodeList).some(node => node instanceof ListItemComponent);
};

@customElement('yt-list')
export class ListComponent extends LitElement {
	private _activeElement: ListItemComponent | null = null;

	private _selectedElement: ListItemComponent | null = null;

	private _contentObserver = new MutationObserver(mutations => this._onContentChange(mutations));

	private _listManager!: ListManager<ListItemComponent>;

	private _listItems: ListItemComponent[] = [];

	@state()
	set activeElement(val: ListItemComponent) {
		this._activeElement = val;
		this.requestUpdate('activeDescendant');
	}

	@property({ type: String, reflect: true })
	override role = 'listbox';

	@property({ type: Boolean, attribute: 'aria-disabled', reflect: true })
	disabled = false;

	@property({ type: Number, reflect: true, attribute: 'tabindex' })
	override tabIndex = 0;

	@property({ attribute: 'id', type: String, reflect: true })
	override id = getNextId();

	@property({ attribute: 'aria-activedescendant', reflect: true, noAccessor: true })
	get activeDescendant(): string | null {
		return this._activeElement?.id || null;
	}

	// TODO create orientation type and move to some file
	@property({ attribute: 'aria-orientation', reflect: true, type: String })
	orientation: ListOrientation = 'vertical';

	override connectedCallback(): void {
		super.connectedCallback();
		this._attachEventListeners();
		this._listManager.withOrientation(this.orientation);
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback();
		this._contentObserver.disconnect();
		this._listManager.detach();
	}

	protected override updated(_changedProperties: PropertyValues<ListComponent>): void {
		super.updated(_changedProperties);
		const orientation = _changedProperties.get('orientation');
		if (orientation) {
			this._listManager.withOrientation(orientation);
		}
	}

	protected override createRenderRoot(): Element | ShadowRoot {
		return this;
	}

	private _attachEventListeners(): void {
		this._contentObserver.observe(this, { childList: true, attributes: false });
		this.addEventListener('yt-activate-item', event => {
			this.activeElement = event.detail;
		});
		this.addEventListener('yt-select-item', event => {
			this._selectedElement = event.detail;
		});
		this.addEventListener('focus', _ =>
			this._listManager.scrollIntoView(this._selectedElement || this.activeElement)
		);
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
