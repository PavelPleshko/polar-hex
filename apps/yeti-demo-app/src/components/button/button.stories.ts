import { html } from 'lit-element';

import 'packages/components/button';
import { TemplateResult } from 'lit';

export default {
	title: 'Button',
};

export const Variants = (): TemplateResult => html`
	<yt-button label="Raised button"></yt-button>
	<yt-button variant="outlined" label="Outlined button"></yt-button>
	<yt-button variant="text" label="Text button"></yt-button>
`;

export const SemanticColors = (): TemplateResult => html`
	<yt-button color="success" label="Success"></yt-button>
	<yt-button color="error" label="Error"></yt-button>
	<yt-button color="info" label="Info"></yt-button>
	<yt-button color="warning" label="Warning"></yt-button>
	<br />
	<br />
	<yt-button variant="outlined" color="success" label="Success"></yt-button>
	<yt-button variant="outlined" color="error" label="Error"></yt-button>
	<yt-button variant="outlined" color="info" label="Info"></yt-button>
	<yt-button variant="outlined" color="warning" label="Warning"></yt-button>
	<br />
	<br />
	<yt-button variant="text" color="success" label="Success"></yt-button>
	<yt-button variant="text" color="error" label="Error"></yt-button>
	<yt-button variant="text" color="info" label="Info"></yt-button>
	<yt-button variant="text" color="warning" label="Warning"></yt-button>
`;

export const Size = (): TemplateResult => html`
	<yt-button size="small" label="Small"></yt-button>
	<yt-button size="default" label="Medium"></yt-button>
	<yt-button size="large" label="Large"></yt-button>
`;

export const Disabled = (): TemplateResult => html`
	<yt-button disabled label="Disabled"></yt-button>
	<yt-button disabled variant="outlined" label="Disabled outlined"></yt-button>
	<yt-button disabled variant="text" label="Disabled text"></yt-button>
`;
