const normaliseLinkedinUrl = (url: string): string => {
    const match = url.match(/https:\/\/www\.linkedin\.com\/in\/([^/?#]+)/);
    if (!match) return url;
    return `https://www.linkedin.com/in/${match[1]}`;
};

export default normaliseLinkedinUrl;
