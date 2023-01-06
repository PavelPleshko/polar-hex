import { ListManager } from './list-manager';
import { ListItemState } from '../types';

export class FocusListManager<T extends ListItemState> extends ListManager<T> {
	protected override _markActive(item: T, userAction: boolean): void {
		super._markActive(item, userAction);
		item.setAttribute('tabindex', '0');
		if (userAction) {
			this._focusItem(item);
		}
	}

	protected override _markInactive(item: T): void {
		super._markInactive(item);
		item.setAttribute('tabindex', '-1');
	}

	protected override _createListeners(): void {
		super._createListeners();
		this._events.addListener(this._elementRef as HTMLElement, 'focus', _ => {
			this._focusItem(this.selectedItem || this.activeItem);
		});
	}

	private _focusItem(item?: T): void {
		item?.focus();
	}
}
