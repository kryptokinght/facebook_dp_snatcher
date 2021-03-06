var	Nightmare = require('nightmare'),
	nightmare = Nightmare({ openDevTools: true,
		show: true, 
		waitTimeout: 100000,
		typeInterval: 10 //increases the typing speed
		}); // show true means it displays an electron window

var names = [/*Array of names you want to scrape*/];
var i = 0;
var results = []; 
var completed = []; //not used, to be used later



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
	  	console.log("NAMe: " + name);
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

nightmare
	  .goto('https://www.facebook.com/')
	  .type('input[type="email"]',"Your_username") //enter username
	  .type('input[type="password"]',"your_password" + '\u000d')  // enter password
	  .wait('span._1qv9') //waits for a random element on the page to load(input was not working)
	  .then(() => {
		names.reduce(PromiseAccumulator, Promise.resolve([])).then(function(results){
		    console.dir(results);
		})
		.then(() => {
			return nightmare.end();
		});
	  })
	  .catch(function (error) {
	    console.error('Errororor:', error);
	});
