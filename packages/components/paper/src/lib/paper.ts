import { customElement, html, LitElement, property } from 'lit-element';
import { TemplateResult } from 'lit';
import { ClassInfo, classMap } from 'lit/directives/class-map.js';

@customElement('yt-paper')
export class PaperComponent extends LitElement {
	private _elevation = 1;

	@property()
	set elevation(value: number) {
		this._elevation = value;
	}

	get elevation(): number {
		return this.outlined ? 0 : this._elevation;
	}

	@property({ type: Boolean })
	outlined = false;

	protected render(): TemplateResult {
		return html`<div class="${classMap(this._getRuntimeClasses())}">${this.children}</div>`;
	}

	protected createRenderRoot(): Element | ShadowRoot {
		return this;
	}

	private _getRuntimeClasses(): ClassInfo {
		return {
			'yt-paper': true,
			[`yt-elevation-${this.elevation}`]: true,
			'yt-paper--outlined': this.outlined,
		};
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'yt-paper': PaperComponent;
	}
}
