
Downloader
==========
Node.js event driven downloader.


var dl = require('./downloader');

var downloadDir = __dirname + '/downloads/';

var urls = [
	"http://site.com/file1.txt"
	, "http://site.com/file2.txt"
];

var downloader = dl.Downloader;

downloader.on('done', function(msg) {
	console.log(msg);
});
downloader.on('error', function(msg) {
	console.log(msg);
});

for(i=0; i < urls.length; i++) {

	downloader.download( urls[i], downloadDir);
}


License
========
@2012 Hendrix Tavarez
MIT License http://www.opensource.org/licenses/MIT 
