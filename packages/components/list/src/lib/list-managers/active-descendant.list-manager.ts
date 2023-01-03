import { ListManager } from './list-manager';
import { ListItemState } from '../types';

export class ActiveDescendantListManager<T extends ListItemState> extends ListManager<T> {
	protected override _markActive(item: T, userAction: boolean): void {
		super._markActive(item, userAction);
		this._elementRef?.setAttribute('aria-activedescendant', item.id);
	}

	protected override _createListeners(): void {
		super._createListeners();
		this._events.addListener(this._elementRef as HTMLElement, 'focus', _ => {
			this.scrollIntoView(this.selectedItem || this.activeItem);
		});
	}
}
