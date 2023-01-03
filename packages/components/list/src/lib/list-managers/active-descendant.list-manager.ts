import { ListManager } from './list-manager';
import { ListItemState } from '../types';

export class ActiveDescendantListManager<T extends ListItemState> extends ListManager<T> {
	protected override _markActive(item: T): void {
		super._markActive(item);
		this._elementRef?.setAttribute('aria-activedescendant', item.id);
	}
}
