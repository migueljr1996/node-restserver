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
    urlDB = process.env.MONGO_URL;
}
process.env.URLDB = urlDB

//***************
// Vencimiento del token
//******************* */
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias

process.env.Caducidad_Token = '48h';


//***************
// Seed (semilla de autentificacion)
//******************* */

process.env.SEED = process.env.SEED || 'secret-DESARROLLO';


//***************
// Google ClientId
//******************* */
process.env.CLIENT_ID = process.env.CLIENT_ID || '576909884621-dk43357tq5bhnri8bnsqf935891cir42.apps.googleusercontent.com';