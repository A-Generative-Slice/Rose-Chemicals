const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
    console.log('Client :: ready');
    conn.exec(`
    echo "--- Nginx Upload Requests ---"
    grep "/api/upload/multiple" /var/log/nginx/access.log | tail -n 20
    
    echo "--- Backend Upload Logs ---"
    pm2 logs rose-backend --lines 100 --nostream | grep -i "upload"
    
    echo "--- Checking S3 Config in Environment ---"
    grep -E "AWS|S3" /var/www/rose-chemicals/backend/.env
    
    echo "--- Checking if uploads directory exists and is writable ---"
    ls -ld /var/www/rose-chemicals/backend/uploads
    touch /var/www/rose-chemicals/backend/uploads/test.txt && echo "Writable" || echo "NOT Writable"
  `, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
            process.exit(code);
        }).on('data', (data) => {
            console.log('' + data);
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
    });
}).connect({
    host: '72.61.244.121',
    port: 22,
    username: 'root',
    password: 'Rosechem@123',
    readyTimeout: 20000
});
