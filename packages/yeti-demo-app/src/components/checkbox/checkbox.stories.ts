import { html } from 'lit-html';

import '@yeti-wc/checkbox';
import { TemplateResult } from 'lit';

export default {
	title: 'Checkbox',
};

export const StandardCheckbox = (): TemplateResult => {
	return html` <yt-checkbox></yt-checkbox> My checkbox label`;
};

export const Indeterminate = (): TemplateResult => {
	return html` <yt-checkbox indeterminate="true"></yt-checkbox> Indeterminate checkbox`;
};
