export type Constructor<T> = new (...args: any[]) => T;

export interface HasValue<V> {
	value?: V;
}
