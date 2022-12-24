import { customElement, html, LitElement, property } from 'lit-element';
import { TemplateResult } from 'lit';
import { ClassInfo, classMap } from 'lit/directives/class-map.js';

// @ts-expect-error: figure out the broken imports
import { CSSResultGroup } from '@lit/reactive-element/css-tag';
import style from './paper.scss';

@customElement('yt-paper')
export class PaperComponent extends LitElement {
	static override shadowRootOptions: ShadowRootInit = { mode: 'open' };

	static override get styles(): CSSResultGroup {
		return [style];
	}

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
		return html`<div class="${classMap(this._getRuntimeClasses())}">
			<slot></slot>
		</div>`;
	}

	private _getRuntimeClasses(): ClassInfo {
		return {
			'yt-paper': true,
			[`yt-elevation-${this.elevation}`]: true,
			'yt-paper--outlined': this.outlined,
		};
	}
}
