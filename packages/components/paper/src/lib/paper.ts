import { customElement, html, LitElement, property } from 'lit-element';
import { TemplateResult } from 'lit';
import { ClassInfo, classMap } from 'lit/directives/class-map.js';

@customElement('ph-paper')
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
			'ph-paper': true,
			[`ph-elevation-${this.elevation}`]: true,
			'ph-paper--outlined': this.outlined,
		};
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'ph-paper': PaperComponent;
	}
}
