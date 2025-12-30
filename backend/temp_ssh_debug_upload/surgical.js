const { Client } = require('ssh2');
const conn = new Client();

const runCommand = (cmd) => {
    return new Promise((resolve, reject) => {
        conn.exec(cmd, (err, stream) => {
            if (err) return reject(err);
            let output = '';
            stream.on('close', () => resolve(output)).on('data', (data) => {
                output += data;
            });
        });
    });
};

conn.on('ready', async () => {
    try {
        console.log('--- START ---');

        const nginx_status = await runCommand('tail -n 100 /var/log/nginx/access.log | grep "/api/upload/multiple" | awk \'{print $9}\' | sort | uniq -c');
        console.log('Nginx Status Codes for Upload:');
        console.log(nginx_status);

        const backend_logs = await runCommand('pm2 logs rose-backend --lines 200 --nostream');
        console.log('Recent Backend Logs:');
        // Filter for upload related lines manually here if needed or just look at tail
        console.log(backend_logs.split('\n').filter(line => line.toLowerCase().includes('upload') || line.toLowerCase().includes('error')).join('\n'));

        const upload_dir = await runCommand('ls -ld /var/www/rose-chemicals/backend/uploads || ls -ld /var/www/rose-chemicals/uploads');
        console.log('Upload Dir Status:');
        console.log(upload_dir);

        console.log('--- END ---');
        conn.end();
    } catch (e) {
        console.error(e);
        conn.end();
    }
}).connect({
    host: '72.61.244.121',
    port: 22,
    username: 'root',
    password: 'Rosechem@123'
});
