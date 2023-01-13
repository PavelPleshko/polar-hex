import { html } from 'lit-html';
import { TemplateResult } from 'lit';

import '@ph-wc/checkbox';

export default {
	title: 'Checkbox',
};

export const StandardCheckbox = (): TemplateResult => {
	return html`<ph-checkbox></ph-checkbox> <label>My checkbox label</label>`;
};

export const Indeterminate = (): TemplateResult => {
	return html` <ph-checkbox indeterminate="true"></ph-checkbox> <label>Indeterminate checkbox</label>`;
};
