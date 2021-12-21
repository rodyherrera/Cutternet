# The Cutternet
##### A simple, beautiful, safe and self-hosted URL shortener written in JavaScript.
###### Only tested on Linux
Cutternet is a platform that will allow you to shorten URLs, generate detailed statistics about the visitors that the shortened URL receives, or use the embedded code and paste it in the source code of your website so that each time it receives a visit it is registered In Cutternet and you can view in detail all the visitors that your website receives, it is multi-language, easily expandable, free without limits of use or any fee, without paying monthly or annual subscriptions, animations, simple UI, beautiful with animations, secure platform With several firewalls in case of attacks, easy to deploy, mostly you will only have to edit .json and .env files, this software is built using the MERN Stack, completely ready to use, its terms and conditions written, all its pages complete, You only need to apply certain settings that will be explained below.

### Features
- Highly secure
- Firewall for XSS attacks
- Helmet for secure HTTP Headers
- Cors integration
- Secure Querys in MongoDB
- Multi language
- Manager to facilitate tasks
- Responsive
- Capable of sending emails
- No fees or subscriptions
- Highly customized alerts and messages for the user
- QR Code for links
- Specific actions handled, lost connection or server crash...
- API using JWT
- Small animations to soften the user's view
- Easy-to-use architectures
- Detailed searches, with filtering, ordering and keyword searches
- Images without copyright in the best format, png.
- Detailed validations

### Installation
Installing this software may seem easier than you think, we have files that can make it easier for us to write certain commands, it is recommended that you use these commands in a Linux operating system, also it is commonly the preferred system used in servers, This because these files have only been tested in said operating system, you can manual installation that will be explained below, success and deploy Cutternet!

It is important that you follow each instruction given to you step by step, because if you skip one or apply a bad configuration you will have problems with the correct deployment of the software.

```bash
# Cloning the repository
git clone https://github.com/CodeWithRodi/Cutternet/
# Accessing the generated directory
cd Cutternet
# Using the Setup.py file, which will allow you to do a quick initialization of both source codes, this file will be explained to you later.
python3 Setup.py
# Now you wait for the node_modules to be installed that the executed command will be installing
```
### Configuring the Server application
Inside the repository folder, in the root there are two folders, one called "Client" that contains the source code of the Client's application while the last one is called "Server", that contains the source code of the Cutternet server, first We will start by configuring the server, inside this folder called "Server" you will find a "Settings.env", which will contain necessary variables that you must complete for the correct functioning of the server.

```bash
# The mode in which the server is running, you can select "development" or "production" depending on the circumstances.
NODE_ENV = development

# If you want the server using SSL, you must complete these two fields, it will automatically start using SSL, the first variable called "SSL_CERT" must contain the path of where your certificate is located, for example "MyCert.pem", while the other variable called "SSL_KEY" must contain the path where your key is located, for example "MyKey.pem", once this is done your server should start in the port indicated with SSL.
SSL_CERT = 
SSL_KEY =

# Here you indicate the maximum amount of weight that can be received when data is sent to the server, it is advisable to have this low to avoid lagging in the server.
BODY_MAX_SIZE = 10kb
CORS_ORIGIN = *

# Indicate the port on which your server will be running, by default this port is assigned at 8000, if you remove it the server will start running on port 5000, you choose the port by changing the value of "SERVER_PORT".
SERVER_PORT = 8000

# It indicates the address in which the server will run, by default it is assigned in 0.0.0.0, making reference to where it will run on the server's base network, it is recommended that you do not change this.
SERVER_HOST = 0.0.0.0

# You must indicate the hostname of the client, for example if you have the React application in vercel this should be something like "myappname.vercel.app", if you have it on a separate server this should be "myapp.com", you must put the domain or the address of how to get to that app.
CLIENT_HOST = http://0.0.0.0:3000

# You must indicate the hostname to connect to your database, you can use MongoDB atlas, a local one on your server or use MongoDB database hosting, this must provide you with the same hostname that you must enter as a value in "DATABASE_HOST"
DATABASE_HOST = mongodb+srv://Rodolfo:<password>@cutternet.pwrea.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
# Enter your database password, if this is required "DATABASE_PASSWORD" should store your password
DATABASE_PASSWORD = Rodolfoxd665

# You must enter a secret key, it is recommended that you put characters, it is recommended that this key be secure, your passwords will be encrypted using this key, you can assign a value such as "29A06645A7A175816F107238EBE3D01364FBC85A6952BE13A1E6D350B47342AD" or other characters that are difficult to decipher.
SECRET_KEY = my-secure-ultra-fucking-long-secret-key-here

# JSON Web Token configuration, set the amount of day you want the client JSON web Token to expire, by default it is assigned in 90 days
JWT_EXPIRES_IN = 90d
JWT_COOKIE_EXPIRES_IN = 90

# The number of minutes you want for the link to recover the password to be available, by default 10 minutes.
PASSWORD_EXPIRES_IN_MINS = 10

# Configuration that will serve to make the sending of emails work, you can look for tutorials on how to get this information from your email account in GMAIL, or if you have an email server already ready you can assign its configuration to these variables
EMAIL_USERNAME = admin@codewithrodi.com
EMAIL_PASSWORD = rodolfoxd665
EMAIL_HOST = mail.codewithrodi.com
EMAIL_PORT = 465

NODE_TLS_REJECT_UNAUTHORIZED = 0
```

Inside the "Server" folder that is located inside the root of the source code on both sides, there is a folder called "Settings", which contains 3 .json files, the first one is "ClientRoutes.json", where you must declare the routes used by the React application, this is because those routes will also be used in the backend and it is the only way to know those front end routes, the computer is not guessing, the second file is "ApiRoutes.json", This file has declared all the routes that the server will use, the API routes, in this way you do not have to change a route by going to the .js file, but only modifying this beautiful JSON, finally you will find the " General.json ", which contains general settings, mostly validations, it is recommended that you keep an eye on all those configuration files.

### Configuring the Client application
It is time to configure the React application, within the root of the folder generated at the time of cloning the repository, you will have a folder called "Client", this folder contains the source code of the client application, that is, the source code of the Application built in ReactJS, it is time to configure it, when opening the "Client" folder, you must enter the "src" folder, within this you will find a folder called "Settings", quite similar to what you did in The previous step with the server source code, this Settings folder in the client source code contains 3 files as well, where the first corresponds to "ApiRoutes.json", where all the endpoints or routes where the requests will be made are declared of the API, IT IS IMPORTANT that you edit this file, because in the first lines of the .json you will find the "Server" key where you MUST declare the server address, for example "https://mybackendcutternetserver.com/", or in case you are running the server locally "http://0.0.0.0:8000/", the second file called "ClientRoutes.json" contains all the routes of the React application, when accessing a page in Specifically, the path of said page must be declared in this json, as previously explained, it is much simpler and more readable to edit a .json than to see a .js with a hundred lines of code, finally we have the file called " General.json ", where this file contains general settings that will be used throughout the execution of the React application, you will find more with validations in this file.

### Cutternet manager
Cutternet has a file called "Manager.js", located at the root of the server's source code, this file will help you to do certain actions in the database in a faster and less complicated way, such as exporting the language keys to the database of a .json, create a super user, that is, an administrator user, eliminate all languages ​​etc.
```bash
# Inside the folder where the source code of the server application is located.
# (( /Cutternet/Server/ )

# To create a super user on the site
node Mananger CreateSuperUser

# The language keys will be exported, so that the site is multi-language, these keys are found in (/Cutternet/Server/Data/Locale/), where the language is declared at the beginning of the .json, that is, En.json will contain the braces that refer to the language 'en', Es.json will contain braces for 'es'.
node Manager ExportLocale

# All languages ​​will be removed from the database
node Manager DropLanguageCollection
```
### The Setup file
Inside the folder that has been generated when the repository is cloned, there is a file called "Setup.py", which allows you to execute several instructions that will save you a little time, then the arguments that this file can receive will be explained to you.
```bash
# Inside the folder generated when cloning the repository.
# (( /Cutternet/ )

# It will automatically install the "node_modules" of the server and client applications.
python3 Setup.py

# It will remove the "node_modules" for the client and server application.
python3 Setup.py DeleteModules

# It will remove only the "node_modules" from the client application.
python3 Setup.py DeleteClientModules

# It will remove only the "node_modules" from the server application.
python3 Setup.py DeleteServerModules

# It will remove all source code from the server application.
python3 Setup.py DeleteServerSource

# It will remove all source code from the client application.
python3 Setup.py DeleteClientSource
```

### Contributions
Cutternet has been created to increase my skills and my knowledge with the development stack called MERN, this project is open to new contributions, vulnerability fixes or improvements, it is possible that I keep updating it when I don't feel like peeing.

### Remember to drink water bby.
