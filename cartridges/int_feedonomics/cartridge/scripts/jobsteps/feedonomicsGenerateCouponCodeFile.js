/* Feedonomics Generate Coupon Code XMLs Job */

'use strict';

var Logger = require('dw/system/Logger');
var Status = require('dw/system/Status');
var File = require('dw/io/File');

var FileUtils = require('~/cartridge/scripts/util/fileUtils');
var FConstants = require('~/cartridge/scripts/util/feedonomicsConstants');

/**
 * Executed Before Processing of Chunk and Validates all required fields
 * @returns {dw.system.Status} Status OK or Error
 */
exports.execute = function () {
    try {
        var args = arguments[0];

        var sourceFolder = args.SourceFolder;
        var targetFolder = args.TargetFolder;
        var couponFileName = args.FileName;

        if (!sourceFolder) {
            throw new Error('One or more mandatory parameters are missing.');
        }

        if (!targetFolder) {
            throw new Error('One or more mandatory parameters are missing.');
        }

        if (!couponFileName) {
            throw new Error('One or more mandatory parameters are missing.');
        }

        var couponFilePath = [sourceFolder, couponFileName].join(File.SEPARATOR);

        var couponFile = new File(File.getRootDirectory(File.IMPEX), couponFilePath);
        if (!couponFile.exists()) {
            Logger.info('IMPEX source file {0} does not exist', (File.getRootDirectory(File.IMPEX).fullPath + couponFilePath));
            throw new Error('IMPEX source file does not exist');
        }

        var XMLStreamConstants = require('dw/io/XMLStreamConstants');
        var XMLStreamReader = require('dw/io/XMLStreamReader');
        var FileReader = require('dw/io/FileReader');
        var FileWriter = require('dw/io/FileWriter');
        var XMLStreamWriter = require('dw/io/XMLIndentingStreamWriter');

        var filepath = new File(File.getRootDirectory(File.IMPEX), targetFolder);
        if (!filepath.exists() && !filepath.mkdirs()) {
            Logger.info('Cannot create IMPEX folders {0}', (File.getRootDirectory(File.IMPEX).fullPath + targetFolder));
            throw new Error('Cannot create IMPEX folders.');
        }

        var fileName = FileUtils.createFileName((args.FileNamePrefix || FConstants.FILE_NAME.COUPONS), 'xml');

        var file = new File(filepath.fullPath + File.SEPARATOR + fileName);
        var fileWriter = new FileWriter(file);
        var xmlStreamWriter = XMLStreamWriter(fileWriter);
        xmlStreamWriter.writeStartDocument('UTF-8', '1.0');
        xmlStreamWriter.writeCharacters('\n');
        xmlStreamWriter.writeStartElement('coupons');
        xmlStreamWriter.writeAttribute('xmlns', FConstants.XML_NAMESPACE_COUPONS);

        // open the feed and start stream reading
        var fileReader = new FileReader(couponFile, 'UTF-8');
        var xmlReader = new XMLStreamReader(fileReader);

        while (xmlReader.hasNext()) {
            xmlReader.next();
            if (xmlReader.getEventType() === XMLStreamConstants.START_ELEMENT && xmlReader.getLocalName() === 'coupon') {
                var couponXML = xmlReader.readXMLObject();
                var couponElements = couponXML.elements();
                Object.keys(couponElements).forEach(function (element) { // eslint-disable-line no-loop-func
                    var couponObj = couponElements[element];
                    if (couponObj.localName() === 'single-code') {
                        xmlStreamWriter.writeCharacters('\n');
                        xmlStreamWriter.writeRaw(couponXML.toString());
                        xmlStreamWriter.writeCharacters('\n');
                    }
                });
            }
        }

        xmlReader.close();
        fileReader.close();

        xmlStreamWriter.writeEndElement();
        xmlStreamWriter.writeEndDocument();

        xmlStreamWriter.flush();
        xmlStreamWriter.close();

        // Remove System Generated Coupon File
        FileUtils.removeFilesFromFolder(new File(File.getRootDirectory(File.IMPEX), sourceFolder));
    } catch (ex) {
        Logger.info('Not able to process generated coupon file {0}', ex.toString());
        return new Status(Status.ERROR, 'ERROR', ex.message);
    }

    return new Status(Status.OK, 'OK', 'Generated Coupon File Successfully');
};
