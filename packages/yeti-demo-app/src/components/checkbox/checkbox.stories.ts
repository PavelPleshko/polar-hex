import { html, render } from 'lit-html';

import '@yeti-wc/checkbox';
import { TemplateResult } from 'lit';

export default {
	title: 'Checkbox',
};

export const Variants = (): TemplateResult => {
	return html` <yt-checkbox> My checkbox label </yt-checkbox> `;
};
