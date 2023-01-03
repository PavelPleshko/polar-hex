import { ListManager } from './list-manager';
import { ListItemState } from '../types';

export class FocusListManager<T extends ListItemState> extends ListManager<T> {
	protected override _setActive(indexOrItem: number | T): void {
		super._setActive(indexOrItem);
	}
}
