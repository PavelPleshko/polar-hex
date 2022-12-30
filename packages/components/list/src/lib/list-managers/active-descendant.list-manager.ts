import { ListManager } from './list-manager';
import { ListItemState } from '../types';

export class ActiveDescendantListManager<T extends ListItemState> extends ListManager<T> {}
