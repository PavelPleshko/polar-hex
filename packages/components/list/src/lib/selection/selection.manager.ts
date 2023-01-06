import { ENTER, EventsService, SPACE } from '@yeti-wc/utils';
import { Selectable, SelectableHost } from './types';
// import {SelectEvent} from "@yeti-wc/list/src/lib/list-managers/events";

const ITEM_SELECTION_KEYS = [SPACE, ENTER];

export class SelectionManager<T, V extends Selectable<T>> {
	protected _events = new EventsService();

	protected _elementRef!: SelectableHost<T>;

	protected _selectedItem?: V;

	protected _selectables: V[] = [];

	protected _selection?: T;

	attach(elementRef: SelectableHost<T>, items: V[]): this {
		this._elementRef = elementRef;
		this.updateItems(items);
		this._addListeners();
		return this;
	}

	detach(): void {
		this._events.clearListenersForElement(this._elementRef);
	}

	updateItems(items: V[]): void {
		this._clearItemListeners();
		this._selectables = items;
		this._selectables.forEach(item => {
			this._events.addListener(item, 'click', _ => {
				this._selectItem(item);
			});
		});
	}

	protected _addListeners(): void {
		this._events.addListener(this._elementRef, 'keydown', event => {
			this._handleKeydown(event);
		});
	}

	protected _handleKeydown(event: KeyboardEvent): void {
		const key = event.key;

		if (ITEM_SELECTION_KEYS.includes(key)) {
			this._selectItem(this._findActiveSelectable());
			event.preventDefault();
			event.stopPropagation();
		}
	}

	protected _selectItem(item?: V): void {
		if (!item || item.getAttribute('disabled')) {
			return;
		}
		const previousSelected = this._selectedItem;
		// TODO make this attribute a variable since it can be aria-checked given its a menu or multiple selection mode
		previousSelected?.setAttribute('aria-selected', 'false');
		item.setAttribute('aria-selected', 'true');
		this._selectedItem = item;
		// this._notifyChanges(new SelectEvent(this.selectedItem));
	}

	protected _clearItemListeners(): void {
		this._selectables.forEach(item => this._events.clearListenersForElement(item));
	}

	protected _findActiveSelectable(): V | undefined {
		return this._selectables.find(item => this._elementRef.isItemActive(item));
	}
}
