import { html } from 'lit-html';

import '@yeti-wc/button';
import { TemplateResult } from 'lit';

export default {
	title: 'Button',
};

export const Variants = (): TemplateResult => html`
	<yt-button> Raised button</yt-button>
	<yt-button variant="outlined"> Outlined button</yt-button>
	<yt-button variant="text"> Text button</yt-button>
`;

export const SemanticColors = (): TemplateResult => html`
	<yt-button color="success"> Success</yt-button>
	<yt-button color="error"> Error</yt-button>
	<yt-button color="info"> Info</yt-button>
	<yt-button color="warning"> Warning</yt-button>
	<br />
	<br />
	<yt-button variant="outlined" color="success"> Success</yt-button>
	<yt-button variant="outlined" color="error"> Error</yt-button>
	<yt-button variant="outlined" color="info"> Info</yt-button>
	<yt-button variant="outlined" color="warning"> Warning</yt-button>
	<br />
	<br />
	<yt-button variant="text" color="success"> Success</yt-button>
	<yt-button variant="text" color="error"> Error</yt-button>
	<yt-button variant="text" color="info"> Info</yt-button>
	<yt-button variant="text" color="warning"> Warning</yt-button>
`;

export const Size = (): TemplateResult => html`
	<yt-button size="small"> Small</yt-button>
	<yt-button size="default"> Medium</yt-button>
	<yt-button size="large"> Large</yt-button>
`;

export const Disabled = (): TemplateResult => html`
	<yt-button disabled> Disabled</yt-button>
	<yt-button disabled variant="outlined"> Disabled</yt-button>
	<yt-button disabled variant="text"> Disabled</yt-button>
`;
