'use strict';

var File = require('dw/io/File');
var Status = require('dw/system/Status');
var Logger = require('dw/system/Logger');

var FeedonomicsFTPService = require('~/cartridge/scripts/init/FeedonomicsFTPService');
var FileUtils = require('~/cartridge/scripts/util/FileUtils');

/**
 * Copies files to a remote (S)FTP-Location
 *
 * Job Parameters:
 *
 *   ServiceID: String The service ID to use to connect to the remote server.
 *   FilePattern: String Input File pattern to search in local folder (default is  (*.csv)).
 *   SourceFolder: String Local folder in which will placed files, relatively to IMPEX/.
 *   TargetFolder: String Remote folder of FTP Server.
 *   ArchiveFolder: String Path to the archive folder. If empty, nothing will be done for uploaded files (keep files as is).
 */

/**
 * The main function to upload files from IMPEX to SFTP
 *
 * @returns {dw.system.Status} The exit status for the job step
 */
var upload = function upload() {
    var args = arguments[0];

    if (args.isDisabled) {
        return new Status(Status.OK, 'OK', 'Step disabled, skip it...');
    }

    // Load input Parameters
    var serviceID = args.ServiceID;
    var filePattern = args.FilePattern;
    var sourceFolder = args.SourceFolder;
    var targetFolder = args.TargetFolder;
    var archiveFolder = args.ArchiveFolder;

    // Test mandatory parameters
    if (empty(serviceID) || empty(sourceFolder) || empty(targetFolder)) {
        return new Status(Status.ERROR, 'ERROR', 'One or more mandatory parameters are missing.');
    }

    var sourceDirectory = File.IMPEX + (sourceFolder.charAt(0).equals(File.SEPARATOR) ? sourceFolder + File.SEPARATOR : File.SEPARATOR + sourceFolder);
    var fileList = FileUtils.getFiles(sourceDirectory, filePattern);
    if (fileList.length === 0) {
        return new Status(Status.ERROR, 'ERROR', 'No files to upload.');
    }

    archiveFolder = (archiveFolder.charAt(0).equals(File.SEPARATOR) ? archiveFolder.substring(1) : archiveFolder);
    var archiveFolderFile = new File(File.getRootDirectory(File.IMPEX), archiveFolder);
    if (!archiveFolderFile || (!archiveFolderFile.isDirectory() && !archiveFolderFile.mkdirs())) {
        throw new Error('Cannot create IMPEX Archive folder: ' + archiveFolder + '!');
    }

    targetFolder = targetFolder.charAt(targetFolder.length - 1).equals(File.SEPARATOR) ? targetFolder : targetFolder + File.SEPARATOR;

    var ftpService = FeedonomicsFTPService.getService(serviceID);

    var targetFolderStr = targetFolder.charAt(0) === File.SEPARATOR ? targetFolder.substring(1) : targetFolder;

    // Creating FTP Folder Directory if doesn't exist
    if (!ftpService.call('cd', targetFolderStr)) {
        Logger.info('Directory "{0}" does not exist. Creating...', targetFolderStr);
        ftpService.call('mkdir', targetFolderStr);
        if (!ftpService.call('cd', targetFolderStr)) {
            throw new Error('Could not change to target folder.');
        }
    }

    fileList.forEach(function (filePath) {
        var file = new File(filePath);
        var remoteFilePath = targetFolder + file.getName();
        Logger.info('Uploading {0} to {1}...', file, remoteFilePath);

        var serviceResult = ftpService.call('putBinary', remoteFilePath, file);
        var isUploadSuccessful = serviceResult.getObject();
        if (!serviceResult.isOk() || !isUploadSuccessful) {
            throw new Error('SFTP Service: couldn\'t upload file: ' + file.getFullPath() + ' error: ' + serviceResult.getErrorMessage());
        }
        Logger.info('File {0} successfully uploaded.', remoteFilePath);

        if (!empty(archiveFolderFile)) {
            var theArchiveFile = new File(archiveFolderFile.fullPath + File.SEPARATOR + file.getName());
            file.renameTo(theArchiveFile);
        }
    });

    return new Status(Status.OK, 'OK', 'Upload successful.');

};

exports.Upload = upload;
