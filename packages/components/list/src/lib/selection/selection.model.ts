export class SelectionModel<ValueType> {
	protected _selection = new Set<ValueType>();

	select(...selected: ValueType[]): void {
		selected.forEach(value => this._selection.add(value));
	}

	deselect(...selected: ValueType[]): void {
		selected.forEach(value => this._selection.delete(value));
	}

	isSelected(value: ValueType): boolean {
		return this._selection.has(value);
	}

	clear(): void {
		this._selection.clear();
	}
}
