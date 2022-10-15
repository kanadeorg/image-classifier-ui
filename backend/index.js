const express = require('express');
const app = express();

const fs = require('fs');

const randomFile = require('select-random-file');

const cors = require('cors');

app.use(cors({
    origin: '*'
}));

let configs = JSON.parse(fs.readFileSync('../public/configs.json'));

function getFileExtension(fileName){
    var  fileExtension;
    fileExtension = fileName.replace(/^.*\./, '');
    return fileExtension;
}

function getFileNameWithoutExtension(filename){
    return filename.substr(0, filename.lastIndexOf("."))
}

function isImage(fileName){
    var fileExt = getFileExtension(fileName);
    var imagesExtension = ["png", "jpg", "jpeg"];
    if(imagesExtension.indexOf(fileExt) !== -1){
        return true;
    } else{
        return false;
    }
}

app.use('/img', express.static(configs.image_folder));

const getRandomImage = (callback) => {
    return randomFile(configs.image_folder, (err, file) => {
        if(err) return err;
        if (file === undefined) return callback();
        if (isImage(file)) return callback(file);
        return getRandomImage(callback);
    });
}

app.get('/get_image', (req, res) => {
    getRandomImage((img) => {
        if (img === undefined) return res.sendStatus(404);
        console.log(`Got image ${img}`);
        res.json({filename: img});
    })
})

app.put('/set_image', (req, res) => {
    const imgName = req.query.img;
    const imgClass = req.query.class;
    console.log(imgName, imgClass);
    if (!fs.existsSync(`${configs.image_folder}/${imgName}`)) {
        return res.sendStatus(404);
    }
    fs.rename(`${configs.image_folder}/${imgName}`, `${configs.image_folder}/${imgClass}/${imgName}`, (err) => {
        if (err && err.code == "ENOENT") {
            fs.mkdirSync(`${configs.image_folder}/${imgClass}`);
            fs.renameSync(`${configs.image_folder}/${imgName}`, `${configs.image_folder}/${imgClass}/${imgName}`);
        } else if (err) {
            throw err;
        }
        const txtFileName = `${getFileNameWithoutExtension(imgName)}.txt`
        console.log(txtFileName);
        if (fs.existsSync(`${configs.image_folder}/${txtFileName}`)) {
            fs.renameSync(`${configs.image_folder}/${txtFileName}`, `${configs.image_folder}/${imgClass}/${txtFileName}`)
        }
        console.log(`${configs.image_folder}/${imgName} was copied to ${configs.image_folder}/${imgClass}/${imgName}`);
        return res.sendStatus(202)
    });
})

app.listen(configs.api_server_port, () => {
    console.log(`backend is listening on ${configs.api_server_port}`)
})