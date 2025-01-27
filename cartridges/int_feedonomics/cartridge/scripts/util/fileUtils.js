'use strict';

var File = require('dw/io/File');
var FConstants = require('~/cartridge/scripts/util/feedonomicsConstants');

/**
 * This Function creates file name with file name prefix.
 * @param {string} fileNamePrefix : e.g . export-product
 * @param {string} fileExtension :e.g. csv or xml
 * @returns {string} fileName export-product_siteID_localeID.csv
 */
function createFileName(fileNamePrefix, fileExtension) {
    var Site = require('dw/system/Site');
    var siteID = Site.getCurrent().getID();
    var locale = request.getLocale(); // eslint-disable-line no-undef
    if (!fileExtension) {
        fileExtension = FConstants.FILE_EXTENSTION.CSV; // eslint-disable-line no-param-reassign
    }
    return fileNamePrefix + '_' + siteID + '_' + locale + '.' + fileExtension;
}

/**
 * This Function creates file name with file name prefix
 * @param {string} fileNamePrefix : e.g . export-inventory
 * @param {string} fileExtension :e.g. csv or xml
 * @returns {string} fileName export-inventory_siteID.csv
 */
function createInventoryFeedFileName(fileNamePrefix, fileExtension) {
    var Site = require('dw/system/Site');
    var siteID = Site.getCurrent().getID();
    if (!fileExtension) {
        fileExtension = FConstants.FILE_EXTENSTION.CSV; // eslint-disable-line no-param-reassign
    }
    return fileNamePrefix + '_' + siteID + '.' + fileExtension;
}

/**
 * Loads files from a given directory that match the given pattern
 *
 * @param {string} sourceFolder Directory path to load from
 * @param {string} filePattern RegEx pattern that the filenames must match
 *
 * @returns {Array} files present at source folder
 */
function getExistingFiles(sourceFolder, filePattern) {
    var directory = new File(sourceFolder);

    if (!directory.isDirectory()) {
        throw new Error('Source Folder is not available.Please provide valid one.');
    }

    var exitingFiles = directory.list();

    return exitingFiles.filter(function (path) {
        return !filePattern || (filePattern && path.match(filePattern) !== null);
    }).map(function (path) {
        return sourceFolder + File.SEPARATOR + path;
    });
}

/**
 * This function returns file extension based on parameter
 * @param {string} exportFormat Input Job Parameter
 * @returns {string} file name extension
 */
function getFileExtension(exportFormat) {
    if (exportFormat && exportFormat.toLowerCase() === FConstants.FILE_EXTENSTION.XML) {
        return FConstants.FILE_EXTENSTION.XML;
    }
    return FConstants.FILE_EXTENSTION.CSV;
}

/**
 * @desc Remove all files and sub folders
 * @param {dw.io.File} sourceFolder - Clear Source Folder Files
 */
function removeFilesFromFolder(sourceFolder) {
    if (!sourceFolder.exists()) {
        return;
    }
    var filesList = sourceFolder.listFiles(function (file) {
        return file.exists();
    });
    var filesIterator = filesList.iterator();

    while (filesIterator.hasNext()) {
        var file = filesIterator.next();

        if (file.file) {
            file.remove();
        } else if (file.directory) {
            removeFilesFromFolder(file);
            file.remove();
        }
    }
}

module.exports = {
    createFileName: createFileName,
    getExistingFiles: getExistingFiles,
    getFileExtension: getFileExtension,
    createInventoryFeedFileName: createInventoryFeedFileName,
    removeFilesFromFolder: removeFilesFromFolder
};
