/*
    IPFS Box
    Simple file uploader using IPFS protocol
*/
import IPFS from 'ipfs';
import {Buffer} from 'buffer';

let fileToUpload = null;
let node = new IPFS();

node.on('ready', () => {
    console.log('Your IPFS node is ready.');

    node.version((err, version) => {
        if (err) {
            console.error('Error getting the IPFS version.', err);
            return;
        }
        console.log('version : ', version.version)
    });
});


document.addEventListener('DOMContentLoaded', e => {
    init();
});

function init() {
    setFileInput();
    setUploadBtn();
}

function setFileInput() {
    let $ = document.getElementById('fileInput');
    $.onchange = function () {
        if (!this.files || !this.files[0]) {
            return;
        }

        fileToUpload = this.files[0];

        document
            .getElementById('inputFileName')
            .innerText = fileToUpload.name;

        document
            .getElementById('uploadBtn')
            .style
            .visibility = 'visible';
    }
}

function setUploadBtn() {
    let $ = document.getElementById('uploadBtn');
    $.onclick = () => {
        prepareFile(fileToUpload);
    }

    document.addEventListener('upload-started', e => {
        $
            .classList
            .add('is-loading');
    });

    document.addEventListener('upload-done', e => {
        $
            .classList
            .remove('is-loading');
    });
}

function prepareFile(file) {
    document.dispatchEvent(new Event('upload-started'));

    let reader = new FileReader();

    reader.onload = e => {
        uploadFile(new Buffer(e.target.result));
    }

    reader.readAsArrayBuffer(file);
}

function uploadFile(file) {
    node
        .files
        .add(file, (err, fileAdded) => {
            document.dispatchEvent(new Event('upload-done'));

            if (err) {
                displayError(err);
                return;
            }

            document
                .getElementById('result')
                .innerHTML = '<a id="viewFileBtn" href="https://ipfs.io/ipfs/' + fileAdded[0].hash + '" target="_blank" class="button is-info is-medium" style="margin-top:20px;">View' +
                    ' file</a>';
        });
}

function displayError(err) {
    document
        .getElementById('errorMsg')
        .innerText = err;
}