import { ArrayUtil, ENTER, EventsService, SPACE } from '@ph-wc/utils';
import { Selectable, SelectableHost } from './types';
// import {SelectEvent} from "@ph-wc/list/src/lib/list-managers/events";
import { SelectionModel } from './selection.model';
// import {SelectEvent} from "@yeti-wc/list/src/lib/list-managers/events";

const ITEM_SELECTION_KEYS = [SPACE, ENTER];

export class SelectionManager<ValueType, SelectableEl extends Selectable<ValueType>, U = ValueType | ValueType[]> {
	protected _events = new EventsService();

	protected _multiple = false;

	protected _elementRef!: SelectableHost<ValueType>;

	protected _selectables: SelectableEl[] = [];

	protected _selectionModel = new SelectionModel<ValueType | void>();

	protected _selectedIndices: number[] = [];

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
		// TODO move the value from single to multi and vice versa
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
			this._selectionModel.clear();
			this._selectItems(selection);
		}
		this._updateSelectedMarkers();
	}

	protected _selectItems(items: SelectableEl[]): void {
		const indices = ArrayUtil.includedIndices(this._selectables, items);
		this._setSelectedItems(ArrayUtil.mergeSorted(this._selectedIndices, indices));
	}

	protected _deselectItems(items: SelectableEl[]): void {
		const indices = ArrayUtil.includedIndices(this._selectables, items);
		this._setSelectedItems(ArrayUtil.diffSorted(this._selectedIndices, indices));
	}

	protected _setSelectedItems(selectedIndices: number[]): void {
		const valuesFromIndices = (indices: number[]): ValueType[] => {
			return ArrayUtil.indicesToValues(this._selectables, indices, item => item.value);
		};
		const prevIndices = this._selectedIndices;
		this._selectedIndices = selectedIndices;
		this._selectionModel.deselect(...valuesFromIndices(prevIndices));
		this._selectionModel.select(...valuesFromIndices(this._selectedIndices));
	}

	protected _clearItemListeners(): void {
		this._selectables.forEach(item => this._events.clearListenersForElement(item));
	}

	protected _isSelected(itemOrIndex: SelectableEl | number): boolean {
		const item = typeof itemOrIndex === 'number' ? this._selectables[itemOrIndex] : itemOrIndex;

		return this._selectionModel.isSelected(item.value);
	}

	protected _updateSelectedMarkers(): void {
		this._selectables.forEach(item => {
			this._elementRef.markSelected(item, this._isSelected(item));
		});
	}
}
