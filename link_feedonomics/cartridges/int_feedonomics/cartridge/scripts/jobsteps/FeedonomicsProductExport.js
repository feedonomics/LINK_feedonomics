/* Feedonomics Product Export Job */
'use strict';

var Logger = require('dw/system/Logger');
var Status = require('dw/system/Status');
var File = require('dw/io/File');

var FeedonomicsHelpers = require('~/cartridge/scripts/helpers/FeedonomicsHelpers');
var FConstants = require('~/cartridge/scripts/util/FeedonomicsConstants');

/**
 * Exports All Site Products in param.TargetFolder or src/feedonomics/catalog (default) folder.
 * @param args - Job Parameters
 * @returns {dw.system.Status} - SFCC Status
 */
var exportProducts = function exportProducts() { // eslint-disable-line
    var args = arguments[0];
    var targetFolder = args.TargetFolder;
    var fileExtension = FeedonomicsHelpers.getFileExtension(args.ExportFormat);

    if (!targetFolder) {
        return new Status(Status.ERROR, 'ERROR', 'One or more mandatory parameters are missing.');
    }
    var FileWriter = require('dw/io/FileWriter');
    var CSVStreamWriter = require('dw/io/CSVStreamWriter');
    var fileName = FeedonomicsHelpers.createFileName((args.FilenamePrefix || FConstants.FILE_NAME.CATALOG),fileExtension);
    var folderFile = new File(File.getRootDirectory(File.IMPEX),targetFolder);
    if (!folderFile.exists() && !folderFile.mkdirs()) {
        throw new Error('Cannot create IMPEX folders {0}', (File.getRootDirectory(File.IMPEX).fullPath + args.TargetFolder));
    }
    var csvFile = new File(folderFile.fullPath + File.SEPARATOR + fileName);
    var fileWriter = new FileWriter(csvFile);
    var csvWriter = new CSVStreamWriter(fileWriter);
    //Push Header
    csvWriter.writeNext(FeedonomicsHelpers.generateCSVHeader(FConstants.EXPORT_TYPE.CATALOG));
    csvWriter.close();
    fileWriter.close();
    return new Status(Status.OK);
}

exports.ExportProducts = exportProducts;