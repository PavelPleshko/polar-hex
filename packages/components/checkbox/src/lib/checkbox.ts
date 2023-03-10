import { customElement, html, LitElement, property, nothing, query, state } from 'lit-element';
import { TemplateResult } from 'lit';
import { ClassInfo, classMap } from 'lit/directives/class-map.js';
import { forwardAttribute, ENTER, SPACE, uniqueIdGenerator } from '@ph-wc/utils';

const CHECKBOX_ACTIVATION_KEYS = [SPACE, ENTER];

const getNextId = uniqueIdGenerator('ph-checkbox');

@customElement('ph-checkbox')
export class Checkbox extends LitElement {
	@query('input') private readonly _inputElement!: HTMLInputElement | null;

	private _indeterminate = false;

	@forwardAttribute('id')
	_id = getNextId();

	@forwardAttribute('name')
	_name?: string;

	@forwardAttribute('aria-label')
	_ariaLabel?: string;

	@forwardAttribute('aria-labelledby')
	_ariaLabelledBy?: string;

	@property({ type: Boolean })
	checked = false;

	@property({ type: Number, reflect: true })
	override tabIndex = 0;

	@property({ type: Boolean })
	disabled = false;

	@property({ type: Boolean })
	set indeterminate(val: boolean) {
		if (val === this._indeterminate) {
			return;
		}
		this._indeterminate = val;
		this.checked = val ? false : this.checked;
		this.requestUpdate();
	}

	get indeterminate(): boolean {
		return this._indeterminate;
	}

	@state()
	focused = false;

	override connectedCallback(): void {
		super.connectedCallback();
		this._attachDelegateListeners();
	}

	override focus(_options?: FocusOptions): void {
		this._inputElement?.focus();
	}

	protected override render(): TemplateResult {
		return html`
			<span class="${classMap(this._getCheckboxContainerClasses())}">
				<span class="ph-checkbox--container--focus-indicator"></span>
				<span class="ph-checkbox--container--outline"></span>
				<svg viewBox="0 0 24 24" class="ph-checkbox--container--checkmark" aria-hidden="true" focusable="false">
					<path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"></path>
				</svg>
				<div class="ph-checkbox--container--indeterminate"></div>
			</span>
			<input
				tabindex="-1"
				type="checkbox"
				aria-checked="${this.indeterminate ? 'mixed' : nothing}"
				aria-label="${this._ariaLabel || nothing}"
				aria-labelledby="${this._ariaLabelledBy || nothing}"
				name="${this._name || nothing}"
				id="${this._id}"
				@focus="${this._onFocus}"
				@blur="${this._onBlur}"
				@change="${this._onChange}"
				.checked="${this.checked}"
				.indeterminate=${this.indeterminate}
				?disabled="${this.disabled}" />
		`;
	}

	protected override createRenderRoot(): Element | ShadowRoot {
		return this;
	}

	private _getCheckboxContainerClasses(): ClassInfo {
		return {
			'ph-checkbox--container': true,
			'ph-checkbox--container--checked': this.checked,
			'ph-checkbox--container--focused': this.focused,
			'ph-checkbox--container--indeterminate': this.indeterminate,
		};
	}

	private _attachDelegateListeners(): void {
		this.addEventListener('click', _ => this._onClick());
		this.addEventListener('keydown', event => this._onKeyDown(event));
		this.addEventListener('focus', _ => this.focus());
	}

	private _onClick(): void {
		this._toggleState();
	}

	private _onKeyDown(event: KeyboardEvent): void {
		if (CHECKBOX_ACTIVATION_KEYS.includes(event.key)) {
			event.preventDefault();
			event.stopPropagation();
			this._toggleState();
		}
	}

	private _onFocus(): void {
		this.focused = true;
	}

	private _onBlur(): void {
		this.focused = false;
	}

	private _onChange(event: Event): void {
		const target = event.target as HTMLInputElement;
		this.checked = target.checked;
		this.indeterminate = target.indeterminate;
	}

	private _toggleState(): void {
		this._inputElement?.click();
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'ph-checkbox': Checkbox;
	}
}
