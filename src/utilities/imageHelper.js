import Resizer from 'react-image-file-resizer';

export const resizeFile = (file) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            1000,
            1000,
            'JPEG',
            100,
            0,
            (uri) => {
                resolve(uri);
            },
            'file'
        );
    });

export const resizeFileBase64 = (file) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            1000,
            1000,
            'JPEG',
            100,
            0,
            (uri) => {
                resolve(uri);
            },
            'base64'
        );
    });
