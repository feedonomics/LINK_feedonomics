'use strict';

/**
 * Copies files to a remote (S)FTP-Location
 *
 * Job Parameters:
 *
 *   ServiceID: String The service ID to use to connect to the remote server.
 *   FilePattern: String Input File pattern to search in local folder (default is  "^[\\w\-]{1,}\\.csv$" (*.csv)).
 *   SourceFolder: String Local folder in which will placed files, relatively to IMPEX/.
 *   TargetFolder: String Remote folder of FTP Server.
 *   ArchiveFolder: String Path to the archive folder. If empty, nothing will be done for uploaded files (keep files as is).
 *   NoFileFoundStatus: String The status to fire when no files are found in the local directory.
 */

/**
 * The main function.
 *
 * @returns {dw.system.Status} The exit status for the job step
 */
var upload = function upload() {
    var args = arguments[0];

    if (args.isDisabled) {
        return new Status(Status.OK, 'OK', 'Step disabled, skip it...');
    }

};

exports.Upload = upload;
