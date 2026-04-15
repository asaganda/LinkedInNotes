const getInitials = (name: string): string => {
    const nameArray = name.split(" ");
    if (nameArray.length > 2) {
        return `${nameArray[0][0].toUpperCase() + nameArray[nameArray.length - 1][0].toUpperCase()}`
    } else if (nameArray.length > 1) {
        return `${nameArray[0][0].toUpperCase() + nameArray[1][0].toUpperCase()}`
    } else {
        return `${nameArray[0][0].toUpperCase()}`
    }
}

export default getInitials
