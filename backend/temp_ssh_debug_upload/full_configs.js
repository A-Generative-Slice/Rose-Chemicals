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
        const data = {};
        data.server_js = await runCommand('cat /var/www/rose-chemicals/backend/server.js');
        data.nginx_conf = await runCommand('cat /etc/nginx/sites-enabled/default');
        console.log(JSON.stringify(data));
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
