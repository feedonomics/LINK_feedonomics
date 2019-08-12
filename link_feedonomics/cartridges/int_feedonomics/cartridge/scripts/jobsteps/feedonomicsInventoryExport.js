/* Feedonomics Inventory Export Job */
'use strict';

var Logger = require('dw/system/Logger');
var Status = require('dw/system/Status');
var File = require('dw/io/File');

var FeedonomicsHelpers = require('~/cartridge/scripts/helpers/feedonomicsHelpers');
var FileUtils = require('~/cartridge/scripts/util/fileUtils');
var FConstants = require('~/cartridge/scripts/util/feedonomicsConstants');

var productsIter;
var fileWriter;
var headerColumn;
var csvWriter;
var chunks = 0;
var processedAll = true;
var skipMaster = false;
var availableOnly = false;

/**
 * Adds the column value to the CSV line Array of Inventory Feed export CSV file
 * @param {dw.catalog.Product} product - SFCC Product
 * @param {Array} csvProductArray - CSV  Array
 * @param {Object} columnValue - Catalog Feed Column

 */
function writeInventoryExportField(product, csvProductArray, columnValue) {
    switch (columnValue) {
        // Product ID
        case FConstants.HEADER_VALUES.ID:
            csvProductArray.push(product.ID || '');
            break;
        // Product's Base Price
        case FConstants.HEADER_VALUES.PRICE:
            csvProductArray.push(product.priceModel.price);
            break;
        // Product's ATS value
        case FConstants.HEADER_VALUES.INVENTORY:
            csvProductArray.push(FeedonomicsHelpers.getATSValue(product));
            break;
        // Product's Price BOOK Prices
        case FConstants.HEADER_VALUES.BOOKPRICE:
            csvProductArray.push(FeedonomicsHelpers.calculateAllPriceBooksPrices(product));
            break;
        // Product's Promotional Price
        case FConstants.HEADER_VALUES.PROMOPRICE:
            csvProductArray.push(FeedonomicsHelpers.calculatePromoPrice(product));
            break;
        // Product's In Stock
        case FConstants.HEADER_VALUES.IN_STOCK:
            csvProductArray.push(FeedonomicsHelpers.getAvailabilityStatus(product));
            break;
        // Product's ALL Type
        case FConstants.HEADER_VALUES.PRODUCT_TYPE:
            csvProductArray.push(FeedonomicsHelpers.getAllProductTypes(product));
            break;
        // Product's Online Status
        case FConstants.HEADER_VALUES.ONLINE:
            csvProductArray.push(FeedonomicsHelpers.getOnlineStatus(product));
            break;
        default:
            csvProductArray.push('');
            break;
    }
}

/**
 * Executed Before Processing of Chunk and Validates all required fields
 */
exports.beforeStep = function () {
    var args = arguments[0];

    var targetFolder = args.TargetFolder;

    if (!targetFolder) {
        throw new Error('One or more mandatory parameters are missing.');
    }

    if (args.SkipMaster) {
        skipMaster = args.SkipMaster;
    }

    if (args.AvailableOnly) {
        availableOnly = args.AvailableOnly;
    }

    var FileWriter = require('dw/io/FileWriter');
    var CSVStreamWriter = require('dw/io/CSVStreamWriter');
    var fileName = FileUtils.createInventoryFeedFileName((args.FileNamePrefix || FConstants.FILE_NAME.INVENTORY));
    var folderFile = new File(File.getRootDirectory(File.IMPEX), targetFolder);
    if (!folderFile.exists() && !folderFile.mkdirs()) {
        Logger.info('Cannot create IMPEX folders {0}', (File.getRootDirectory(File.IMPEX).fullPath + targetFolder));
        throw new Error('Cannot create IMPEX folders.');
    }
    var csvFile = new File(folderFile.fullPath + File.SEPARATOR + fileName);
    fileWriter = new FileWriter(csvFile);
    csvWriter = new CSVStreamWriter(fileWriter);
    // Push Header
    headerColumn = FeedonomicsHelpers.generateCSVHeader(FConstants.EXPORT_TYPE.INVENTORY);
    csvWriter.writeNext(headerColumn);
    // Push Products
    var ProductMgr = require('dw/catalog/ProductMgr');
    productsIter = ProductMgr.queryAllSiteProducts();
};

/**
 * Executed Before Processing of Chunk and Return total products processed
 * @returns {number} products count
 */
exports.getTotalCount = function () {
    Logger.info('Processed products {0}', productsIter.count);
    return productsIter.count;
};

/**
 * Returns a single product to processed
 * @returns {dw.catalog.Product} product
 */
exports.read = function () { // eslint-disable-line consistent-return
    if (productsIter.hasNext()) {
        return productsIter.next();
    }
};

/**
 * Process product and returns required field in array
 * @param {dw.catalog.Product} product - Product
 * @returns {Array} csvProductArray : Product Details
 */
exports.process = function (product) { // eslint-disable-line consistent-return
    try {
        if ((!skipMaster || !product.isMaster()) && (!availableOnly || FeedonomicsHelpers.getAvailabilityStatus(product))) {
            var csvProductArray = [];
            headerColumn.forEach(function (columnValue) { // eslint-disable-line
                writeInventoryExportField(this, csvProductArray, columnValue);
            }, product);
            return csvProductArray;
        }
    } catch (ex) {
        processedAll = false;
        Logger.info('Not able to process product {0} having error : {1}', product.ID, ex.toString());
    }
};

/**
 * Writes a single product to file
 * @param {dw.util.List} lines to write
 */
exports.write = function (lines) {
    for (var i = 0; i < lines.size(); i++) {
        csvWriter.writeNext(lines.get(i).toArray());
    }
};

/**
 * Executes after processing of every chunk
 */
exports.afterChunk = function () {
    chunks++;
    Logger.info('Chunk {0} processed successfully', chunks);
};

/**
 * Executes after processing all the chunk and returns the status
 * @returns {dw.system.Status} OK || ERROR
 */
exports.afterStep = function () {
    productsIter.close();
    fileWriter.flush();
    csvWriter.close();
    fileWriter.close();
    if (processedAll) {
        Logger.info('Export Inventory Feed Successful');
        return new Status(Status.OK, 'OK', 'Export Inventory Feed Successful');
    }
    throw new Error('Could not process all the products');
};
