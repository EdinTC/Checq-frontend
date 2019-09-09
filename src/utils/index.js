const getQueryParam = () => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.has('q')) {
        return queryParams.get('q');
    }
    return '';
}

const extractHostname = (url) => {
    let hostname;

    //find & remove protocol (http, ftp, etc.) and get hostname
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

export { getQueryParam, extractHostname };