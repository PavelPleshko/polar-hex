import { ENTER, SPACE, HOME, END, EventsService, scrollToTarget } from '@yeti-wc/utils';
import { ListItemState, ListOrientation } from '../types';
import { ActivateEvent, SelectEvent } from './events';
import {
	VERTICAL_NAVIGATION_KEY_TO_DELTA,
	HORIZONTAL_NAVIGATION_KEY_TO_DELTA,
	ListNavigationDelta,
	calculateNextIndex,
} from './key-navigation';

const ITEM_ACTIVATION_KEYS = [SPACE, ENTER];

const isItemInteractive = (item: ListItemState): boolean => !item.disabled;

export abstract class ListManager<T extends ListItemState> {
	protected _navigationKeys = VERTICAL_NAVIGATION_KEY_TO_DELTA;

	protected _wrap = true;

	protected _listItems: T[] = [];

	protected _elementRef?: HTMLElement;

	protected _events = new EventsService();

	activeItem?: T;

	activeItemIndex: number | null = null;

	selectedItem?: T;

	attachToElement(elementRef: HTMLElement, initialItems: T[]): void {
		this._elementRef = elementRef;
		this.updateItems(initialItems);
		// we set first non-disabled item starting from top of the list
		this._setActiveItemByIndex(0, 1);
		this._createListeners();
	}

	withOrientation(orientation: ListOrientation): this {
		this._navigationKeys =
			orientation === 'horizontal' ? HORIZONTAL_NAVIGATION_KEY_TO_DELTA : VERTICAL_NAVIGATION_KEY_TO_DELTA;
		return this;
	}

	withWrap(shouldWrap: boolean): this {
		this._wrap = shouldWrap;
		return this;
	}

	detach(): void {
		this._clearItemListeners();
		if (this._elementRef) {
			this._events.clearListenersForElement(this._elementRef);
		}
	}

	updateItems(items: T[]): void {
		this._clearItemListeners();
		this._listItems = items;
		const prevActive = this.activeItem ? items.indexOf(this.activeItem) : 0;
		this._setActive(prevActive >= 0 ? prevActive : 0);

		this._listItems.forEach(item =>
			this._events.addListener(item, 'click', () => {
				this._selectItem(item);
				this._setActive(item);
			})
		);
	}

	scrollIntoView(item?: T): void {
		if (!this._elementRef || !item) return;
		scrollToTarget(this._elementRef, item);
	}

	protected _setActive(indexOrItem: number | T): void {
		if (this.activeItemIndex === indexOrItem) {
			return;
		}
		const previouslyActive = this.activeItem;
		if (previouslyActive) {
			this._markInactive(previouslyActive);
		}

		const itemIndex = typeof indexOrItem === 'number' ? indexOrItem : this._listItems.indexOf(indexOrItem);
		this.activeItem = this._listItems[itemIndex];
		this.activeItemIndex = itemIndex;

		this._markActive(this.activeItem);

		this.scrollIntoView(this.activeItem);
		this._notifyChanges(new ActivateEvent(this.activeItem));
	}

	protected _markActive(item: T): void {
		item.markActive(true);
	}

	protected _markInactive(item: T): void {
		item.markActive(false);
	}

	protected _createListeners(): void {
		if (!this._elementRef) return;

		this._events.addListener(this._elementRef, 'keydown', event => {
			const key = event.key;

			if (ITEM_ACTIVATION_KEYS.includes(key)) {
				event.preventDefault();
				this._selectItem(this.activeItem);
			} else if (key in this._navigationKeys) {
				event.preventDefault();
				this._navigateByKey(key);
			}
		});
	}

	protected _selectItem(item?: T): void {
		if (!item || !isItemInteractive(item)) {
			return;
		}
		const previousSelected = this.selectedItem;
		// TODO make this attribute a variable since it can be aria-checked given its a menu or multiple selection mode
		previousSelected?.setAttribute('aria-selected', 'false');
		item.setAttribute('aria-selected', 'true');
		this.selectedItem = item;
		this._notifyChanges(new SelectEvent(this.selectedItem));
	}

	protected _clearItemListeners(): void {
		this._listItems.forEach(item => this._events.clearListenersForElement(item));
	}

	protected _navigateByKey(key: string): void {
		const delta = this._navigationKeys[key];
		switch (key) {
			case HOME:
				this._setActiveItemByIndex(0, delta);
				break;
			case END:
				this._setActiveItemByIndex(this._listItems.length - 1, delta);
				break;
			default:
				this._setActiveItemByDelta(delta);
		}
	}

	private _setActiveItemByDelta(delta: ListNavigationDelta): void {
		const desiredIndex = (this.activeItemIndex || 0) + delta;
		const normalizedIndex = calculateNextIndex(desiredIndex, this._listItems.length, this._wrap);
		this._setActiveItemByIndex(normalizedIndex, delta);
	}

	/**
	 * Find the item which can be navigated to and perform navigation.
	 * It traverses the items until the first non-disabled option is
	 * encountered.
	 * @param index - index of desired element that should be set as 'active'.
	 * Acts as a base point from which traversal starts.
	 * @param fallbackDelta - which direction it should traverse in the search
	 * of most adjacent non-disabled item.
	 */
	private _setActiveItemByIndex(index: number, fallbackDelta: ListNavigationDelta): void {
		const items = this._listItems;

		if (!items[index]) {
			return;
		}

		while (!isItemInteractive(items[index])) {
			index += fallbackDelta;

			if (!items[index]) {
				return;
			}
		}
		this._setActive(index);
	}

	private _notifyChanges(event: Event): void {
		if (!this._elementRef) {
			return;
		}
		this._elementRef.dispatchEvent(event);
	}
}
