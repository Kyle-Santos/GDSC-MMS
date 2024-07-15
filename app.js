// npm i express express-handlebars body-parser 

const express = require('express');
const server = express();
const mongoose = require('mongoose');
const route = require('./controllers/route');

// mongodb conn
mongoose.connect('mongodb+srv://GDSC:t55kysWsTyd7qvNl@cluster0.kbfmtmh.mongodb.net/GDSC_DB');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const bodyParser = require('body-parser');
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));

server.use(express.static('public'));

route.add(server);

const controllers = ['route'];

for(i = 0; i < controllers.length; i++){
    const ctrl = require('./controllers/' + controllers[i]); 
    ctrl.add(server);
}

//Only at the very end should the database be closed.
function finalClose(){
    console.log('Close connection at the end!');
    mongoose.connection.close();
    process.exit();
}

process.on('SIGTERM',finalClose);  //general termination signal
process.on('SIGINT',finalClose);   //catches when ctrl + c is used
process.on('SIGQUIT', finalClose); //catches other termination commands

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Listening at port ${port}`);
  (async () => {
    const open = await import('open');
    await open.default(`http://localhost:${port}`);
  })();
});