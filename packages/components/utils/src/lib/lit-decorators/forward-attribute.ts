import { ReactiveElement } from 'lit/development';

const internalPropMapRef = Symbol();

export function forwardAttribute<C extends ReactiveElement, P extends string>(externalPropName: string) {
	return (clazz: C, prop: P): any => {
		function getPropMap(_this: ReactiveElement): Record<string, unknown> {
			let propMap = (_this as any)[internalPropMapRef];
			if (!propMap) {
				const newMap = {};
				(_this as any)[internalPropMapRef] = newMap;
				propMap = newMap;
			}
			return propMap;
		}

		const constructor = clazz.constructor as typeof ReactiveElement;
		Object.defineProperty(clazz, prop, {
			configurable: true,
			enumerable: true,
			get(this: ReactiveElement) {
				return getPropMap(this)[prop] ?? '';
			},
			set(this: ReactiveElement, value: unknown) {
				const externalPresent = this.getAttribute(externalPropName);
				if (externalPresent) {
					this.removeAttribute(externalPropName);
					value = externalPresent;
				}

				const strValue = String(value ?? '');
				const propMap = getPropMap(this);
				if (strValue) {
					propMap[prop] = strValue;
				} else {
					delete propMap[prop];
				}
				this.requestUpdate();
			},
		});

		constructor.createProperty(prop, {
			attribute: externalPropName,
			noAccessor: true,
		});
	};
}
