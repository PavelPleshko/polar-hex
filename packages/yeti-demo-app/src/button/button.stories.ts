import { html } from 'lit-html';

import '@yeti-wc/button';
import { TemplateResult } from 'lit';

export default {
	title: 'Button',
};

export const Raised = (): TemplateResult => html` <yt-button> Raised button </yt-button>`;
