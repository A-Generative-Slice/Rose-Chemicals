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
        const routes = await runCommand('grep -E "app.use\\(\'|require\\(\'./routes" /var/www/rose-chemicals/backend/server.js');
        console.log('Routes in server.js:');
        console.log(routes);

        const upload_routes = await runCommand('ls /var/www/rose-chemicals/backend/routes/');
        console.log('Files in routes directory:');
        console.log(upload_routes);

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
