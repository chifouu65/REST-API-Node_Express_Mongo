const multer = require('multer') // J'importe le package multer

const MIME_TYPES = { // Dictionnaire
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({ // J'enregistre dans le disk
    destination: (req, file, callback) => {
        // Je défini la destination des images qui seront stocker dans le fichier 'images'
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        // Je défini le nom du fichier image
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype]; // L'extention du fichier sera l'élément du dictionnaire correspondant au mimetype du fichier envoyer par le front-end
        callback(null, name + Date.now() + '.' + extension); // Puis je crée le nom du fichier entier à l'aide des constante crée ci-dessus
    }
});

module.exports = multer({
    storage: storage
}).single('image');