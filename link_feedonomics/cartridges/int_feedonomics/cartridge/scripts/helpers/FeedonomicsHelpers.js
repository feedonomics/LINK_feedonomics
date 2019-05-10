'use strict';

var FConstants = require('~/cartridge/scripts/util/FeedonomicsConstants')

/**
* This Function generates header for csv file
* @param exportType Export Type Catalog or Inventory
* @returns {Array} Header Values Array for CSV file
*/
function generateCSVHeader( exportType ) {
    var csvHeaderArray = [];

    if (exportType == FConstants.EXPORT_TYPE.CATALOG) {
        csvHeaderArray.push(FConstants.HEADER_VALUES.ID);
        csvHeaderArray.push(FConstants.HEADER_VALUES.NAME);
        csvHeaderArray.push(FConstants.HEADER_VALUES.TITLE);
        csvHeaderArray.push(FConstants.HEADER_VALUES.DESCRIPTION);
        csvHeaderArray.push(FConstants.HEADER_VALUES.UPC);
        csvHeaderArray.push(FConstants.HEADER_VALUES.IMAGE);
        csvHeaderArray.push(FConstants.HEADER_VALUES.PRODUCT_LINK);
        csvHeaderArray.push(FConstants.HEADER_VALUES.CATEGORY);
        csvHeaderArray.push(FConstants.HEADER_VALUES.MASTER_PRODUCT_ID);
        csvHeaderArray.push(FConstants.HEADER_VALUES.BRAND);
        csvHeaderArray.push(FConstants.HEADER_VALUES.PRICE);
        csvHeaderArray.push(FConstants.HEADER_VALUES.INVENTORY);
        csvHeaderArray.push(FConstants.HEADER_VALUES.LIST_PRICE);
        csvHeaderArray.push(FConstants.HEADER_VALUES.SALE_PRICE);
        csvHeaderArray.push(FConstants.HEADER_VALUES.IN_STOCK);
        csvHeaderArray.push(FConstants.HEADER_VALUES.ADDTIONAL_IMAGE_LINKS);
        csvHeaderArray.push(FConstants.HEADER_VALUES.CUSTOM_FIELDS);
        csvHeaderArray.push(FConstants.HEADER_VALUES.VARIANT_ATTRIBUTES);
        csvHeaderArray.push(FConstants.HEADER_VALUES.PRODUCT_TYPE);
        csvHeaderArray.push(FConstants.HEADER_VALUES.MANUFACTURER_NAME);
        csvHeaderArray.push(FConstants.HEADER_VALUES.MANUFACTURER_SKU);

    } else if (exportType == FConstants.EXPORT_TYPE.INVENTORY) {
           //TODO
    }

    return csvHeaderArray;
}

/**
* This Function creates file name with file name prefix
* @param {String} fileNamePrefix
* @returns {String} fileName
*/
function createFileName(fileNamePrefix,fileExtension) {
    var Calendar = require('dw/util/Calendar');
    var Site = require('dw/system/Site');
    var StringUtils = require('dw/util/StringUtils');
    var DATETIME_FORMAT = 'yyyy-MM-dd_HH-mm-ss-SSS';

    var calendar = new Calendar();
    var siteID = Site.getCurrent().getID();
    return fileNamePrefix + "_" + siteID + "_" + StringUtils.formatCalendar(calendar, DATETIME_FORMAT)+ "." + fileExtension;
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
    generateCSVHeader : generateCSVHeader,
    createFileName    : createFileName,
    getFileExtension  : getFileExtension
};