import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";
import sass from "../app.module.sass"

const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    image:
        "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    dotsOptions: {
        color: "#4267b2",
        type: "rounded"
    },
    imageOptions: {
        crossOrigin: "anonymous",
        margin: 20
    }
});

export default function QR({ url }) {
    const [fileExt, setFileExt] = useState("svg");
    const ref = useRef(null);

    useEffect(() => {
        qrCode.append(ref.current);
    }, []);

    useEffect(() => {
        qrCode.update({
            data: url,
            type: "svg",
            image: "./logo.png",
            dotsOptions: {
                color: "#007b81",
                type: "dots"
            },
            backgroundOptions: {
                color: "transparent",
            },
        });
    }, [url]);

    const onExtensionChange = (event) => {
        setFileExt(event.target.value);
    };

    const onDownloadClick = () => {
        qrCode.download({
            extension: fileExt
        });
    };

    return (
        <div className={sass.qrholder}>
            <div className={sass.col}>
                <select onChange={onExtensionChange} value={fileExt}>
                    <option value="png">PNG</option>
                    <option value="jpeg">JPEG</option>
                    <option value="svg">SVG</option>
                    <option value="webp">WEBP</option>
                </select>
                <button onClick={onDownloadClick}>Download</button>
            </div>
            <div className={sass.qr}>
                <div ref={ref} />
            </div>
            <p>Scan for Menu</p>
        </div>
    );
}
