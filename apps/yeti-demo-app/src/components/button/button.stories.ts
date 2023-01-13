import { html } from 'lit-element';

import 'packages/components/button';
import { TemplateResult } from 'lit';

export default {
	title: 'Button',
};

export const Variants = (): TemplateResult => html`
	<ph-button label="Raised button"></ph-button>
	<ph-button variant="outlined" label="Outlined button"></ph-button>
	<ph-button variant="text" label="Text button"></ph-button>
`;

export const SemanticColors = (): TemplateResult => html`
	<ph-button color="success" label="Success"></ph-button>
	<ph-button color="error" label="Error"></ph-button>
	<ph-button color="info" label="Info"></ph-button>
	<ph-button color="warning" label="Warning"></ph-button>
	<br />
	<br />
	<ph-button variant="outlined" color="success" label="Success"></ph-button>
	<ph-button variant="outlined" color="error" label="Error"></ph-button>
	<ph-button variant="outlined" color="info" label="Info"></ph-button>
	<ph-button variant="outlined" color="warning" label="Warning"></ph-button>
	<br />
	<br />
	<ph-button variant="text" color="success" label="Success"></ph-button>
	<ph-button variant="text" color="error" label="Error"></ph-button>
	<ph-button variant="text" color="info" label="Info"></ph-button>
	<ph-button variant="text" color="warning" label="Warning"></ph-button>
`;

export const Size = (): TemplateResult => html`
	<ph-button size="small" label="Small"></ph-button>
	<ph-button size="default" label="Medium"></ph-button>
	<ph-button size="large" label="Large"></ph-button>
`;

export const Disabled = (): TemplateResult => html`
	<ph-button disabled label="Disabled"></ph-button>
	<ph-button disabled variant="outlined" label="Disabled outlined"></ph-button>
	<ph-button disabled variant="text" label="Disabled text"></ph-button>
`;
