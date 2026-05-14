const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
    conn.exec(`grep -C 10 "apiUrl" /var/www/rose-chemicals/src/components/admin/ProductForm.tsx`, (err, stream) => {
        if (err) throw err;
        let output = '';
        stream.on('close', () => {
            console.log(output);
            conn.end();
        }).on('data', (data) => output += data);
    });
}).connect({
    host: '72.60.218.80',
    port: 22,
    username: 'root',
    password: 'Rosechem@123'
});

