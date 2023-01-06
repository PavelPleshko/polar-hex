export interface SelectableHost<T> extends HTMLElement {
	isItemActive(item: Selectable<T>): boolean;
}

export interface Selectable<T = any> extends HTMLElement {
	value?: T;
}
