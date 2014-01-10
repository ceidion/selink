define(["moment-timezone"], function (moment) {
    moment.tz.add({
        "zones": {
            "Asia/Tokyo": [
                "9:18:59 - LMT 1887_11_31_15",
                "9 - JST 1896 9",
                "9 - CJT 1938 9",
                "9 Japan J%sT"
            ]
        },
        "rules": {
            "Japan": [
                "1948 1948 4 1 0 2 0 1 D",
                "1948 1951 8 8 6 2 0 0 S",
                "1949 1949 3 1 0 2 0 1 D",
                "1950 1951 4 1 0 2 0 1 D"
            ]
        },
        "links": {}
    });
});