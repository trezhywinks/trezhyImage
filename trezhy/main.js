const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 4040;

mongoose.connect("mongodb+srv://trezhy:lWn7NInsHxJtoOG5@cluster0.oedzme4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected!"))
.catch(err => console.error("Erro:", err));

const imageSchema = new mongoose.Schema({
    name: String,
    image: Buffer,
    contentType: String,
    date: { type: Date, default: Date.now }
});

const Image = mongoose.model("Image", imageSchema);


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/t", upload.single("image"), async (req, res) => {
    try {
        const newImage = new Image({
            name: req.body.name,
            image: req.file.buffer,
            contentType: req.file.mimetype
        });
        await newImage.save();

        res.json({
            mensagem: "Sucess!",
            url: `https://trezhy.onrender.com/imagens/${newImage._id}.png`,
            idserver: newImage._id
        });
    } catch (error) {
        res.status(500).json({ mensagem: "Erro" });
    }
});


app.get("/imagens/:id.png", async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) return res.status(404).json({ mensagem: "Erro" });
        res.contentType(image.contentType);
        res.send(image.image);
    } catch (error) {
        res.status(500).json({ mensagem: "Erro" });
    }
});

app.get("/you/:id", async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) return res.status(404).json({ mensagem: "Erro" });
        
        const imageBase64 = image.image.toString("base64");
        const imageSrc = `data:${image.contentType};base64,${imageBase64}`;
        
        res.send(`
            <!DOCTYPE html>
            <!--
 _                      
| |_ _ __ ___ _____   _ 
| __| '__/ _ \_  / | | |
| |_| | |  __// /| |_| |
 \__|_|  \___/___|\__, |
                   |___/ 
[-] server trezhy image
[-] version : 0.0.1 / 1.0.0
-->
            <html lang="en-US">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Welcome to Trezhy"/>
    <meta name="og:description" content="Welcome to Trezhy"/>
    <meta name="og:url" content=""/>
    <meta name="og:title" content="${image.name}"/>
    <meta name="og:image" content="https://trezhy.onrender.com/imagens/${image._id}.png">
    <meta property="og:image" content="https://trezhy.onrender.com/imagens/${image._id}.png" />
    <meta property="og:image:secure_url" content="https://trezhy.onrender.com/imagens/${image._id}.png" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="400" />
    <meta property="og:image:height" content="300" />
    <meta property="og:image:alt" content="Not for Drugs" />
    <link rel="icon" type="image/png" href="https://trezhy.onrender.com/icon_2x/" sizes="32x32">
    <link rel="shortcut icon" href="https://trezhy.onrender.com/icon/" type="image/x-icon">
                <title>${image.name}</title>
            </head>
            <body> 
            <style>
            @font-face{
    font-family: tre;
    src: url('https://trezhy.onrender.com/fonts');
}
            .servercentercarr{width: 100%; margin: 0 auto 10px; padding: 10px; text-align: center;}
@media(max-width: 999px){.servercentercarr{width: 90%;}}
body{color: #fff; background: #000; font-family: tre; font-weight: 600; font-size: 35px;}
            </style>
            <div class="servercentercarr">
                <h1>${image.name}</h1>
                <img src="${imageSrc}" alt="${image.name}" width="100%"/>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).json({ mensagem: "Erro" });
    }
});

app.use(bodyParser.json());
app.use(express.static('./trezhy/pay'));

app.get('/server', (req, res) => {
    res.sendFile(__dirname +  '/pay/index.html');
})

app.get('/fonts', (req, res) => {
    res.sendFile(__dirname + '/pay/fonts/Amatic\ SC-regular.ttf')
})

app.get('/icon_2x', (req, res) => {
    res.sendFile(__dirname + '/pay/image/favicon_2x.png');
})

app.get('/icon', (req, res) => {
    res.sendFile(__dirname + '/pay/image/favicon.png');
})

app.get('/server', (req, res) => {
    res.sendFile(__dirname +  '/ui/style.css');
})

app.listen(port, () => {
    console.log("port =>", port)
})