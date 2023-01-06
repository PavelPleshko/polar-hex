import { LitElement, customElement, property } from 'lit-element';

import { uniqueIdGenerator } from '@yeti-wc/utils';
import { Selectable, SelectableHost } from './selection/types';
import { ListItemComponent, LIST_ITEM_SELECTOR } from './list-item';
import { ListManager } from './list-managers/list-manager';
import { ActiveDescendantListManager } from './list-managers/active-descendant.list-manager';
import { ListOrientation } from './types';
import { FocusListManager } from './list-managers/focus.list-manager';
import { valueMixin } from './input/input';
import { SelectionManager } from './selection/selection.manager';

const getNextId = uniqueIdGenerator('yt-listbox');

const nodesContainListItems = (nodeList: NodeList): boolean => {
	return Array.from(nodeList).some(node => node instanceof ListItemComponent);
};

@customElement('yt-list')
export class ListComponent<T = any | any[]> extends valueMixin(LitElement) implements SelectableHost<T> {
	private _contentObserver = new MutationObserver(mutations => this._onContentChange(mutations));

	private _listManager!: ListManager<ListItemComponent<T>>;

	private _selectionManager!: SelectionManager<T, ListItemComponent<T>>;

	private _wrap = true;

	private _orientation: ListOrientation = 'vertical';

	private _multi = false;

	@property({ type: String, reflect: true })
	override role = 'listbox';

	@property({ type: Boolean, attribute: true })
	set wrap(shouldWrap: boolean) {
		this._wrap = shouldWrap;
		this._listManager?.withWrap(shouldWrap);
	}

	@property({ type: Boolean, attribute: 'aria-disabled', reflect: true })
	disabled = false;

	@property({ type: Number, reflect: true, attribute: 'tabindex' })
	override tabIndex = 0;

	@property({ attribute: 'id', type: String, reflect: true })
	override id = getNextId();

	@property({ attribute: 'aria-orientation', reflect: true, type: String, noAccessor: true })
	set orientation(value: ListOrientation) {
		const prevValue = this._orientation;
		this._orientation = value;
		this._listManager?.withOrientation(value);
		this.requestUpdate('orientation', prevValue);
	}
	get orientation(): ListOrientation {
		return this._orientation;
	}

	@property({ attribute: 'aria-multiselectable', reflect: true, type: Boolean, noAccessor: true })
	set multi(isMulti: boolean) {
		const prevValue = this._multi;
		this._multi = isMulti;
		this._selectionManager?.withMultipleMode(isMulti);
		this.requestUpdate('multi', prevValue);
	}
	get multi(): boolean {
		return this._multi;
	}

	@property({ type: Boolean })
	useActiveDescendant = false;

	get activeItem(): ListItemComponent<T> | undefined {
		return this._listManager?.activeItem;
	}

	override connectedCallback(): void {
		super.connectedCallback();
		this._attachEventListeners();
	}

	override disconnectedCallback(): void {
		super.disconnectedCallback();
		this._contentObserver.disconnect();
		this._listManager.detach();
		this._selectionManager.detach();
	}

	markSelected(item: Selectable<T> | undefined, shouldSelect: boolean): void {
		const selectedAttribute = this.multi ? 'aria-checked' : 'aria-selected';
		item?.setAttribute(selectedAttribute, `${shouldSelect}`);
	}

	protected override createRenderRoot(): Element | ShadowRoot {
		return this;
	}

	// TODO refactor long method
	private _attachEventListeners(): void {
		this._contentObserver.observe(this, { childList: true, attributes: false });
		const listManager = this.useActiveDescendant
			? new ActiveDescendantListManager<ListItemComponent<T>>()
			: new FocusListManager<ListItemComponent<T>>();
		this._listManager = listManager.withWrap(this._wrap).withOrientation(this.orientation);
		const items = this._queryItems();
		this._listManager.attachToElement(this, items);
		this._selectionManager = new SelectionManager<T, ListItemComponent<T>>()
			.withMultipleMode(this.multi)
			.attach(this, items);
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
			this._updateItems();
		}
	}

	private _updateItems(): void {
		const items = this._queryItems();
		this._listManager.updateItems(items);
		this._selectionManager.updateItems(items);
	}

	private _queryItems(): ListItemComponent<T>[] {
		return Array.from(this.renderRoot.querySelectorAll(LIST_ITEM_SELECTOR));
	}
}
