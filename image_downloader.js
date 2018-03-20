const download = require('image-downloader')
const fs = require('fs') 
// Download to a directory and save with the original filename
/*const options = {
  url: 'https://scontent.fbom4-2.fna.fbcdn.net/v/t1.0-0/p417x417/18301288_1346565462091863_6532501301566105197_n.jpg?oh=9fcd6974845ccb1734f93f16db68cdd1&oe=5B466C12',
  dest: 'images/' + "AHONA MITRA" + '.jpg'                  // Save to /path/to/dest/image.jpg
}
 
download.image(options)
  .then(({ filename, image }) => {
    console.log('File saved to', filename)
  }).catch((err) => {
    throw err
  })
*/
  function readFilePromise(fileSrc) {
	var promise = new Promise((resolve, reject) => {
		fs.readFile(fileSrc, 'utf8', (err, data) => {
			resolve(data);
		});
	});
	return promise;
}

let final_list = [];
readFilePromise('female_final.txt').then((data) => {
	//console.log(JSON.parse(data));
	final_list = final_list.concat(JSON.parse(data));
	return readFilePromise('female_final1.txt');
}).then((data) => {
	//console.log(JSON.parse(data));
	final_list = final_list.concat(JSON.parse(data));
	return readFilePromise('female_final2.txt');
}).then((data) => {
	//console.log(JSON.parse(data));
	final_list = final_list.concat(JSON.parse(data));
	return final_list;
}).then((data) => {
	console.log(final_list);
})
