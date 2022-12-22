import { noChange } from 'lit';
import { Directive, directive, ElementPart } from 'lit/directive.js';
import { RippleComponent } from './ripple.component';

type RippleElementQuery = Promise<RippleComponent | null>;

class RippleDirective extends Directive {
	private _elementRef?: Element;

	private _rippleElementQuery?: RippleElementQuery;

	render(_rippleComp: RippleElementQuery): typeof noChange {
		return noChange;
	}

	override update(_part: ElementPart, [rippleQuery]: [RippleElementQuery]): typeof noChange {
		if (!this._elementRef) {
			this._elementRef = _part.element;
			this._createListeners();
		}

		this._rippleElementQuery = rippleQuery;
		return noChange;
	}

	private _createListeners(): void {
		const element = this._elementRef!;
		element.addEventListener('click', ev => this._onClick(ev as PointerEvent));
	}

	private async _onClick(event: PointerEvent): Promise<void> {
		const rippleElement = await this._getRippleElement();
		if (!rippleElement) {
			return;
		}

		rippleElement.onPress(event);
	}

	private async _getRippleElement(): Promise<RippleComponent | null> {
		const rippleElement = await this._rippleElementQuery;
		if (!rippleElement || rippleElement.disabled) {
			return null;
		}
		return rippleElement;
	}
}

/**
 * Enables ripple effect on the host element. Manages event
 * handlers and calls the actual ripple element's public methods
 * to alter state.
 * @usage
 * ```ts
 * html`<button ${ripple(rippleElement)}>
 *     <yt-ripple></yt-ripple>
 *     Click to view
 *    </button>`
 * ```
 */
export const ripple = directive(RippleDirective);
