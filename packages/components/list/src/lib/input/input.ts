import { LitElement, property } from 'lit-element';

import { HasValue, Constructor } from './types';
import { ValueChangeEvent } from './events';

export const valueMixin = <ValueType = unknown, T extends Constructor<LitElement> = Constructor<LitElement>>(
	Base: T
): T & Constructor<HasValue<ValueType>> => {
	class HasValueImplementation extends Base implements HasValue<ValueType> {
		protected _value?: ValueType;

		@property({ attribute: false })
		set value(value: ValueType | undefined) {
			if (value !== this._value) {
				const prevValue = this.value;
				this._value = value;
				this.requestUpdate('value', prevValue);
			}
		}

		get value(): ValueType | undefined {
			return this._value;
		}

		protected _propagateValueChange(): void {
			this.dispatchEvent(new ValueChangeEvent(this.value));
		}
	}

	return HasValueImplementation;
};
