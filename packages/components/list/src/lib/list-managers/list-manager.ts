import { ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP, ENTER, SPACE, EventsService } from '@yeti-wc/utils';
import { ListItemState, ListOrientation } from '../types';
import { ActivateEvent, SelectEvent } from './events';

const ITEM_ACTIVATION_KEYS = [SPACE, ENTER];

type ListNavigationDelta = -1 | 1;

const VERTICAL_NAVIGATION_KEY_TO_STEP: Record<string, ListNavigationDelta> = {
	[ARROW_UP]: -1,
	[ARROW_DOWN]: 1,
};

const HORIZONTAL_NAVIGATION_KEY_TO_STEP: Record<string, ListNavigationDelta> = {
	[ARROW_LEFT]: -1,
	[ARROW_RIGHT]: 1,
};

export abstract class ListManager<T extends ListItemState> {
	protected _navigationKeys = VERTICAL_NAVIGATION_KEY_TO_STEP;

	protected _listItems: T[] = [];

	protected _elementRef?: HTMLElement;

	protected _events = new EventsService();

	activeItem?: T;

	activeItemIndex: number | null = null;

	selectedItem?: T;

	attachToElement(elementRef: HTMLElement, initialItems: T[]): void {
		this._elementRef = elementRef;
		this.updateItems(initialItems);
		this._setActive(0);
		this._createListeners();
	}

	withOrientation(orientation: ListOrientation): this {
		if (orientation === 'horizontal') {
			this._navigationKeys = HORIZONTAL_NAVIGATION_KEY_TO_STEP;
		}
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
		this._listItems.forEach(item =>
			this._events.addListener(item, 'click', () => {
				this._selectItem(item);
				this._setActive(item);
			})
		);
	}

	protected _setActive(indexOrItem: number | T): void {
		const previouslyActive = this.activeItem;
		const itemIndex = typeof indexOrItem === 'number' ? indexOrItem : this._listItems.indexOf(indexOrItem);
		this.activeItem = this._listItems[itemIndex];
		this.activeItem.markActive(true);
		this.activeItemIndex = itemIndex;
		previouslyActive?.markActive(false);
		this._notifyChanges(new ActivateEvent(this.activeItem));
	}

	protected _createListeners(): void {
		if (!this._elementRef) return;

		this._events.addListener(this._elementRef, 'keydown', event => {
			const key = event.key;
			let cancelEvent = false;

			if (ITEM_ACTIVATION_KEYS.includes(key)) {
				cancelEvent = true;
				this._selectItem(this.activeItem);
			} else if (key in this._navigationKeys) {
				cancelEvent = true;
				this._navigateByKey(key);
			}

			if (cancelEvent) {
				event.preventDefault();
			}
		});
	}

	protected _selectItem(item?: T): void {
		if (item && !item.disabled) {
			const previousSelected = this.selectedItem;
			previousSelected?.setAttribute('aria-selected', 'false');
			item.setAttribute('aria-selected', 'true');
			this.selectedItem = item;
			this._notifyChanges(new SelectEvent(this.selectedItem));
		}
	}

	protected _clearItemListeners(): void {
		this._listItems.forEach(item => this._events.clearListenersForElement(item));
	}

	protected _navigateByKey(key: string): void {
		const delta = this._navigationKeys[key];
		this._setActiveItemByDelta(delta);
	}

	private _setActiveItemByDelta(delta: ListNavigationDelta): void {
		const nextIndex = (this.activeItemIndex || 0) + delta;
		const totalLength = this._listItems.length;
		const nextActiveIndex = nextIndex >= 0 ? nextIndex % totalLength : totalLength - 1;
		this._setActiveItemByIndex(nextActiveIndex, delta);
	}

	/**
	 * Find the item which can be navigated to and perform navigation.
	 * It traverses the items until the first non-disabled option is
	 * encountered.
	 */
	private _setActiveItemByIndex(index: number, fallbackDelta: ListNavigationDelta): void {
		const items = this._listItems;

		if (!items[index]) {
			return;
		}

		while (items[index].disabled) {
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
