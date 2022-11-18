const multer = require('multer')

const MIME_TYPES = { // types MIME acceptés
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

/**
 * Configuration de multer pour enregistrer les fichiers entrants dans le dossier images
 */
const storage = multer.diskStorage({ // J'enregistre dans le disk
    destination: (req, file, callback) => {
        // Je défini la destination des images qui seront stocker dans le fichier 'images'
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype]; // L'extention du fichier sera l'élément du dictionnaire correspondant au mimetype du fichier envoyer par le front-end
        const filename = file.fieldname + '_' + Date.now() + '.' + extension;
        callback(null, filename); // Puis je crée le nom du fichier entier à l'aide des constante crée ci-dessus
    }
});

module.exports = multer({
    storage: storage
}).single('image');