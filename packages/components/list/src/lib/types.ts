export interface Activatable {
	active: boolean;
	markActive(active: boolean): void;
}

export interface ListItemState extends Activatable, HTMLElement {
	disabled?: boolean;
}
