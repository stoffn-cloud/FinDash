import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: '127.0.0.1', 
  user: 'findash',       // De nieuwe gebruiker die je hebt aangemaakt
  password: 'DfQ5!r3#', 
  database: 'mydb',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});