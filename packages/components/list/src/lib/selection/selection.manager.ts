import { ENTER, EventsService, SPACE } from '@yeti-wc/utils';
import { Selectable, SelectableHost } from './types';
// import {SelectEvent} from "@yeti-wc/list/src/lib/list-managers/events";

const ITEM_SELECTION_KEYS = [SPACE, ENTER];

// TODO move to different file
export class SelectionModel<ValueType> {
	protected _selection = new Set<ValueType>();

	select(...selected: ValueType[]): void {
		selected.forEach(value => this._selection.add(value));
	}

	deselect(...selected: ValueType[]): void {
		selected.forEach(value => this._selection.delete(value));
	}

	isSelected(value: ValueType): boolean {
		return this._selection.has(value);
	}

	clear(): void {
		this._selection.clear();
	}
}

export class SelectionManager<ValueType, SelectableEl extends Selectable<ValueType>, U = ValueType | ValueType[]> {
	protected _events = new EventsService();

	protected _multiple = false;

	protected _elementRef!: SelectableHost<ValueType>;

	protected _selectables: SelectableEl[] = [];

	protected _selection = new SelectionModel<ValueType | void>();

	attach(elementRef: SelectableHost<ValueType>, items: SelectableEl[]): this {
		this._elementRef = elementRef;
		this.updateItems(items);
		this._addListeners();
		return this;
	}

	detach(): void {
		this._events.clearListenersForElement(this._elementRef);
	}

	updateItems(items: SelectableEl[]): void {
		this._clearItemListeners();
		this._selectables = items;
		this._selectables.forEach(item => {
			this._events.addListener(item, 'click', _ => {
				this._selectItem(item);
			});
		});
	}

	withMultipleMode(multiple: boolean): this {
		this._multiple = multiple;
		return this;
	}

	protected _addListeners(): void {
		this._events.addListener(this._elementRef, 'keydown', event => {
			this._handleKeydown(event);
		});
	}

	protected _handleKeydown(event: KeyboardEvent): void {
		const key = event.key;

		if (ITEM_SELECTION_KEYS.includes(key)) {
			this._selectItem(this._elementRef.activeItem as SelectableEl);
			event.preventDefault();
			event.stopPropagation();
		}
	}

	protected _selectItem(item?: SelectableEl): void {
		if (!item || item.getAttribute('disabled')) {
			return;
		}
		const selection = [item];
		if (this._multiple) {
			if (this._isSelected(item)) {
				this._deselectItems(selection);
			} else {
				this._selectItems(selection);
			}
		} else {
			this._selection.clear();
			this._selectItems(selection);
		}
		this._updateSelectedMarkers();
	}

	protected _selectItems(items: SelectableEl[]): void {
		this._selection.select(...items.map(item => item.value));
	}

	protected _deselectItems(items: SelectableEl[]): void {
		this._selection.deselect(...items.map(item => item.value));
	}

	// protected _updateValuesSelection (selected: ValueType[], deselected: ValueType[]): void {
	// 	this._selection.select(...selected);
	// 	this._selection.deselect(...deselected);
	// 	// propagate changes here
	// }

	protected _clearItemListeners(): void {
		this._selectables.forEach(item => this._events.clearListenersForElement(item));
	}

	protected _isSelected(itemOrIndex: SelectableEl | number): boolean {
		const item = typeof itemOrIndex === 'number' ? this._selectables[itemOrIndex] : itemOrIndex;

		return this._selection.isSelected(item.value);
	}

	protected _updateSelectedMarkers(): void {
		this._selectables.forEach(item => {
			this._elementRef.markSelected(item, this._isSelected(item));
		});
	}
}
