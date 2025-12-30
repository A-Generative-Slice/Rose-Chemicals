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
        const server_js = await runCommand('cat /var/www/rose-chemicals/backend/server.js');
        console.log('Server.js Content:');
        console.log(server_js);

        const upload_js = await runCommand('cat /var/www/rose-chemicals/backend/routes/upload.js');
        console.log('Routes/upload.js Content:');
        console.log(upload_js);

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
