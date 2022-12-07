const multer = require('multer')
/**
 * Permet de gerer le chemin de stockage des images
 * et de les renommer avec un nom unique
 */
const MIME_TYPES = { // types MIME acceptés
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

/**
 * @type {DiskStorage} storage - Multer storage configuration
 * @function destination - The destination folder
 * @function filename - The filename (with the extension)
 */
const storage = multer.diskStorage({ // save in disk
  destination: (req, file, callback) => {
    callback(null, 'images')
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype]; // L'extention du fichier sera l'élément du dictionnaire correspondant au mimetype du fichier envoyer par le front-end
    const filename = file.fieldname + '_' + Date.now() + '.' + extension;
    callback(null, filename);
  }
});

module.exports =
  multer({
      storage: storage
    }
  ).single('image')
;
