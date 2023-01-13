import { ListItemComponent } from '../list-item';

export class ActivateEvent<T extends HTMLElement = ListItemComponent> extends CustomEvent<T> {
	constructor(detail: T, init?: EventInit) {
		super('ph-activate-item', { detail, ...init });
	}
}

export class SelectEvent<T extends HTMLElement = ListItemComponent> extends CustomEvent<T> {
	constructor(detail: T, init?: EventInit) {
		super('ph-select-item', { detail, ...init });
	}
}

declare global {
	interface HTMLElementEventMap {
		'ph-activate-item': ActivateEvent;
		'ph-select-item': SelectEvent;
	}
}
