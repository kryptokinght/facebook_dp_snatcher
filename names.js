/*var pdfUtil = require('pdf-to-text');
var fs = require('fs');
var pdf_path = "names.pdf";
 
//option to extract text from page 0 to 10 
var option = {from: 0, to: 37};
 
pdfUtil.pdfToText(pdf_path, option, function(err, data) {
  if (err) throw(err);
  fs.writeFile('message.txt', data, (err) => {
	if (err) throw err;
	console.log('The file has been saved!');	
  });
  //console.log(data);     
});
*/ 
var fs = require('fs');


function hasNumber(myString) {
  return /\d/.test(myString);
}

function flatten(array) {
  return array.reduce(function(acc, e) {
    //console.log(acc);
    if(array.indexOf(acc) == 1) {
      //console.log("Adasda");
    }
      //acc = flatten(acc);
    if(check_dim(e)) 
      return acc.concat(flatten(e)) 
    else {
      if(!Array.isArray(acc))
        acc = acc.toString().split('').map(Number);
      return acc.concat(e);
    }
  })
}

function check_dim(array) {
  for(let i = 0; i < array.length; i++)
    if(Array.isArray(array[i]))
      return true;
  return false;
}

const reducer = (accumulator, currentValue) => accumulator + " " + currentValue;

function readFilePromise(fileSrc) {
	var promise = new Promise((resolve, reject) => {
		fs.readFile(fileSrc, 'utf8', (err, data) => {
			resolve(data);
		});
	});
	return promise;
}

readFilePromise("message.txt").then((data) => {
	let start = 0, laststart = 0;
	var namList = [], name = [];
	var isName = true, count = 0, title = false, isHead = false;
	start = data.indexOf('\n');
	while(start != -1) {
		let line = data.substring(laststart, start);
		let temp = line.split(' ');
		var words = [];
		let words_len = 0;
		for (var w in temp) {
			if(temp[w] != '') {
				if(!hasNumber(temp[w]))
				words.push(temp[w]);
			}
		}
		if(/CHALLA/.test(words[0])  || /BHAVANARAYAN/.test(words[0]))
			{}
		else {
			words_len = words.length;
			if(words[0] == '\f') {
				words = words.slice(1,words_len);
				words_len--;
			}
			//console.log(words);
			if(words_len == 0) {}
			else if( words_len <= 3 && title == false) {
				if(isName) {
					namList.push(name);
					name = [];
				}
				//console.log('Head ' + words);
				isName = true;
				isHead = true;
				title = true;
				name.push(words);
			}
			else if(words_len <= 3 && title == true) {
				//console.log('title ' + words);
				isName = false;
				isHead = false;
				title = false;
				name.push(words);
			} 
			else if(words_len >= 6 && !(/LEM/.test(words[0])) && isName != true) {
				//console.log("full name " + words);
				title = false;
				isName = false;
				name.push(words);
			}
			else if(words_len > 2 && isName == true) {
				//console.log("body " + words);
				name.push(words);
			}

			if(isName == false) {
				namList.push(name);
				name = [];
			}
		}
		laststart = start + 1;
		start = data.indexOf('\n', laststart);
	} 
	//console.log(namList);
	let names = [];
	for(let i = 0; i < namList.length; i++) {
		let temp = [];
		if(namList[i].length == 1) { //works fine
			//console.log(namList[i]);
			let name = "", len = namList[i][0].length;
			for(let j = 0; j <len-4; j++) {
				name = name + " " + namList[i][0][j];
			}
			temp.push(name);
			temp.push(namList[i][0][len-4]);
			temp.push(namList[i][0][len-3]);
		}
		else if(namList[i].length == 2) { 
			//gone case includes some large south indian names(not needed in this crawler)
		}
		else if(namList[i].length == 3) { //works fine too
			//console.log(namList[i]);
			let name = namList[i][0].reduce(reducer);
			if(namList[i][1].length > 4)
				name = name + " " + namList[i][1][0];
			name = name + " " + namList[i][2].reduce(reducer);
			let findBracket = name.indexOf('(');
			if(findBracket != -1) {
				name = name.slice(0, findBracket);
			}
			temp.push(name);
			if(namList[i][1].length > 4) {
				temp.push(namList[i][1][1]);
				temp.push(namList[i][1][2]);

			}
			else {
				temp.push(namList[i][1][0]);
				temp.push(namList[i][1][1]);
			}
		}
		if(temp.length != 0)
		names.push(temp);
	}
	console.log(names);
	//now store the names inside a text file
	return names;

}).then((names) => {
	fs.writeFile('namesList.txt', JSON.stringify(names), (err) => {
		console.log(err);
	});
	let females = [];
	for(let i = 0; i < names.length; i++) {
		if(names[i][2] == 'F' && /B.Tech/.test(names[i][1]))
			females.push(names[i][0]);
	}
	console.log(females);
	fs.writeFile('females.txt', JSON.stringify(females), (err) => {
		console.log(err);
	});
});

//END of PROGRAM
