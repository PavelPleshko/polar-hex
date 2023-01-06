import { HasValue } from './types';

export class ValueChangeEvent<
	ValueType = unknown,
	T extends HasValue<ValueType> = HasValue<ValueType>
> extends CustomEvent<ValueType> {
	constructor(detail: ValueType, init?: EventInit) {
		super('yt-value-changed', { detail, ...init });
	}
}

/**
 * Add the value change event to the global HTMLElementEventMap.
 */
declare global {
	interface HTMLElementEventMap {
		'ui-value-changed': ValueChangeEvent;
	}
}
