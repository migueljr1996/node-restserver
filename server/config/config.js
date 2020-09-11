//***************
// Puerto
//******************* */

process.env.PORT = process.env.PORT || 3000;
//***************
// Entorno
//******************* */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/dbmiguel'
} else {
    urlDB = 'mongodb+srv://miguel:123momiaes@cluster0.tmmjx.mongodb.net/test'
}
process.env.URLDB = urlDB