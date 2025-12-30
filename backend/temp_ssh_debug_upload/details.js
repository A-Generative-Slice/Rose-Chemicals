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
        const results = {};
        results.nginx = await runCommand('grep "/api/upload/multiple" /var/log/nginx/access.log | tail -n 10');
        results.ls_root = await runCommand('ls -F /var/www/rose-chemicals/');
        results.ls_backend = await runCommand('ls -F /var/www/rose-chemicals/backend/');
        results.env = await runCommand('cat /var/www/rose-chemicals/backend/.env');

        console.log(JSON.stringify(results));
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
