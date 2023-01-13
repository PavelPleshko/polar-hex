import { HOME, END, EventsService, scrollToTarget } from '@ph-wc/utils';

import { ListItemState, ListOrientation } from '../types';
import { ActivateEvent } from './events';
import {
	VERTICAL_NAVIGATION_KEY_TO_DELTA,
	HORIZONTAL_NAVIGATION_KEY_TO_DELTA,
	ListNavigationDelta,
	calculateNextIndex,
	getCorrectedNextIndex,
	OUT_OF_BOUND_INDEX,
} from './key-navigation';

const FIRST_ITEM_INDEX = 0;

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
		this._setActiveItemByIndex(FIRST_ITEM_INDEX, 1, false);
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
		this._setActive(prevActive >= 0 ? prevActive : 0, false);

		this._listItems.forEach(item =>
			this._events.addListener(item, 'click', () => {
				this._setActive(item);
			})
		);
	}

	scrollIntoView(item?: T): void {
		if (!this._elementRef || !item) return;
		scrollToTarget(this._elementRef, item);
	}

	protected _setActive(indexOrItem: number | T, userAction = true): void {
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

		this._markActive(this.activeItem, userAction);

		this.scrollIntoView(this.activeItem);
		this._notifyChanges(new ActivateEvent(this.activeItem));
	}

	protected _markActive(item: T, _userAction: boolean): void {
		item.markActive(true);
	}

	protected _markInactive(item: T): void {
		item.markActive(false);
	}

	protected _createListeners(): void {
		if (!this._elementRef) return;

		this._events.addListener(this._elementRef, 'keydown', event => {
			const key = event.key;

			if (key in this._navigationKeys) {
				event.preventDefault();
				this._navigateByKey(key);
			}
		});
	}

	protected _clearItemListeners(): void {
		this._listItems.forEach(item => this._events.clearListenersForElement(item));
	}

	protected _navigateByKey(key: string): void {
		const delta = this._navigationKeys[key];
		switch (key) {
			case HOME:
				this._setActiveItemByIndex(FIRST_ITEM_INDEX, delta, true);
				break;
			case END: {
				const lastElementIndex = this._listItems.length - 1;
				this._setActiveItemByIndex(lastElementIndex, delta, true);
				break;
			}
			default:
				this._setActiveItemByDelta(delta);
		}
	}

	private _setActiveItemByDelta(delta: ListNavigationDelta): void {
		const desiredIndex = (this.activeItemIndex || 0) + delta;
		const normalizedIndex = calculateNextIndex(desiredIndex, this._listItems.length, this._wrap);
		this._setActiveItemByIndex(normalizedIndex, delta, true);
	}

	private _setActiveItemByIndex(desiredIndex: number, fallbackStep: ListNavigationDelta, userAction: boolean): void {
		const correctedIndex = getCorrectedNextIndex({
			items: this._listItems,
			desiredIndex,
			fallbackStep,
			skipPredicate: item => !isItemInteractive(item),
		});
		if (correctedIndex !== OUT_OF_BOUND_INDEX) {
			this._setActive(correctedIndex, userAction);
		}
	}

	private _notifyChanges(event: Event): void {
		if (!this._elementRef) {
			return;
		}
		this._elementRef.dispatchEvent(event);
	}
}
