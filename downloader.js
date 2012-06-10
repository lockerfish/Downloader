/*
 * Copyright (c) 2012 Hendrix Tavarez
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

var http = require('http');
var url = require('url');
var fs = require('fs');

var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Downloader = new EventEmitter();

Downloader.download = function( theUrl, outputDir, maxFileSize ) {

	var that = this;

	var options = {
		host: url.parse(theUrl).hostname,
		port: 80,
		path: url.parse(theUrl).pathname
	};

	var filename = options.path.split("/").pop();
	var maxFileSize = maxFileSize || 1000000000; // default to 100MB

	var dlrequest = http.get(options, function(res) {
		if(res.statusCode === 200) {
			var filesize = res.headers['content-length'];
			if(filesize <= maxFileSize) {
				var downloadfile = fs.createWriteStream( outputDir + filename, {
					flags: 'a',
					encoding: 'binary'
				});

				res.on('error', function(err) {
					that.emit('error', '[FILE DOWNLOAD ERROR - DATA] ' + err);
				});
				res.on('data', function(chunk) {
					downloadfile.write(chunk);
				});
				res.on('end', function() {
					downloadfile.end();
					that.emit('done', outputDir + filename );
				});
			} else {
				that.emit('error', '[REQUEST FAILED] file size > ' + maxFileSize + ' bytes. File size = ' + filesize);
			}
		} else {
			that.emit('error', '[REQUEST FAILED] ' + res.statusCode + ' PATH ' + options.path);
		}
	});
}

util.inherits(Downloader, EventEmitter);

exports.Downloader = Downloader;
