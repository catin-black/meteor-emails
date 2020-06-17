# .meteoremails

![.meteoremails](http://meteoremails.com/image/cover.jpg)

## About the project

[Project web page](https://meteoremails.com)

Send cold emails for free!

Completely free and open source project to fight against stagnation in your company, caused by the COVID-19 pandemic!
Download, run and rock your sales!

## Genesis 

Some time ago, I created a tool for my own use, which sent cold emails to potential customers. It served me basically for everyday work. Sending an email, then - when contact was promising - retrying via LinkedIn and exporting to CRM.
I got many good relationships with other people because of that.

I worked on it, hoping that one day it would see a full-paid version and I will start making money on it. 

Looking closely at the current situation on the world, I thought that such a tool could be perhaps useful to others. It is a pity that it is locked up. That’s why I decided to release it as an open-source solution! 

Simple license, open code, absolutely free. 🔥🔥🔥

I hope it will be useful to someone ❤️

![.meteoremails](http://meteoremails.com/image/dashboard-analytics.jpg)


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
5. Open your browser with the URL [http://localhost:3000](http://localhost:3000)
6. You will see the registration page. Provide your e-mail from which you will be sending messages, and your password to protect your data. SendGrid API key is optional when you register, but you will need to add it (in settings)  before you will start sending e-mails. All data will be kept on your local machine, or if you upload it to your server, then they will be stored there.

![.meteoremails](http://meteoremails.com/image/register.jpg)

7. After registration and login, you will get access to all features of the system. You can send messages from CRM. Just add contacts or upload your CSV file. Then select contacts to whom you want to send an e-mail and create a new campaign. 

![.meteoremails](http://meteoremails.com/image/crm.jpg)

![.meteoremails](http://meteoremails.com/image/campain.jpg)

## Sendgrid

This application is using the SendGrid SMTP server to send emails. All you need is to create an account on sendgrid.com, create an API key and paste it to the app.
SendGrid is a Denver, Colorado-based customer communication platform for transactional and marketing email. The company was founded by Isaac Saldana, Jose Lopez, and Tim Jenkins in 2009, and incubated through the Techstars accelerator program. Now is a part of the Twilio company.

**For statistics in .meteoremails panel, you need to have Essentials plan with "Additional Email Activity History" enabled**

Whithout that you can check for statistics direct in SendGrid panel

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

## Author

* **Adam Trojanczyk** - Author - [catin-black](https://github.com/catin-black)

See also the list of [contributors](https://github.com/catin-black/meteor-emails/graphs/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## What's new
* 0.0.12
Fixed problem with the limit of emails that can be sent in one day.

* 0.0.11 
Fixed problem with adding new contacts.

* 0.0.1
First release.
