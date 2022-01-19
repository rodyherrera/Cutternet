/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/CodeWithRodi/Cutternet/
 *
 * Cutternet Backend Source Code
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
 ****/
const Express = require('express');
const Mongoose = require('mongoose');
const DotEnv = require('dotenv');
const Helmet = require('helmet');
const MongoSanitize = require('express-mongo-sanitize');
const XSS = require('xss-clean');
const Cors = require('cors');
const Settings = require('./Settings/');
const HTTPs = require('https');
const HTTP = require('http');
const FileSystem = require('fs');

process.on('uncaughtException', (ServerError) => {
    console.log(ServerError.name, ServerError.message);
    console.log(
        '(Cutternet) > Exception not detected, please catch the errors to make a correct execution of the software.'
    );
    process.exit(1);
});

DotEnv.config({ path: './Settings.env' });

const Routes = Settings.Routes;
const { RuntimeError } = require('./Utils/RuntimeError');
const GlobalErrorHandler = require('./Controllers/Error');
const UsersRouter = require('./Routes/User');
const LinksRouter = require('./Routes/Link');
const LanguagesRouter = require('./Routes/Language');

const Application = Express();
const Port = process.env.SERVER_PORT || 5000;
const Hostname = process.env.SERVER_HOST || '0.0.0.0';
const Database = process.env.DATABASE_HOST.replace('<password>', process.env.DATABASE_PASSWORD);

Mongoose.connect(Database, { useNewUrlParser: true })
    .then(() =>
        console.log('(Cutternet) > You have successfully connected to the MongoDB database.')
    )
    .catch(() =>
        console.log(
            '(Cutternet) > An error occurred while trying to connect to the MongoDB database using the credentials set in Settings.env.'
        )
    );

Application.use(Cors({ origin: '*' }));
Application.use(Helmet());
Application.use(Express.json({ limit: process.env.BODY_MAX_SIZE }));
Application.use(MongoSanitize());
Application.use(XSS());

Application.use(Express.static(__dirname + '/Public'));
Application.use(Routes.Suffix + Routes.Auth.Suffix, UsersRouter);
Application.use(Routes.Suffix + Routes.Link.Suffix, LinksRouter);
Application.use(Routes.Suffix + Routes.Language.Suffix, LanguagesRouter);

Application.all('*', (Request, Response, Next) =>
    Next(new RuntimeError(`Can not find ${Request.originalUrl} on server.`, 404))
);

Application.use(GlobalErrorHandler);

var Server = HTTP.createServer;
var Configuration = {};

if(process.env.SSL_CERT.length && process.env.SSL_KEY.length){
    Server = HTTPs.createServer;
    Configuration.key = FileSystem.readFileSync(process.env.SSL_KEY);
    Configuration.cert = FileSystem.readFileSync(process.env.SSL_CERT);
}

Server(Configuration, Application).listen(Port, Hostname, () => {
    console.log(`(CodexDrake) > The server was started successfully in the network address (${Hostname}:${Port})`);
});

process.on('unhandledRejection', (ServerError) => {
    console.log(ServerError.name, ServerError.message);
    console.log(
        '(Cutternet) > Exception not detected, please catch the errors to make a correct execution of the software.'
    );
    Server.close(() => process.exit(1));
});
