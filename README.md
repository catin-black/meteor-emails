# .meteoremails
![.meteoremails](http://meteoremails.com/image/cover.jpg)
Send cold emails for free!
Completely free and open source project to fight against stagnation in your company, caused by the COVID-19 pandemic!
Download, run and rock your sales!

## Getting Started
1. Install Node.js - https://nodejs.org/en/download/
2. Install Meteor - https://www.meteor.com/install
	**OSX / Linux**
	Run the following command in your terminal to install the latest official Meteor release:
	```
	> curl https://install.meteor.com/ | sh
	```
	For compatibility, Linux binaries are built with CentOS 6.4 i386/amd64.

	**Windows**
	First install [Chocolatey](https://chocolatey.org/install), then run this command using an **Administrator command prompt**:
	```
	> choco install meteor
	```
	Meteor supports Windows 7/Windows Server 2008 R2 and up. The installer uses Chocolatey, which has its own requirements. Disabling antivirus (Windows Defender, etc.) will improve performance.
3. Download files or clone repository
4. Run project
	```
	> meteor npm install && meteor --settings settings.json
	```

## Upload to server
If you do not want to use it on the local machine, you can upload it to your server. The tool that can help you with that is available here: http://meteor-up.com/. Meteor Up is a production-quality tool to setup servers and deploy your Meteor apps to them
Install Meteor Up with one command:
```
> npm install --global mup
```
You should install mup on the computer you are deploying from. Mup requires node 8 or newer.
You need at least one server to deploy to. Many companies offer them for $5 / month or less, including Digital Ocean, Vultr, and Hetzner.
The server should:
Have at least 512MB of ram. 1GB is recommended.
Be running Ubuntu 14 or newer.
You do not need to install anything on your servers; mup will set them up for you.

## Built With

* [Meteor](https://docs.meteor.com/#/full/) - Meteor is a full-stack JavaScript platform for developing modern web and mobile applications. Meteor includes a key set of technologies for building connected-client reactive applications, a build tool, and a curated set of packages from the Node.js and general JavaScript community.
* [Node.js](https://nodejs.org/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
* [Bootstrap](https://getbootstrap.com/) - The world’s most popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid system, extensive prebuilt components, and powerful JavaScript plugins.
* [Paper Dashboard](https://www.creative-tim.com/product/paper-dashboard) - Free Bootstrap admin template

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code
of conduct, and the process for submitting pull requests to us.

## Authors

* **Adam Trojanczyk** - Author - [catin-black](https://github.com/catin-black)
* **Tomasz Nolberczak** - Main contributor - [tomasz-nolberczak](https://github.com/tomasz-nolberczak)

See also the list of [contributors](https://github.com/catin-black/meteor-emails/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

