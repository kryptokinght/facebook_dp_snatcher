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
//var names = [" AHONA MITRA","AYANTIKA MONDAL","Tiasa Das"];
var names = ["SHREYA SRIVASTAVA","ABHILASHA KUMARI"," JYOTI KUMARI"," ASHA KUMARI"," PRAGATI SINGH"," ANSHU KUMARI","SHRAMANA SAHA","PRIYANKA ROY CHOUDHURY","SAHELI DAS NEOGI"," ROHEY CAMARA"," AKSHYA SWAMI","RICHA SINGH CHAUHAN"," POULOMEE ROY"," VARTIKA ARORA"," MEGHLA MAJI"," ISHANI NAG","SONALI SWETA PADMA","MALLIDI GEETA MADHURI","CHAYANIKA POREL","RASHMUNI HANSDA"," POULOMI HORE"," PARINITA MITRA","JAGGAVARAPU MOUNIKA"];
var names2 = ["GUDIDODDI TRIVENI","SAMPRITI MONDAL"," SHWETA MODAK","PALLE RAMYA SREE","SHRABASTI MONDAL"," RAKHI MONDAL","KAMBATHULA PREETHI RISHITHA","SAYARI MUKHERJEE"," SIMA LAYEK","TENZING NGAWANG BHUTIA","PAL OINDRILA PRABIR"," SHIPRA SONALI"," SAYONI SAHA"," SAYANTI DEY"," NISHA BHARTI"," ANKITA MISRA","ANANDI BATABYAL","MOUCHANDRA PAUL","AJMIRA MAMATHA"," ADIPTI SUBBA","SHUBHAMITRA DATTA"," ANJALI JAISWAL","SWARNALI BANERJEE"," DIVYA SINGH","MEDHA MAJUMDAR","APOORVA DWIVEDI"," G SNEHA RAO"," SHREYA PALIT"," KALPNA SINGH","POTHUMUDI SIREESHA"," MEHENDI BASU","TAREETA BISWAS","ADRIJA BHOWMIK","SHWETA SHARMA","KANGANA PARSOYA","VEMULA AKSHARA","ARCHITA SARKAR","RIYA RAJESH WAGHMARE"," KIRTI GUPTA"," DEBLEENA SEN","DEBLINA TALUKDAR"," RUCHI SINGH","NATHI SUCHITHRA REDDY","KARUTURI JYOTHI SANTOSHI","VARTIKA SHARMA","PALLABI MONDAL"," SAYANTANI DAS"," ANTIMA RAI","SRISHTI BHANDARI"," RITWIKA DAS"," APURVA SINGH"," ADITI ANAND"," SMRITI ANAND"," SENJUTI BALA","SAMRIDDHI GUPTA"," TEETAS ROY"," RITIKA DAS"," DISHA DHAR","TANUSHREE MONDAL"," SUSHMA KUMARI"," SMITA MONDAL","HARSHA PRIYADARSHINI","MONALISA GORAIN","JONNALAGADDA ANISHA RAO"," ANANYA GHOSH"," KABERI SARKAR","ARADHNA LAMA YOLMO"," BIDIPTA GHOSH","SUMEDHA BHATTACHARYY A"," PRITHA DUTTA","NIKKALA ANUSHACHANDR IKA","POLAKI SRIKAVYA","TRISHAA BHATTACHARYA"," SANCHARI PAUL","SUBHRANSHI RAJPUT","PROKRITI MONALINA","KONDAPALLI SRAVANI","JANA MEENA KUMARI"," TIASHA BISWAS"," SANHITA PAL","GULNAZ PARWEEN"," KAVITA BODRA"," ANKITA SARKAR"];
var i = 0;
var results = [];
var completed = [];



function PromiseAccumulator(accumulator, name) {
	return accumulator.then(function(results) {
	return nightmare
	  .goto('https://www.facebook.com/')
	  .wait('input[type="text"]')
	  //.wait('span.uiIconText._5qtp')
	  .type('input[type="text"]',name + '\u000d' + '\u000d')
	  .wait('a._1ii5._2yez') //waits for the first search result to load
	  .click('a._1ii5._2yez')
	  .wait('ul._6_7.clearfix > li:nth-child(4) > ._6-6') //wait for thephotos button to load
	  .click('ul._6_7.clearfix > li:nth-child(4) > ._6-6') // click on photos button
	  /**********************NEED to check if the page has an albums button or not**********/
	  .wait(1000)
	  .evaluate(() => {
	  	let album_button = document.querySelector('div._3dc :nth-child(3) > :nth-child(1)');
	  	if(album_button != null)
	  		return true;
	  	else
	  		return false;
	  })
	  .then((albumButttonStatus) => {
	  	if(albumButttonStatus) {
	  		return nightmare
	  		  .click('div._3dc :nth-child(3) > :nth-child(1)') // click on albums button
			  .wait(5000) //wait for the html to load otherwise it will not be able to look for table below
			  .evaluate(() => { //find src of image
			  		function getSrc() {
			  			let match = 0;
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
							}, 2000);
					    });
					   return promise;
					} //end of function getSrc()

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
				}) //evaluate ends here
			  	.then((img_src) => {
			  		return img_src;
			  	})// the return from this then will go to the outer then as 'result'
	  	} //when album button is present
	  	else {
	  		return null;
	  	} //when album button is absent
	  }) //end of then (albumButtonStatus)
	  .then(function(result){
	  	let person = {};
	  	person.name = name;
	  	person.url = result;
	  	console.log(name);
	  	console.log(result);
	    results.push(person);
	    completed.push(name);
		fs.writeFile('female_final1.txt', JSON.stringify(results), (err) => {
			console.log(err);
		});
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
		names.reduce(PromiseAccumulator, Promise.resolve([])).then(function(results){
		    console.dir(results);
		    console.log(completed);
		})
		.then(() => {
			return nightmare.end();
		});
	  })
	  .catch(function (error) {
	    console.error('Errororor:', error);
	});
});
