import { ListItemComponent } from '../list-item';

export class ActivateEvent<T extends HTMLElement = ListItemComponent> extends CustomEvent<T> {
	constructor(detail: T, init?: EventInit) {
		super('yt-activate-item', { detail, ...init });
	}
}

export class SelectEvent<T extends HTMLElement = ListItemComponent> extends CustomEvent<T> {
	constructor(detail: T, init?: EventInit) {
		super('yt-select-item', { detail, ...init });
	}
}

declare global {
	interface HTMLElementEventMap {
		'yt-activate-item': ActivateEvent;
		'yt-select-item': SelectEvent;
	}
}
