import fs from 'fs';
Router.route('/images/1/:img', function() {
	const self = this;
    const file = fs.readFileSync(Assets.absoluteFilePath('1.png'));
    var headers = {
        'Content-type': 'image/png',
        'Content-Disposition': "attachment; filename=" + "1.png"
    };

    self.response.writeHead(200, headers);
    Meteor.call('trackOpens', self.params.query.track, function(e, r) {
        return self.response.end(file);
    });
}, { where: "server" });