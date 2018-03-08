var fs = require('fs'), 
	NodeRSA = require('node-rsa'),
	Nightmare = require('nightmare'),
	nightmare = Nightmare({ openDevTools: true,
		show: true, 
		waitTimeout: 100000,
		typeInterval: 10 //increases the typing speed
		}), // show true means it displays an electron window
	key = new NodeRSA('-----BEGIN RSA PRIVATE KEY-----\n'+
                      'MIIBOQIBAAJAVY6quuzCwyOWzymJ7C4zXjeV/232wt2ZgJZ1kHzjI73wnhQ3WQcL\n'+
                      'DFCSoi2lPUW8/zspk0qWvPdtp6Jg5Lu7hwIDAQABAkBEws9mQahZ6r1mq2zEm3D/\n'+
                      'VM9BpV//xtd6p/G+eRCYBT2qshGx42ucdgZCYJptFoW+HEx/jtzWe74yK6jGIkWJ\n'+
                      'AiEAoNAMsPqwWwTyjDZCo9iKvfIQvd3MWnmtFmjiHoPtjx0CIQCIMypAEEkZuQUi\n'+
                      'pMoreJrOlLJWdc0bfhzNAJjxsTv/8wIgQG0ZqI3GubBxu9rBOAM5EoA4VNjXVigJ\n'+
                      'QEEk1jTkp8ECIQCHhsoq90mWM/p9L5cQzLDWkTYoPI49Ji+Iemi2T5MRqwIgQl07\n'+
                      'Es+KCn25OKXR/FJ5fu6A6A+MptABL3r8SEjlpLc=\n'+
                      '-----END RSA PRIVATE KEY-----');

var names = [/*array of names*/];
var i = 0;
var results = [];
var completed = [];



function PromiseAccumulator(accumulator, name) {
	return accumulator.then(function(results) {
	return nightmare
	  .goto('https://www.facebook.com/')
	  .wait('input[type="text"]')
	  //.wait('span.uiIconText._5qtp')
	  .type('input[type="text"]',name + '\u000d')
	  .wait('a._1ii5._2yez') //waits for the first search result to load
	  .click('a._1ii5._2yez')
	  .wait('ul._6_7.clearfix > li:nth-child(4) > ._6-6') //wait for thephotos button to load
		  .click('ul._6_7.clearfix > li:nth-child(4) > ._6-6') // click on photos button
		  .wait('div._3dc :nth-child(3)') // wait for albums to load
		  .click('div._3dc :nth-child(3) > :nth-child(1)') // click on albums button
	  .wait(5000) //wait for the html to load otherwise it will not be able to look for table below
	  .evaluate(() => {
	  		function getSrc() {
			   var promise = new Promise(function(resolve, reject) {
			   	setTimeout(() => {
					l = document.querySelectorAll('table._51mz > tbody > tr > td');
					for(let i = 0; i < l.length; i++) {
						if(/Profile pictures/g.test(l[i].innerText)) {
							match = i;
							break;
						}
					}
					console.log(l[match].children[0].children[0].children[0].children[0].children[0].src);
					resolve(l[match].children[0].children[0].children[0].children[0].children[0].src);
				}, 500);
			   });
			   return promise;
			}

		  	var l = document.querySelectorAll('table._51mz > tbody > tr > td');
		  	if(l.length == 0) { //when it shows error in loading the profile pic
		  		var fax = [];
		  		var s = document.getElementsByClassName('_3sz');
		  		s[1].click();
		  		return getSrc().then(function(done) {
	  				return done;
				});
		  	}
		  	else {
		  		let match = 0;
		  		for(let i = 0; i < l.length; i++) {
			  		if(/Profile pictures/g.test(l[i].innerText)) {
			  			match = i;
			  			break;
			  		}
		  		}
		  		return l[match].children[0].children[0].children[0].children[0].children[0].src;
		  	}
		})
	  .then(function(result){
	    results.push(result);
	    //names.shift();
	    //completed.push(name);
	    return results;
	  });
	});
}

fs.readFile('../fapx.txt', 'utf8', function(err, enc_data) { //fapx.txt contains the encrypted login credentials
	var decrypted = key.decrypt(enc_data, 'utf8'); //decrypts the data in file
	var username = decrypted.split('\n')[0]; // seperates username from decrypted data
	var pass = decrypted.split('\n')[1]; //as above

	nightmare
	  .goto('https://www.facebook.com/')
	  .type('input[type="email"]',username) //enter username
	  .type('input[type="password"]',pass + '\u000d')  // enter password
	  .wait('span._1qv9') //waits for a random element on the page to load(input was not working)
	  .then(() => {
	  	console.log("second");
		names.reduce(PromiseAccumulator, Promise.resolve([])).then(function(results){
			/*console.log("NAMES: ");
	        console.log(names);
		    console.log("completed: ");
		    console.log(completed);*/
		    console.dir(results);
		    //return nightmare.end();
		}).then(() => {
			return nightmare.end();
		});
	  })/*
	  .then(() => {
	  	console.log("First");
	  	return nightmare.end();
	  })*/
	  .catch(function (error) {
	    console.error('Errororor:', error);
	});
});
/*
.then((result) => {
	  	console.log(result);
	  	return nightmare.end()
	  })*/

/*
.wait('a._42ft._4jy0._4jy4._517h._51sy')	//waits for the message button to load
	  .click('a._42ft._4jy0._4jy4._517h._51sy') //clicks on the message button
	  .wait('input._58al')
	  .wait(30000)
	  .type('input._58al','This is an automated test message!! \u000d')
	  .wait(30000)
	  //l[match].children[0].children[0].children[0].children[0].children[0].src
*/

/*
.wait('ul._6_7.clearfix > li:nth-child(4) > ._6-6') //wait for thephotos button to load
	  .click('ul._6_7.clearfix > li:nth-child(4) > ._6-6') // click on photos button
	  .wait('div._3dc :nth-child(3)') // wait for albums to load
	  .click('div._3dc :nth-child(3) > :nth-child(1)') // click on albums button
	  .wait('table.uiGrid > tbody') // wait for profile photos containing table to load
	  .click('td._51mw') //click on the profile photo td
*/
 