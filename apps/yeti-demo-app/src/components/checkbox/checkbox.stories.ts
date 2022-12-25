import { html } from 'lit-html';

import 'packages/components/checkbox';
import { TemplateResult } from 'lit';

export default {
	title: 'Checkbox',
};

export const StandardCheckbox = (): TemplateResult => {
	return html`<yt-checkbox></yt-checkbox> <label>My checkbox label</label>`;
};

export const Indeterminate = (): TemplateResult => {
	return html` <yt-checkbox indeterminate="true"></yt-checkbox> <label>Indeterminate checkbox</label>`;
};
