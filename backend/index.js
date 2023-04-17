const express = require('express');
const app = express();

const fs = require('fs');

const randomFile = require('select-random-file');
const { translate } = require('free-translate');

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

function isAudio(filename){
    var fileExt = getFileExtension(filename);
    var audioExtension = ["ogg", "mp3", "wav"];
    if(audioExtension.indexOf(fileExt) !== -1){
        return true;
    } else{
        return false;
    }
}

app.use('/api/img', express.static(configs.image_folder));
app.use('/api/audio', express.static(configs.audio_foler));

const getRandomImage = (callback, depth=5) => {
    if (depth === 0) return callback();
    return randomFile(configs.image_folder, (err, file) => {
        if(err) return err;
        if (file === undefined) return callback();
        if (isImage(file)) return callback(file);
        return getRandomImage(callback, depth=depth-1);
    });
}

const getRandomAudio = (callback, depth=5) => {
    if (depth === 0) return callback();
    return randomFile(configs.audio_foler, (err, file) => {
        if(err) return err;
        if (file === undefined) return callback();
        console.log(file)
        if (isAudio(file)) return callback(file);
        return getRandomAudio(callback, depth=depth-1);
    });
}

app.get('/api/get_image', (req, res) => {
    getRandomImage((img) => {
        if (img === undefined) return res.sendStatus(404);
        console.log(`Got image ${img}`);
        const txtFileName = `${getFileNameWithoutExtension(img)}.txt`
        let description = "";
        if (fs.existsSync(`${configs.image_folder}/${txtFileName}`)) {
            description = fs.readFileSync(`${configs.image_folder}/${txtFileName}`, 'utf8')
        }
        if (!configs.translate || !description) {
            return res.json({filename: img, description: description});
        }
        return (async () => {
            const translatedText = await translate(description.replaceAll('_', ' '), { from: 'en', to: 'zh-CN'})
            console.log(translatedText);
            return res.json({filename: img, description: description, translatedText: translatedText});
        })()
    })
})

app.put('/api/set_image', (req, res) => {
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


app.get('/api/get_audio', (req, res) => {
    getRandomAudio((au) => {
        if (au === undefined) return res.sendStatus(404);
        console.log(`Got audio ${au}`);
        const txtFileName = `${getFileNameWithoutExtension(au)}.txt`
        let description = "";
        if (fs.existsSync(`${configs.image_folder}/${txtFileName}`)) {
            description = fs.readFileSync(`${configs.image_folder}/${txtFileName}`, 'utf8')
        }
        if (!configs.translate || !description) {
            return res.json({filename: au, description: description});
        }
        return (async () => {
            const translatedText = await translate(description.replaceAll('_', ' '), { from: 'en', to: 'zh-CN'})
            console.log(translatedText);
            return res.json({filename: au, description: description, translatedText: translatedText});
        })()
    })
})

app.put('/api/set_audio', (req, res) => {
    var m = new Date();
    var dateString = m.getUTCFullYear() +"-"+ (m.getUTCMonth()+1) +"-"+ m.getUTCDate() + "T" + m.getUTCHours() + "-" + m.getUTCMinutes() + "-" + m.getUTCSeconds();
    console.log(dateString);
    const audioName = req.query.audio;
    const audioClass = req.query.class;
    console.log(audioName, audioClass);
    if (!fs.existsSync(`${configs.audio_foler}/${audioName}`)) {
        return res.sendStatus(404);
    }
    fs.rename(`${configs.audio_foler}/${audioName}`, `${configs.audio_foler}/${audioClass}/${dateString}-${audioName}`, (err) => {
        if (err && err.code == "ENOENT") {
            fs.mkdirSync(`${configs.audio_foler}/${audioClass}`);
            fs.renameSync(`${configs.audio_foler}/${audioName}`, `${configs.audio_foler}/${audioClass}/${dateString}-${audioName}`);
        } else if (err) {
            throw err;
        }
        const txtFileName = `${getFileNameWithoutExtension(audioName)}.txt`
        console.log(txtFileName);
        if (fs.existsSync(`${configs.audio_foler}/${txtFileName}`)) {
            fs.renameSync(`${configs.audio_foler}/${txtFileName}`, `${configs.audio_foler}/${audioClass}/${dateString}-${txtFileName}`)
        }
        console.log(`${configs.audio_foler}/${audioName} was copied to ${configs.audio_foler}/${audioClass}/${dateString}-${audioName}`);
        return res.sendStatus(202)
    });
})

app.listen(configs.api_server_port, () => {
    console.log(`backend is listening on ${configs.api_server_port}`)
})