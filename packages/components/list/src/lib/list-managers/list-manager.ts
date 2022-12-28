import { ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP, ENTER, SPACE } from '@yeti-wc/utils';
import { ListItemState } from '../types';

// TODO move to utils
export class Events<E extends keyof HTMLElementEventMap> {
	private _cbs = new Map<HTMLElement, [E, (event: HTMLElementEventMap[E]) => void][]>();

	addListener<Event extends E>(
		element: HTMLElement,
		eventName: Event,
		cb: (ev: HTMLElementEventMap[Event]) => void
	): void {
		let callbacksForElement = this._cbs.get(element);
		if (!callbacksForElement) {
			callbacksForElement = [];
		}
		callbacksForElement.push([eventName, cb]);
		element.addEventListener(eventName, cb);
	}

	clearListenersForElement(element: HTMLElement): void {
		const callbacksForElement = this._cbs.get(element);
		callbacksForElement?.forEach(([eventName, cb]) => {
			element.removeEventListener(eventName, cb);
		});
	}
}

const ITEM_ACTIVATION_KEYS = [SPACE, ENTER];

const VERTICAL_NAVIGATION_KEY_TO_STEP: Record<string, 1 | -1> = {
	[ARROW_UP]: -1,
	[ARROW_DOWN]: 1,
};

const HORIZONTAL_NAVIGATION_KEY_TO_STEP: Record<string, 1 | -1> = {
	[ARROW_LEFT]: -1,
	[ARROW_RIGHT]: 1,
};

export abstract class ListManager<T extends ListItemState> {
	protected _navigationKeys = VERTICAL_NAVIGATION_KEY_TO_STEP;

	protected _listItems: T[] = [];

	protected _elementRef?: HTMLElement;

	protected _events = new Events();

	activeItem?: T;

	activeItemIndex: number | null = null;

	selectedItem?: T;

	attachToElement(elementRef: HTMLElement, initialItems: T[]): void {
		this._elementRef = elementRef;
		this.updateItems(initialItems);
		this._setActive(0);
		this._createListeners();
	}

	withOrientation(orientation: 'vertical' | 'horizontal'): this {
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
			})
		);
	}

	protected _setActive(indexOrItem: number): void {
		const previouslyActive = this.activeItem;
		this.activeItem = this._listItems[indexOrItem];
		this.activeItem.markActive(true);
		this.activeItemIndex = indexOrItem;
		previouslyActive?.markActive(false);
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
		}
	}

	protected _clearItemListeners(): void {
		this._listItems.forEach(item => this._events.clearListenersForElement(item));
	}

	protected _navigateByKey(key: string): void {
		const delta = this._navigationKeys[key];
		this._setActiveItemByDelta(delta);
	}

	private _setActiveItemByDelta(delta: 1 | -1): void {
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
	private _setActiveItemByIndex(index: number, fallbackDelta: -1 | 1): void {
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
}
