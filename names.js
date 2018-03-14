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
fs.readFile('message.txt', 'utf8', function(err, data) {
	let start = 0, laststart = 0;
	var namList = [], name = [];
	var isName = true, count = 0, title = false;
	start = data.indexOf('\n');
	while(start != -1) {
		let line = data.substring(laststart, start);
		let temp = line.split(' ');
		var words = [];
		for (var w in temp) {
			if(temp[w] != '') {
				if(!hasNumber(temp[w]))
				words.push(temp[w]);
			}
		}
		if(words.length == 0) {}
		else if( words.length <= 2 && title == false) {
			console.log('Head ' + words);
			isName = true;
			title = true;
			name.push(words);
		}
		else if(words.length <= 2 && title == true) {
			//console.log('title ' + words);
			isName = false;
			title = false;
			name.push(words);
		} 
		else if(words.length >= 6 ) {
			//console.log("full name " + words);
			title = false;
			isName = false;
			name.push(words);
		}
		else if(words.length > 2 && isName == true) {
			//console.log("body " + words);
			name.push(words);
		}

		if(isName == false) {
			namList.push(name);
			name = [];
		}
		//console.log(words);
		laststart = start + 1;
		start = data.indexOf('\n', laststart);
	} 
	//console.log(namList);
	for(let i = 0; i < namList.length; i++) {
		let temp = [];
		if(namList[i].length == 3) {
			console.log(namList[i]);
			let name = namList[i][0].reduce(reducer);
			name = name + " " + namList[i][2].reduce(reducer);
			console.log(name)
		}
	}
});

function hasNumber(myString) {
  return /\d/.test(myString);
}

function flatten(array) {
  return array.reduce(function(acc, e) {
    console.log(acc);
    if(array.indexOf(acc) == 1) {
      console.log("Adasda");
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