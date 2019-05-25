var File = require('dw/io/File');
var FConstants = require('~/cartridge/scripts/util/FeedonomicsConstants');

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
 * Loads files from a given directory that match the given pattern
 *
 * @param {String} sourceFolder Directory path to load from
 * @param {String} filePattern RegEx pattern that the filenames must match
 *
 * @returns {Array}
 */
function getExistingFiles (sourceFolder, filePattern) {
    var directory = new File(sourceFolder);

    if (!directory.isDirectory()) {
        throw new Error('Source Folder is not available.Please provide valid one.');
    }

    var exitingFiles = directory.list();

    return exitingFiles.filter(function (path) {
        return empty(filePattern) || (!empty(filePattern) && path.match(filePattern) !== null);
    }).map(function (path) {
        return sourceFolder + File.SEPARATOR + path;
    });
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
    getExistingFiles   : getExistingFiles,
    getFileExtension   : getFileExtension
};