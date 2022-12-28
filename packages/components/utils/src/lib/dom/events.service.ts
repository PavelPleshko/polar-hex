type EventName = keyof HTMLElementEventMap;
type EventCallbackFn<E extends EventName> = (e: HTMLElementEventMap[E]) => void;

export class EventsService {
	private _cbs = new Map<HTMLElement, [EventName, EventCallbackFn<EventName>][]>();

	addListener<E extends EventName>(element: HTMLElement, eventName: E, cb: EventCallbackFn<E>): void {
		let callbacksForElement = this._cbs.get(element);
		if (!callbacksForElement) {
			callbacksForElement = [];
		}
		callbacksForElement.push([eventName, cb as EventCallbackFn<EventName>]);
		element.addEventListener(eventName, cb);
	}

	clearListenersForElement(element: HTMLElement): void {
		const callbacksForElement = this._cbs.get(element);
		callbacksForElement?.forEach(([eventName, cb]) => {
			element.removeEventListener(eventName, cb);
		});
	}
}
