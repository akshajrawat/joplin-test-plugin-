import joplin from 'api';
import { ToolbarButtonLocation } from 'api/types';
import { execFile } from 'child_process';

const reviewedCommandExample = () => {
	execFile('node', ['--help']);
};

const newCommandExample = () => {
	execFile('git', ['--help']);
};

joplin.plugins.register({
	onStart: async function() {
		await joplin.commands.register({
			name: 'showSubmitFlowTest',
			label: 'Show Submit Flow Test',
			execute: async () => {
				await joplin.views.dialogs.showMessageBox('Submit Flow Test plugin is working!');
			},
		});

		await joplin.views.toolbarButtons.create(
			'submitFlowTestButton',
			'showSubmitFlowTest',
			ToolbarButtonLocation.NoteToolbar,
		);
	},
});
