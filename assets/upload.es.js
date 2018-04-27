var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*canvasresize*/
var BinaryFile = function BinaryFile(f, c, b) {
    var d = f;
    var a = c || 0;
    var e = 0;
    this.getRawData = function () {
        return d;
    };
    if (typeof f == "string") {
        e = b || d.length;
        this.getByteAt = function (g) {
            return d.charCodeAt(g + a) & 255;
        };
        this.getBytesAt = function (k, j) {
            var g = [];
            for (var h = 0; h < j; h++) {
                g[h] = d.charCodeAt(k + h + a) & 255;
            }
            return g;
        };
    } else {
        if (typeof f == "unknown") {
            e = b || IEBinary_getLength(d);
            this.getByteAt = function (g) {
                return IEBinary_getByteAt(d, g + a);
            };
            this.getBytesAt = function (h, g) {
                return new VBArray(IEBinary_getBytesAt(d, h + a, g)).toArray();
            };
        }
    }
    this.getLength = function () {
        return e;
    };
    this.getSByteAt = function (h) {
        var g = this.getByteAt(h);
        if (g > 127) {
            return g - 256;
        } else {
            return g;
        }
    };
    this.getShortAt = function (i, g) {
        var h = g ? (this.getByteAt(i) << 8) + this.getByteAt(i + 1) : (this.getByteAt(i + 1) << 8) + this.getByteAt(i);
        if (h < 0) {
            h += 65536;
        }
        return h;
    };
    this.getSShortAt = function (i, h) {
        var g = this.getShortAt(i, h);
        if (g > 32767) {
            return g - 65536;
        } else {
            return g;
        }
    };
    this.getLongAt = function (l, h) {
        var k = this.getByteAt(l),
            j = this.getByteAt(l + 1),
            i = this.getByteAt(l + 2),
            g = this.getByteAt(l + 3);
        var m = h ? (((k << 8) + j << 8) + i << 8) + g : (((g << 8) + i << 8) + j << 8) + k;
        if (m < 0) {
            m += 4294967296;
        }
        return m;
    };
    this.getSLongAt = function (i, g) {
        var h = this.getLongAt(i, g);
        if (h > 2147483647) {
            return h - 4294967296;
        } else {
            return h;
        }
    };
    this.getStringAt = function (l, k) {
        var h = [];
        var g = this.getBytesAt(l, k);
        for (var i = 0; i < k; i++) {
            h[i] = String.fromCharCode(g[i]);
        }
        return h.join("");
    };
    this.getCharAt = function (g) {
        return String.fromCharCode(this.getByteAt(g));
    };
    this.toBase64 = function () {
        return window.btoa(d);
    };
    this.fromBase64 = function (g) {
        d = window.atob(g);
    };
};
var BinaryAjax = function () {
    function b() {
        var d = null;
        if (window.ActiveXObject) {
            d = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            if (window.XMLHttpRequest) {
                d = new XMLHttpRequest();
            }
        }
        return d;
    }
    function c(g, d, f) {
        var e = b();
        if (e) {
            if (d) {
                if (typeof e.onload != "undefined") {
                    e.onload = function () {
                        if (e.status == "200") {
                            d(this);
                        } else {
                            if (f) {
                                f();
                            }
                        }
                        e = null;
                    };
                } else {
                    e.onreadystatechange = function () {
                        if (e.readyState == 4) {
                            if (e.status == "200") {
                                d(this);
                            } else {
                                if (f) {
                                    f();
                                }
                            }
                            e = null;
                        }
                    };
                }
            }
            e.open("HEAD", g, true);
            e.send(null);
        } else {
            if (f) {
                f();
            }
        }
    }
    function a(e, h, g, d, i, j) {
        var f = b();
        if (f) {
            var k = 0;
            if (d && !i) {
                k = d[0];
            }
            var l = 0;
            if (d) {
                l = d[1] - d[0] + 1;
            }
            if (h) {
                if (typeof f.onload != "undefined") {
                    f.onload = function () {
                        if (f.status == "200" || f.status == "206" || f.status == "0") {
                            f.binaryResponse = new BinaryFile(f.responseText, k, l);
                            f.fileSize = j || f.getResponseHeader("Content-Length");
                            h(f);
                        } else {
                            if (g) {
                                g();
                            }
                        }
                        f = null;
                    };
                } else {
                    f.onreadystatechange = function () {
                        if (f.readyState == 4) {
                            if (f.status == "200" || f.status == "206" || f.status == "0") {
                                var m = {
                                    status: f.status,
                                    binaryResponse: new BinaryFile(typeof f.responseBody == "unknown" ? f.responseBody : f.responseText, k, l),
                                    fileSize: j || f.getResponseHeader("Content-Length")
                                };
                                h(m);
                            } else {
                                if (g) {
                                    g();
                                }
                            }
                            f = null;
                        }
                    };
                }
            }
            f.open("GET", e, true);
            if (f.overrideMimeType) {
                f.overrideMimeType("text/plain; charset=x-user-defined");
            }
            if (d && i) {
                f.setRequestHeader("Range", "bytes=" + d[0] + "-" + d[1]);
            }
            f.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 1970 00:00:00 GMT");
            f.send(null);
        } else {
            if (g) {
                g();
            }
        }
    }
    return function (g, d, f, e) {
        if (e) {
            c(g, function (j) {
                var l = parseInt(j.getResponseHeader("Content-Length"), 10);
                var k = j.getResponseHeader("Accept-Ranges");
                var i, h;
                i = e[0];
                if (e[0] < 0) {
                    i += l;
                }
                h = i + e[1] - 1;
                a(g, d, f, [i, h], k == "bytes", l);
            });
        } else {
            a(g, d, f);
        }
    };
}();
// document.write("<script type='text/vbscript'>\r\nFunction IEBinary_getByteAt(strBinary, iOffset)\r\n IEBinary_getByteAt = AscB(MidB(strBinary, iOffset + 1, 1))\r\nEnd Function\r\nFunction IEBinary_getBytesAt(strBinary, iOffset, iLength)\r\n  Dim aBytes()\r\n  ReDim aBytes(iLength - 1)\r\n  For i = 0 To iLength - 1\r\n   aBytes(i) = IEBinary_getByteAt(strBinary, iOffset + i)\r\n  Next\r\n  IEBinary_getBytesAt = aBytes\r\nEnd Function\r\nFunction IEBinary_getLength(strBinary)\r\n IEBinary_getLength = LenB(strBinary)\r\nEnd Function\r\n<\/script>\r\n");
var EXIF = function () {
    var b = false;
    var h = {
        36864: "ExifVersion",
        40960: "FlashpixVersion",
        40961: "ColorSpace",
        40962: "PixelXDimension",
        40963: "PixelYDimension",
        37121: "ComponentsConfiguration",
        37122: "CompressedBitsPerPixel",
        37500: "MakerNote",
        37510: "UserComment",
        40964: "RelatedSoundFile",
        36867: "DateTimeOriginal",
        36868: "DateTimeDigitized",
        37520: "SubsecTime",
        37521: "SubsecTimeOriginal",
        37522: "SubsecTimeDigitized",
        33434: "ExposureTime",
        33437: "FNumber",
        34850: "ExposureProgram",
        34852: "SpectralSensitivity",
        34855: "ISOSpeedRatings",
        34856: "OECF",
        37377: "ShutterSpeedValue",
        37378: "ApertureValue",
        37379: "BrightnessValue",
        37380: "ExposureBias",
        37381: "MaxApertureValue",
        37382: "SubjectDistance",
        37383: "MeteringMode",
        37384: "LightSource",
        37385: "Flash",
        37396: "SubjectArea",
        37386: "FocalLength",
        41483: "FlashEnergy",
        41484: "SpatialFrequencyResponse",
        41486: "FocalPlaneXResolution",
        41487: "FocalPlaneYResolution",
        41488: "FocalPlaneResolutionUnit",
        41492: "SubjectLocation",
        41493: "ExposureIndex",
        41495: "SensingMethod",
        41728: "FileSource",
        41729: "SceneType",
        41730: "CFAPattern",
        41985: "CustomRendered",
        41986: "ExposureMode",
        41987: "WhiteBalance",
        41988: "DigitalZoomRation",
        41989: "FocalLengthIn35mmFilm",
        41990: "SceneCaptureType",
        41991: "GainControl",
        41992: "Contrast",
        41993: "Saturation",
        41994: "Sharpness",
        41995: "DeviceSettingDescription",
        41996: "SubjectDistanceRange",
        40965: "InteroperabilityIFDPointer",
        42016: "ImageUniqueID"
    };
    var i = {
        256: "ImageWidth",
        257: "ImageHeight",
        34665: "ExifIFDPointer",
        34853: "GPSInfoIFDPointer",
        40965: "InteroperabilityIFDPointer",
        258: "BitsPerSample",
        259: "Compression",
        262: "PhotometricInterpretation",
        274: "Orientation",
        277: "SamplesPerPixel",
        284: "PlanarConfiguration",
        530: "YCbCrSubSampling",
        531: "YCbCrPositioning",
        282: "XResolution",
        283: "YResolution",
        296: "ResolutionUnit",
        273: "StripOffsets",
        278: "RowsPerStrip",
        279: "StripByteCounts",
        513: "JPEGInterchangeFormat",
        514: "JPEGInterchangeFormatLength",
        301: "TransferFunction",
        318: "WhitePoint",
        319: "PrimaryChromaticities",
        529: "YCbCrCoefficients",
        532: "ReferenceBlackWhite",
        306: "DateTime",
        270: "ImageDescription",
        271: "Make",
        272: "Model",
        305: "Software",
        315: "Artist",
        33432: "Copyright"
    };
    var c = {
        0: "GPSVersionID",
        1: "GPSLatitudeRef",
        2: "GPSLatitude",
        3: "GPSLongitudeRef",
        4: "GPSLongitude",
        5: "GPSAltitudeRef",
        6: "GPSAltitude",
        7: "GPSTimeStamp",
        8: "GPSSatellites",
        9: "GPSStatus",
        10: "GPSMeasureMode",
        11: "GPSDOP",
        12: "GPSSpeedRef",
        13: "GPSSpeed",
        14: "GPSTrackRef",
        15: "GPSTrack",
        16: "GPSImgDirectionRef",
        17: "GPSImgDirection",
        18: "GPSMapDatum",
        19: "GPSDestLatitudeRef",
        20: "GPSDestLatitude",
        21: "GPSDestLongitudeRef",
        22: "GPSDestLongitude",
        23: "GPSDestBearingRef",
        24: "GPSDestBearing",
        25: "GPSDestDistanceRef",
        26: "GPSDestDistance",
        27: "GPSProcessingMethod",
        28: "GPSAreaInformation",
        29: "GPSDateStamp",
        30: "GPSDifferential"
    };
    var m = {
        ExposureProgram: {
            0: "Not defined",
            1: "Manual",
            2: "Normal program",
            3: "Aperture priority",
            4: "Shutter priority",
            5: "Creative program",
            6: "Action program",
            7: "Portrait mode",
            8: "Landscape mode"
        },
        MeteringMode: {
            0: "Unknown",
            1: "Average",
            2: "CenterWeightedAverage",
            3: "Spot",
            4: "MultiSpot",
            5: "Pattern",
            6: "Partial",
            255: "Other"
        },
        LightSource: {
            0: "Unknown",
            1: "Daylight",
            2: "Fluorescent",
            3: "Tungsten (incandescent light)",
            4: "Flash",
            9: "Fine weather",
            10: "Cloudy weather",
            11: "Shade",
            12: "Daylight fluorescent (D 5700 - 7100K)",
            13: "Day white fluorescent (N 4600 - 5400K)",
            14: "Cool white fluorescent (W 3900 - 4500K)",
            15: "White fluorescent (WW 3200 - 3700K)",
            17: "Standard light A",
            18: "Standard light B",
            19: "Standard light C",
            20: "D55",
            21: "D65",
            22: "D75",
            23: "D50",
            24: "ISO studio tungsten",
            255: "Other"
        },
        Flash: {
            0: "Flash did not fire",
            1: "Flash fired",
            5: "Strobe return light not detected",
            7: "Strobe return light detected",
            9: "Flash fired, compulsory flash mode",
            13: "Flash fired, compulsory flash mode, return light not detected",
            15: "Flash fired, compulsory flash mode, return light detected",
            16: "Flash did not fire, compulsory flash mode",
            24: "Flash did not fire, auto mode",
            25: "Flash fired, auto mode",
            29: "Flash fired, auto mode, return light not detected",
            31: "Flash fired, auto mode, return light detected",
            32: "No flash function",
            65: "Flash fired, red-eye reduction mode",
            69: "Flash fired, red-eye reduction mode, return light not detected",
            71: "Flash fired, red-eye reduction mode, return light detected",
            73: "Flash fired, compulsory flash mode, red-eye reduction mode",
            77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
            79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
            89: "Flash fired, auto mode, red-eye reduction mode",
            93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
            95: "Flash fired, auto mode, return light detected, red-eye reduction mode"
        },
        SensingMethod: {
            1: "Not defined",
            2: "One-chip color area sensor",
            3: "Two-chip color area sensor",
            4: "Three-chip color area sensor",
            5: "Color sequential area sensor",
            7: "Trilinear sensor",
            8: "Color sequential linear sensor"
        },
        SceneCaptureType: {
            0: "Standard",
            1: "Landscape",
            2: "Portrait",
            3: "Night scene"
        },
        SceneType: {
            1: "Directly photographed"
        },
        CustomRendered: {
            0: "Normal process",
            1: "Custom process"
        },
        WhiteBalance: {
            0: "Auto white balance",
            1: "Manual white balance"
        },
        GainControl: {
            0: "None",
            1: "Low gain up",
            2: "High gain up",
            3: "Low gain down",
            4: "High gain down"
        },
        Contrast: {
            0: "Normal",
            1: "Soft",
            2: "Hard"
        },
        Saturation: {
            0: "Normal",
            1: "Low saturation",
            2: "High saturation"
        },
        Sharpness: {
            0: "Normal",
            1: "Soft",
            2: "Hard"
        },
        SubjectDistanceRange: {
            0: "Unknown",
            1: "Macro",
            2: "Close view",
            3: "Distant view"
        },
        FileSource: {
            3: "DSC"
        },
        Components: {
            0: "",
            1: "Y",
            2: "Cb",
            3: "Cr",
            4: "R",
            5: "G",
            6: "B"
        }
    };
    function e(r) {
        return !!r.exifdata;
    }
    function k(r, s) {
        BinaryAjax(r.src, function (t) {
            var u = a(t.binaryResponse);
            r.exifdata = u || {};
            if (s) {
                s.call(r);
            }
        });
    }
    function a(s) {
        if (s.getByteAt(0) != 255 || s.getByteAt(1) != 216) {
            return false;
        }
        var u = 2,
            t = s.getLength(),
            r;
        while (u < t) {
            if (s.getByteAt(u) != 255) {
                if (b) {
                    console.log("Not a valid marker at offset " + u + ", found: " + s.getByteAt(u));
                }
                return false;
            }
            r = s.getByteAt(u + 1);
            if (r == 22400) {
                if (b) {
                    console.log("Found 0xFFE1 marker");
                }
                return q(s, u + 4, s.getShortAt(u + 2, true) - 2);
            } else {
                if (r == 225) {
                    if (b) {
                        console.log("Found 0xFFE1 marker");
                    }
                    return q(s, u + 4, s.getShortAt(u + 2, true) - 2);
                } else {
                    u += 2 + s.getShortAt(u + 2, true);
                }
            }
        }
    }
    function o(r, x, z, w, t) {
        var u = r.getShortAt(z, t),
            A = {},
            v,
            y,
            s;
        for (s = 0; s < u; s++) {
            v = z + s * 12 + 2;
            y = w[r.getShortAt(v, t)];
            if (!y && b) {
                console.log("Unknown tag: " + r.getShortAt(v, t));
            }
            A[y] = d(r, v, x, z, t);
        }
        return A;
    }
    function d(w, A, D, E, y) {
        var z = w.getShortAt(A + 2, y),
            C = w.getLongAt(A + 4, y),
            s = w.getLongAt(A + 8, y) + D,
            x,
            B,
            v,
            u,
            r,
            t;
        switch (z) {
            case 1:
            case 7:
                if (C == 1) {
                    return w.getByteAt(A + 8, y);
                } else {
                    x = C > 4 ? s : A + 8;
                    B = [];
                    for (u = 0; u < C; u++) {
                        B[u] = w.getByteAt(x + u);
                    }
                    return B;
                }
            case 2:
                x = C > 4 ? s : A + 8;
                return w.getStringAt(x, C - 1);
            case 3:
                if (C == 1) {
                    return w.getShortAt(A + 8, y);
                } else {
                    x = C > 2 ? s : A + 8;
                    B = [];
                    for (u = 0; u < C; u++) {
                        B[u] = w.getShortAt(x + 2 * u, y);
                    }
                    return B;
                }
            case 4:
                if (C == 1) {
                    return w.getLongAt(A + 8, y);
                } else {
                    B = [];
                    for (var u = 0; u < C; u++) {
                        B[u] = w.getLongAt(s + 4 * u, y);
                    }
                    return B;
                }
            case 5:
                if (C == 1) {
                    r = w.getLongAt(s, y);
                    t = w.getLongAt(s + 4, y);
                    v = new Number(r / t);
                    v.numerator = r;
                    v.denominator = t;
                    return v;
                } else {
                    B = [];
                    for (u = 0; u < C; u++) {
                        r = w.getLongAt(s + 8 * u, y);
                        t = w.getLongAt(s + 4 + 8 * u, y);
                        B[u] = new Number(r / t);
                        B[u].numerator = r;
                        B[u].denominator = t;
                    }
                    return B;
                }
            case 9:
                if (C == 1) {
                    return w.getSLongAt(A + 8, y);
                } else {
                    B = [];
                    for (u = 0; u < C; u++) {
                        B[u] = w.getSLongAt(s + 4 * u, y);
                    }
                    return B;
                }
            case 10:
                if (C == 1) {
                    return w.getSLongAt(s, y) / w.getSLongAt(s + 4, y);
                } else {
                    B = [];
                    for (u = 0; u < C; u++) {
                        B[u] = w.getSLongAt(s + 8 * u, y) / w.getSLongAt(s + 4 + 8 * u, y);
                    }
                    return B;
                }
        }
    }
    function q(v, y) {
        if (v.getStringAt(y, 4) != "Exif") {
            if (b) {
                console.log("Not valid EXIF data! " + v.getStringAt(y, 4));
            }
            return false;
        }
        var t,
            u,
            r,
            s,
            x,
            w = y + 6;
        if (v.getShortAt(w) == 18761) {
            t = false;
        } else {
            if (v.getShortAt(w) == 19789) {
                t = true;
            } else {
                if (b) {
                    console.log("Not valid TIFF data! (no 0x4949 or 0x4D4D)");
                }
                return false;
            }
        }
        if (v.getShortAt(w + 2, t) != 42) {
            if (b) {
                console.log("Not valid TIFF data! (no 0x002A)");
            }
            return false;
        }
        if (v.getLongAt(w + 4, t) != 8) {
            if (b) {
                console.log("Not valid TIFF data! (First offset not 8)", v.getShortAt(w + 4, t));
            }
            return false;
        }
        u = o(v, w, w + 8, i, t);
        if (u.ExifIFDPointer) {
            s = o(v, w, w + u.ExifIFDPointer, h, t);
            for (r in s) {
                switch (r) {
                    case "LightSource":
                    case "Flash":
                    case "MeteringMode":
                    case "ExposureProgram":
                    case "SensingMethod":
                    case "SceneCaptureType":
                    case "SceneType":
                    case "CustomRendered":
                    case "WhiteBalance":
                    case "GainControl":
                    case "Contrast":
                    case "Saturation":
                    case "Sharpness":
                    case "SubjectDistanceRange":
                    case "FileSource":
                        s[r] = m[r][s[r]];
                        break;
                    case "ExifVersion":
                    case "FlashpixVersion":
                        s[r] = String.fromCharCode(s[r][0], s[r][1], s[r][2], s[r][3]);
                        break;
                    case "ComponentsConfiguration":
                        s[r] = m.Components[s[r][0]] + m.Components[s[r][1]] + m.Components[s[r][2]] + m.Components[s[r][3]];
                        break;
                }
                u[r] = s[r];
            }
        }
        if (u.GPSInfoIFDPointer) {
            x = o(v, w, w + u.GPSInfoIFDPointer, c, t);
            for (r in x) {
                switch (r) {
                    case "GPSVersionID":
                        x[r] = x[r][0] + "." + x[r][1] + "." + x[r][2] + "." + x[r][3];
                        break;
                }
                u[r] = x[r];
            }
        }
        return u;
    }
    function g(r, s) {
        if (!r.complete) {
            return false;
        }
        if (!e(r)) {
            k(r, s);
        } else {
            if (s) {
                s.call(r);
            }
        }
        return true;
    }
    function j(s, r) {
        if (!e(s)) {
            return;
        }
        return s.exifdata[r];
    }
    function l(s) {
        if (!e(s)) {
            return {};
        }
        var r,
            u = s.exifdata,
            t = {};
        for (r in u) {
            if (u.hasOwnProperty(r)) {
                t[r] = u[r];
            }
        }
        return t;
    }
    function n(s) {
        if (!e(s)) {
            return "";
        }
        var r,
            u = s.exifdata,
            t = "";
        for (r in u) {
            if (u.hasOwnProperty(r)) {
                if (_typeof$1(u[r]) == "object") {
                    if (u[r] instanceof Number) {
                        t += r + " : " + u[r] + " [" + u[r].numerator + "/" + u[r].denominator + "]\r\n";
                    } else {
                        t += r + " : [" + u[r].length + " values]\r\n";
                    }
                } else {
                    t += r + " : " + u[r] + "\r\n";
                }
            }
        }
        return t;
    }
    function p(r) {
        return a(r);
    }
    return {
        readFromBinaryFile: p,
        pretty: n,
        getTag: j,
        getAllTags: l,
        getData: g,
        Tags: h,
        TiffTags: i,
        GPSTags: c,
        StringValues: m
    };
}();
(function (d) {
    var c = "canvasResize",
        a = {
        newsize: function newsize(g, j, f, i, l) {
            var m = l ? "h" : "";
            if (f && g > f || i && j > i) {
                var k = g / j;
                if ((k >= 1 || i === 0) && f && !l) {
                    g = f;
                    j = f / k >> 0;
                } else {
                    if (l && k <= f / i) {
                        g = f;
                        j = f / k >> 0;
                        m = "w";
                    } else {
                        g = i * k >> 0;
                        j = i;
                    }
                }
            }
            return { width: g, height: j, cropped: m };
        },
        dataURLtoBlob: function dataURLtoBlob(k) {
            var f = k.split(",")[0].split(":")[1].split(";")[0];
            var m = atob(k.split(",")[1]);
            var j = new ArrayBuffer(m.length);
            var g = new Uint8Array(j);
            for (var h = 0; h < m.length; h++) {
                g[h] = m.charCodeAt(h);
            }
            var l = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
            if (l) {
                l = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)();
                l.append(j);
                return l.getBlob(f);
            } else {
                l = new Blob([j], { type: f });
                return l;
            }
        },
        detectSubsampling: function detectSubsampling(h) {
            var g = h.width,
                j = h.height;
            if (g * j > 1048576) {
                var i = document.createElement("canvas");
                i.width = i.height = 1;
                var f = i.getContext("2d");
                f.drawImage(h, -g + 1, 0);
                return f.getImageData(0, 0, 1, 1).data[3] === 0;
            } else {
                return false;
            }
        },
        rotate: function rotate(f, h) {
            var g = {
                1: {
                    90: 6,
                    180: 3,
                    270: 8
                },
                2: {
                    90: 7,
                    180: 4,
                    270: 5
                },
                3: {
                    90: 8,
                    180: 1,
                    270: 6
                },
                4: {
                    90: 5,
                    180: 2,
                    270: 7
                },
                5: {
                    90: 2,
                    180: 7,
                    270: 4
                },
                6: {
                    90: 3,
                    180: 8,
                    270: 1
                },
                7: {
                    90: 4,
                    180: 5,
                    270: 2
                },
                8: {
                    90: 1,
                    180: 6,
                    270: 3
                }
            };
            return g[f][h] ? g[f][h] : f;
        },
        transformCoordinate: function transformCoordinate(i, j, f, h) {
            switch (h) {
                case 5:
                case 6:
                case 7:
                case 8:
                    i.width = f;
                    i.height = j;
                    break;
                default:
                    i.width = j;
                    i.height = f;
            }
            var g = i.getContext("2d");
            switch (h) {
                case 1:
                    break;
                case 2:
                    g.translate(j, 0);
                    g.scale(-1, 1);
                    break;
                case 3:
                    g.translate(j, f);
                    g.rotate(Math.PI);
                    break;
                case 4:
                    g.translate(0, f);
                    g.scale(1, -1);
                    break;
                case 5:
                    g.rotate(0.5 * Math.PI);
                    g.scale(1, -1);
                    break;
                case 6:
                    g.rotate(0.5 * Math.PI);
                    g.translate(0, -f);
                    break;
                case 7:
                    g.rotate(0.5 * Math.PI);
                    g.translate(j, -f);
                    g.scale(-1, 1);
                    break;
                case 8:
                    g.rotate(-0.5 * Math.PI);
                    g.translate(-j, 0);
                    break;
                default:
                    break;
            }
        },
        detectVerticalSquash: function detectVerticalSquash(j, g, o) {
            var f = document.createElement("canvas");
            f.width = 1;
            f.height = o;
            var p = f.getContext("2d");
            p.drawImage(j, 0, 0);
            var i = p.getImageData(0, 0, 1, o).data;
            var m = 0;
            var k = o;
            var n = o;
            while (n > m) {
                var h = i[(n - 1) * 4 + 3];
                if (h === 0) {
                    k = n;
                } else {
                    m = n;
                }
                n = k + m >> 1;
            }
            var l = n / o;
            return l === 0 ? 1 : l;
        },
        callback: function callback(f) {
            return f;
        },
        extend: function extend() {
            var k = arguments[0] || {},
                g = 1,
                j = arguments.length,
                f = false;
            if (k.constructor === Boolean) {
                f = k;
                k = arguments[1] || {};
            }
            if (j === 1) {
                k = this;
                g = 0;
            }
            var l;
            for (; g < j; g++) {
                if ((l = arguments[g]) !== null) {
                    for (var h in l) {
                        if (k === l[h]) {
                            continue;
                        }
                        if (f && _typeof$1(l[h]) === "object" && k[h]) {
                            a.extend(k[h], l[h]);
                        } else {
                            if (l[h] !== undefined) {
                                k[h] = l[h];
                            }
                        }
                    }
                }
            }
            return k;
        }
    },
        e = {
        width: 300,
        height: 0,
        crop: false,
        quality: 80,
        rotate: 0,
        callback: a.callback
    };
    function b(g, f) {
        this.file = g;
        this.options = a.extend({}, e, f);
        this._defaults = e;
        this._name = c;
        this.init();
    }
    b.prototype = {
        init: function init() {
            var h = this;
            var g = this.file;
            var f = new FileReader();
            f.onloadend = function (k) {
                var l = k.target.result;
                var n = atob(l.split(",")[1]);
                var m = new BinaryFile(n, 0, n.length);
                var j = EXIF.readFromBinaryFile(m);
                var i = new Image();
                i.onload = function (L) {
                    var q = j.Orientation || 1;
                    q = a.rotate(q, h.options.rotate);
                    var D = q >= 5 && q <= 8 ? a.newsize(i.height, i.width, h.options.width, h.options.height, h.options.crop) : a.newsize(i.width, i.height, h.options.width, h.options.height, h.options.crop);
                    var s = i.width,
                        B = i.height;
                    var H = D.width,
                        E = D.height;
                    var p = document.createElement("canvas");
                    var I = p.getContext("2d");
                    I.save();
                    a.transformCoordinate(p, H, E, q);
                    if (a.detectSubsampling(i)) {
                        s /= 2;
                        B /= 2;
                    }
                    var M = 1024;
                    var o = document.createElement("canvas");
                    o.width = o.height = M;
                    var r = o.getContext("2d");
                    var J = a.detectVerticalSquash(i, s, B);
                    var C = 0;
                    while (C < B) {
                        var N = C + M > B ? B - C : M;
                        var F = 0;
                        while (F < s) {
                            var G = F + M > s ? s - F : M;
                            r.clearRect(0, 0, M, M);
                            r.drawImage(i, -F, -C);
                            var z = Math.floor(F * H / s);
                            var A = Math.ceil(G * H / s);
                            var w = Math.floor(C * E / B / J);
                            var K = Math.ceil(N * E / B / J);
                            I.drawImage(o, 0, 0, G, N, z, w, A, K);
                            F += M;
                        }
                        C += M;
                    }
                    I.restore();
                    o = r = null;
                    var t = document.createElement("canvas");
                    t.width = D.cropped === "h" ? E : H;
                    t.height = D.cropped === "w" ? H : E;
                    var v = D.cropped === "h" ? (E - H) * 0.5 : 0;
                    var u = D.cropped === "w" ? (H - E) * 0.5 : 0;
                    var newctx = t.getContext("2d");
                    newctx.drawImage(p, v, u, H, E);
                    if (g.type === "image/png") {
                        var O = t.toDataURL(g.type);
                    } else {
                        var O = t.toDataURL("image/jpeg", h.options.quality * 0.01);
                    }
                    h.options.callback(O, t.width, t.height);
                };
                i.src = l;
            };
            f.readAsDataURL(g);
        }
    };
    d[c] = function (g, f) {
        if (typeof g === "string") {
            return a[g](f);
        } else {
            new b(g, f);
        }
    };
})(window);

var api = {
    token: {
        qiniu: '//applet.meitu.com/public/index/token',
        s3: '//haiwai.data.meitu.com/aws/h5_token',
        oss: '//applet.meitu.com/public/index/oss_token',
        meitu: 'https://strategy.app.meitudata.com/upload/policy'
    },
    domain: {
        oss: '//make-channet-com.oss-cn-shenzhen.aliyuncs.com/',
        qiniu: '//upload.qbox.me/',
        meitu: '//upmt.meitudata.com/',
        s3: '' //通过uploadToken 动态获取
    },
    imgDomain: {
        oss: '//applet.meitudata.com/',
        qiniu: '//mtapplet.meitudata.com/',
        meitu: '//beauty-public.zone1.meitudata.com/',
        s3: 'https://h5img-jp.meitudata.com/'
    }
};

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var utils = {
    _get_img_type: function _get_img_type(tar) {
        var img_type = void 0;
        if (typeof tar === 'string' || !tar) {
            img_type = 'jpg';
        } else {
            var type = tar.type.replace('image/', '');
            if (type == 'jpg' || type == 'jpeg' || type == 'png') {
                img_type = type;
            } else {
                img_type = 'jpg';
            }
        }
        return img_type;
    },
    _get_up_type: function _get_up_type(type) {
        var up_type = void 0;
        switch (type) {
            case 0:
            case 'oss':
                up_type = 'oss';
                break;
            case 1:
            case 'qiniu':
                up_type = 'qiniu';
                break;
            case 2:
            case 's3':
                up_type = 's3';
                break;
            case 3:
            case 'meitu':
                up_type = 'meitu';
                break;
            default:
                up_type = 'oss';
        }
        return up_type;
    },
    _ajax: function _ajax(options) {
        if (!options || !options.url) {
            console.log('ajax options required');
            return;
        }
        var _options$type = options.type,
            type = _options$type === undefined ? 'GET' : _options$type,
            _options$success = options.success,
            success = _options$success === undefined ? function () {} : _options$success,
            _options$error = options.error,
            error = _options$error === undefined ? function () {} : _options$error,
            _options$timeout = options.timeout,
            timeout = _options$timeout === undefined ? 20000 : _options$timeout,
            _options$url = options.url,
            url = _options$url === undefined ? '' : _options$url,
            _options$data = options.data,
            data = _options$data === undefined ? {} : _options$data,
            _options$dataType = options.dataType,
            dataType = _options$dataType === undefined ? 'json' : _options$dataType;

        var params = '';
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                params += key + '=' + data[key] + '&';
            }
        }
        params && params.replace(/&$/, '');
        params += 'timestamp=' + new Date().getTime();

        type = type.toUpperCase();
        if (dataType == 'jsonp') {
            var cb = 'fn' + new Date().getTime();
            var script = document.createElement('script');
            script.id = 'id_' + cb;
            url += '?' + params + '&callback=' + cb;
            window[cb] = function (data) {
                if (data.code == 0) {
                    success(data);
                } else {
                    error({ msg: 'jsonp error' });
                }
                setTimeout(function () {
                    window[cb] = null;
                }, 1000);
                var el = document.getElementById('id_' + cb);
                el.parentNode.removeChild(el);
            };
            script.src = url;
            document.getElementsByTagName('head')[0].appendChild(script);
        } else {
            var oAjax = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            if (type === 'GET') {
                oAjax.open('GET', url + '?' + params, true);
                oAjax.timeout = timeout;
                oAjax.send();
            } else {
                oAjax.open('POST', url, true);
                oAjax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
                oAjax.timeout = timeout;
                oAjax.send(params);
            }
            oAjax.ontimeout = function () {
                error({ msg: 'get token error', xhr: oAjax });
            };
            oAjax.onreadystatechange = function () {
                if (oAjax.readyState === 4) {
                    if (oAjax.status === 200) {
                        var response = void 0;
                        if (oAjax.responseText) {
                            response = JSON.parse(oAjax.responseText);
                        } else {
                            response = {
                                status: 200
                            };
                        }
                        success(response, oAjax);
                    } else {
                        error({ msg: 'get token error', xhr: oAjax });
                    }
                }
            };
            return oAjax;
        }
    },
    _encode: function _encode(str) {
        var c1 = void 0,
            c2 = void 0,
            c3 = void 0;
        var base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var i = 0,
            len = str.length,
            string = '';
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                string += base64EncodeChars.charAt(c1 >> 2);
                string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                string += '==';
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                string += base64EncodeChars.charAt(c1 >> 2);
                string += base64EncodeChars.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4);
                string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                string += '=';
                break;
            }
            c3 = str.charCodeAt(i++);
            string += base64EncodeChars.charAt(c1 >> 2);
            string += base64EncodeChars.charAt((c1 & 0x3) << 4 | (c2 & 0xF0) >> 4);
            string += base64EncodeChars.charAt((c2 & 0xF) << 2 | (c3 & 0xC0) >> 6);
            string += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return string;
    },
    _dataURLtoBlob: function _dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?)/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    },
    checkSystem: function checkSystem() {
        var UA = window.navigator.userAgent.toLowerCase();
        var lowVersion = false;
        var IE8lte = !window.addEventListener || /MSIE 8/.test(navigator.userAgent);
        var lowAndroid = /android|adr/gi.test(UA) && UA.substr(UA.indexOf('android') + 8, 3) < 4.3;
        if (lowAndroid || IE8lte) {
            lowVersion = true;
        }
        return lowVersion;
    },
    extend: function extend(obj1, obj2) {
        for (var k in obj2) {
            if (obj2.hasOwnProperty(k)) {
                if (_typeof$2(obj2[k]) == 'object') {
                    if (_typeof$2(obj1[k]) !== 'object' || obj1[k] === null) {
                        obj1[k] = {};
                    }
                    this.extend(obj1[k], obj2[k]);
                } else {
                    obj1[k] = obj2[k];
                }
            }
        }
        return obj1;
    }
};

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var upload = function () {
    function upload(options) {
        _classCallCheck(this, upload);

        this.ops = {
            type: 0, // 0:oss  1:qiniu   2:s3   3: meitu
            width: 800, // 压缩宽度；
            quality: 90, // 图片质量；
            timeout: 20000, // 超时时间；
            preToken: false, // 初始化实例的时候是否预载 token;
            tokenParams: {}, // 请求token时带的参数；
            api: api // 请求的api地址；
        };

        this.ops = utils.extend(this.ops, options);

        this.lowVersion = utils.checkSystem();

        this.type = utils._get_up_type(this.ops.type);

        if (this.type === 'meitu') {
            this.ops.tokenParams = { app: 'cloud-beauty-h5', type: 'photo' };
        }

        this.canvasTime = 0;

        this.callback = {};

        this.uping = false;

        this.canvasResize = canvasResize;

        if (this.ops.preToken) this._get_token();
    }

    _createClass(upload, [{
        key: 'protocol',
        value: function protocol(url) {
            var _protocol = location.href.indexOf('https') == 0 ? 'https:' : 'http:';
            if (typeof url == 'string' && url.indexOf('http') == -1) {
                return _protocol + url;
            } else {
                return url;
            }
        }
        // 对外暴露api
        // @param target 需要上传的目标图片 file/blob/base64
        // @param success 成功回调 第一个参数为 { pic:url , type:上传途径 , uploadTime:上传时间，canvasTime:转成base64的时间 }
        // @param error 失败回调 参数为 { msg:'' , xhr: }
        // @param start
        // @param progress 进度回调 参数为 { status: start / pending / complete}

    }, {
        key: 'up',
        value: function up(target) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var error = arguments[2];

            var _this = this;

            var start = arguments[3];
            var progress = arguments[4];

            var successCb = void 0,
                errorCb = void 0,
                startCb = void 0,
                progressCb = void 0;

            // 兼容两种参数传入方式
            if (typeof callback == 'function') {
                successCb = callback;
                errorCb = error || function () {};
                startCb = start || function () {};
                progressCb = progress || function () {};
            } else if ((typeof callback === 'undefined' ? 'undefined' : _typeof(callback)) == 'object') {
                successCb = callback.success || function () {};
                errorCb = callback.error || function () {};
                startCb = callback.start || function () {};
                progressCb = callback.progress || function () {};
            }

            // 容错机制
            if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object' && typeof target !== 'string') {
                console.error('upload target is wrong!');
                errorCb({ msg: '错误的上传对象' });
                return;
            }
            if (this.uping) {
                console.error('one upload instance can not upload two images at the same time!');
                errorCb({ msg: '单个实例无法同时多次上传' });
                return;
            }

            var tar_type = typeof target == 'string' ? 'b64' : 'file';
            this.uping = true;
            this.img_type = utils._get_img_type(target);
            this.callback.success = successCb;
            this.callback.error = errorCb;
            this.callback.start = startCb;
            this.callback.progress = progressCb;

            // 低端手机由于不支持base64转blob，因此oss和s3无法直传base64，只能使用qiniu；
            if (this.lowVersion && this.ops.type !== 1 && this.ops.type !== 'qiniu' && tar_type == 'b64') {
                console.log('becasuse of the lowVersion of phone,it has to upload by qiniu!');
                this.type = 'qiniu';
                this.token = null;
            }

            // 开始上传，获取token
            this._get_token(function () {
                // token获取后，上传开始的钩子函数
                _this.callback.start();
                _this.callback.progress(0);

                if (tar_type == 'b64') {

                    // 如果文件格式为base64，在低版本 || 途径为 qiniu 时，直接使用七牛进行上传;
                    // 当途径为s3 && oss && 高版本浏览器时，会将base64转换成blob对象再上传s3/oss途径

                    _this._handle_b64(target, function (b64) {
                        if (_this.type == 'qiniu' || _this.type == 'meitu' || _this.lowVersion) {
                            _this._up_b64_qiniu_meitu(b64);
                        } else {
                            var file = utils._dataURLtoBlob(b64);
                            _this._up_file(file);
                        }
                    });
                } else if (tar_type == 'file') {

                    // 如果文件格式为file，在高版本浏览器中，会通过canvas进行压缩后转成base64再转成blob进行上传
                    // 在低版本浏览器中，则会直接上传原图
                    if (!_this.lowVersion) {
                        _this._to_b64(target, function (b64) {

                            // 压缩后如果途径为qiniu，则直接使用base64进行上传
                            // 如果为oss/s3，则转换成blob对象后上传
                            if (_this.type == 'qiniu' || _this.type == 'meitu') {
                                _this._up_b64_qiniu_meitu(b64);
                            } else {
                                var base64 = b64.indexOf('data:image') !== -1 ? b64 : 'data:image/jpeg;base64,' + b64;
                                var file = utils._dataURLtoBlob(base64);
                                _this._up_file(file);
                            }
                        });
                    } else {
                        _this._up_file(target);
                    }
                }
            });
        }
    }, {
        key: 'fileToBase64',
        value: function fileToBase64(file, ops) {
            canvasResize(file, {
                width: ops.width || 3000,
                crop: false,
                quality: ops.quality || .9,
                rotate: ops.rotate || 0,
                callback: function callback(b64) {
                    ops.success && ops.success(b64);
                }
            });
        }
        // 获取token

    }, {
        key: '_get_token',
        value: function _get_token() {
            var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

            var url = this.ops.api.token[this.type];
            var data = void 0,
                dataType = void 0;
            var self = this;
            if (this.token) {
                cb();
                return;
            }
            switch (this.type) {
                case 'oss':
                case 'qiniu':
                case 'meitu':
                    data = this.ops.tokenParams;
                    dataType = 'json';
                    break;
                case 's3':
                    data = _extends({
                        bucket: 'h5-jp',
                        file_type: this.img_type || 'jpg'
                    }, this.ops.tokenParams);
                    dataType = 'jsonp';
                    break;
                default:
            }
            utils._ajax({
                url: url,
                data: data,
                dataType: dataType,
                timeout: this.ops.timeout,
                success: function success(token) {
                    if (!self.token) {
                        if (self.type === 'meitu') {
                            token = token[0].mtyun;
                            self.token = {
                                upload_token: token.token,
                                key: token.key,
                                ttl: token.ttl,
                                url: token.url
                            };
                        } else {
                            self.token = token;
                        }
                    }
                    cb();
                },
                error: function error(xhr) {
                    if (self.callback.error) {
                        self.callback.error({ msg: 'get token fail', xhr: xhr });
                    }
                    self.uping = false;
                }
            });
        }
        // 压缩base64;

    }, {
        key: '_handle_b64',
        value: function _handle_b64(b64, cb) {
            var _this2 = this;

            var st = new Date().getTime();
            var image = new Image();
            var rb64 = void 0;
            var base64 = b64.indexOf('data:image') !== -1 ? b64 : 'data:image/jpeg;base64,' + b64;
            image.onload = function () {
                if (image.width > _this2.ops.width) {
                    var canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d'),
                        ir = image.width / image.height,
                        rw = _this2.ops.width,
                        rh = _this2.ops.width / ir;
                    canvas.width = rw;
                    canvas.height = rh;
                    ctx.drawImage(image, 0, 0, rw, rh);
                    _this2.canvasTime = new Date().getTime() - st;
                    rb64 = canvas.toDataURL('image/jpeg');
                } else {
                    rb64 = b64;
                }
                cb(rb64);
            };
            image.onerror = function () {
                cb(b64);
            };
            image.src = base64;
        }
    }, {
        key: '_to_b64',
        value: function _to_b64(file, cb) {
            var st = new Date().getTime();
            var self = this;
            canvasResize(file, {
                width: this.ops.width,
                crop: false,
                quality: this.ops.quality,
                rotate: 0,
                callback: function callback(b64) {
                    self.canvasTime = new Date().getTime() - st;
                    cb(b64);
                }
            });
        }
    }, {
        key: '_up_file',
        value: function _up_file(file) {
            var _this3 = this;

            var startTime = new Date();
            var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            var fd = new FormData();
            var url = void 0,
                token = void 0;
            if (this.type == 's3') {
                token = this.token.data.inputs;
                url = this.token.data.url;
                for (var i in token) {
                    fd.append(i, token[i]);
                }
            } else if (this.type == 'oss') {
                token = this.token;
                url = this.ops.api.domain[this.type];
                for (var _i in token) {
                    if (_i == 'accessid') {
                        fd.append('OSSAccessKeyId', token[_i]);
                    } else {
                        fd.append(_i, token[_i]);
                    }
                }
            } else if (this.type == 'qiniu' || this.type == 'meitu') {
                token = this.token;
                url = this.ops.api.domain[this.type];
                fd.append('token', this.token.upload_token);
                fd.append('key', this.token.key);
            }
            fd.append('file', file);
            xhr.onreadystatechange = function (response) {
                _this3._up_cb(xhr, response, startTime);
            };
            xhr.ontimeout = function () {
                _this3.callback.error({ msg: 'upload timeout', xhr: xhr });
                _this3.uping = false;
            };
            xhr.upload.addEventListener('progress', this._up_progress.bind(this), false);
            xhr.open('POST', url, true);
            xhr.timeout = this.ops.timeout;
            xhr.send(fd);
        }
    }, {
        key: '_up_b64_qiniu_meitu',
        value: function _up_b64_qiniu_meitu(b64) {
            var _this4 = this;

            var startTime = new Date();
            var url = this.ops.api.domain[this.type] + 'putb64/-1/key/' + utils._encode(this.token.key);
            var base64 = b64.replace('data:image/jpeg;base64,', '').replace('data:image/png;base64,', '');
            var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            xhr.onreadystatechange = function (response) {
                _this4._up_cb(xhr, response, startTime);
            };
            xhr.ontimeout = function () {
                _this4.callback.error({ msg: 'upload timeout', xhr: xhr });
                _this4.uping = false;
            };
            xhr.upload.addEventListener('progress', this._up_progress.bind(this), false);
            xhr.open('POST', url, true);
            xhr.timeout = this.ops.timeout;
            xhr.setRequestHeader('Content-Type', 'application/octet-stream');
            xhr.setRequestHeader('Authorization', 'UpToken ' + this.token.upload_token);

            xhr.send(base64);
        }
    }, {
        key: '_up_progress',
        value: function _up_progress(e) {
            if (e.lengthComputable) this.callback.progress(Math.round(e.loaded * 100 / e.total));
        }
    }, {
        key: '_up_cb',
        value: function _up_cb(xhr, response, st) {
            var s = xhr.status;
            if (xhr.readyState == 4) {
                this.uploadTime = new Date().getTime() - st;
                if (s >= 200 && s < 300) {
                    if (this.type == 's3') {
                        // let xml = xhr.responseText;
                        // let domParser = new DOMParser();
                        // let xmlDoc = domParser.parseFromString(xml, 'text/xml');
                        // 兼容ios 8;
                        // if(xmlDoc.children){
                        //     this.img = xmlDoc.children[0].children[0].innerHTML;
                        // }else{
                        //     this.img = xmlDoc.childNodes[0].childNodes[0].textContent;
                        // }
                        this.img = this.ops.api.imgDomain.s3 + this.token.data.inputs.key;
                    } else if (this.type == 'qiniu' || this.type == 'meitu') {
                        var res = xhr.responseText ? JSON.parse(xhr.responseText) : xhr.responseText;
                        this.img = this.type === 'meitu' ? res.data : this.ops.api.imgDomain[this.type] + res.key;
                    } else if (this.type == 'oss') {
                        // 由于 oss 的图片地址是根据请求地址来的，因此获取的图片地址需要添加协议头；
                        this.img = this.ops.api.imgDomain.oss + this.token.key;
                    }

                    this.__return({
                        img: this.protocol(this.img),
                        uploadTime: this.uploadTime,
                        type: this.type,
                        canvasTime: this.canvasTime,
                        res: {
                            token: this.token,
                            upload: xhr.responseText
                        }
                    });
                } else {
                    this.callback.error({ msg: 'upload xhr.status is not 200', xhr: xhr });
                    this.uping = false;
                }
            }
        }
    }, {
        key: '__return',
        value: function __return(ops) {
            this.token = null;
            this.uping = false;
            this.callback.success(ops);
        }
    }]);

    return upload;
}();

export {upload};
//# sourceMappingURL=upload.es.js.map