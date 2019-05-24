var File = require('dw/io/File');
var FConstants = require('~/cartridge/scripts/util/FeedonomicsConstants');


/**
 * Loads files from a given directory that match the given pattern
 * Non recursive.
 * Throws Exception if directory does not exist.
 *
 * @param {String} directoryPath (Absolute) Directory path to load from
 * @param {String} filePattern RegEx pattern that the filenames must match
 *
 * @returns {Array}
 */
function getFiles (directoryPath, filePattern) {
    var directory = new File(directoryPath);

    // We only want existing directories
    if (!directory.isDirectory()) {
        throw new Error('Source folder does not exist.');
    }

    var files = directory.list();

    return files.filter(function (filePath) {
        return empty(filePattern) || (!empty(filePattern) && filePath.match(filePattern) !== null);
    }).map(function (filePath) {
        return directoryPath + File.SEPARATOR + filePath;
    });
}

/**
* This Function creates file name with file name prefix
* @param {String} fileNamePrefix
* @returns {String} fileName
*/
function createFileName(fileNamePrefix, fileExtension) {
    var Site = require('dw/system/Site');
    var siteID = Site.getCurrent().getID();
    var locale = request.getLocale(); //eslint-disable-line no-undef
    if (!fileExtension) {
       fileExtension = FConstants.FILE_EXTENSTION.CSV;
    }
    return fileNamePrefix + "_" + siteID + "_" + locale + "." + fileExtension;
}

/**
 * This function returns file extension based on parameter
 * @param {String} exportFormat Input Job Parameter
 * @returns {String} file name extension
 */
function getFileExtension(exportFormat) {
    if ( exportFormat && exportFormat.toLowerCase() == FConstants.FILE_EXTENSTION.XML) {
        return FConstants.FILE_EXTENSTION.XML;
    } else {
        return FConstants.FILE_EXTENSTION.CSV;
    }
}

module.exports = {
    createFileName     : createFileName,
    getFiles           : getFiles,
    getFileExtension   : getFileExtension
};