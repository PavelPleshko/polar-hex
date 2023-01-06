/**
 * Element that hosts {@link Selectable}'s as its children elements.
 * If you are using selectable options - host needs to implement
 * this interface to allow for decoupled communication.
 */
export interface SelectableHost<T> extends HTMLElement {
	activeItem: Selectable<T> | undefined;

	markSelected(item: Selectable<T> | undefined, shouldSelect: boolean): void;
}

/**
 * Elements that are host
 */
export interface Selectable<T = any> extends HTMLElement {
	value: T;
}
