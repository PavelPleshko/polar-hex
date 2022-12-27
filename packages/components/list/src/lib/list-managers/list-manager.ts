import { ENTER, SPACE } from '@yeti-wc/utils';
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

export abstract class ListManager<T extends ListItemState> {
	protected _listItems: T[] = [];

	protected _elementRef?: HTMLElement;

	protected _events = new Events();

	activeItem?: T;

	selectedItem?: T;

	attachToElement(elementRef: HTMLElement, initialItems: T[]): void {
		this._elementRef = elementRef;
		this.updateItems(initialItems);
		this._setActive(0);
		this._createListeners();
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
		previouslyActive?.markActive(false);
	}

	protected _createListeners(): void {
		if (!this._elementRef) return;

		this._events.addListener(this._elementRef, 'keydown', event => {
			if (ITEM_ACTIVATION_KEYS.includes(event.key)) {
				this._selectItem(this.activeItem);
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
}
