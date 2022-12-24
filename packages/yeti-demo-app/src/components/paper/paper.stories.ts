import { html } from 'lit-html';
import { repeat } from 'lit/directives/repeat.js';
import '@yeti-wc/paper';
import { TemplateResult } from 'lit';

export default {
	title: 'Paper',
};

const elevationLevels = [0, 1, 2, 3, 4, 6];

export const Elevation = (): TemplateResult => {
	// TODO move styles somewhere reasonable
	return html` <div
		style="padding:2rem;display: grid;
         grid-template-columns: 1fr 1fr; grid-row-gap: 20px; grid-column-gap: 20px; max-width: 400px">
		${repeat(
			elevationLevels,
			item =>
				html` <yt-paper .elevation="${item}">
					<div style="padding: 0.25rem 1.5rem;">
						<p>Elevation <i>${item}</i></p>
					</div>
				</yt-paper>`
		)}
	</div>`;
};

export const Outlined = (): TemplateResult => html`<yt-paper outlined="true">
	<div style="padding: 0.25rem 1rem; width: 200px;">
		<p>Outlined paper example</p>
	</div>
</yt-paper>`;
