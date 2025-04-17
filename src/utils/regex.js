export const containsNoSymbol = (pattern) => {
    const checker = /^[0-9a-zA-Z]+$/g
    return checker.test(pattern) 
}


export const containsAnyNonWordCharacter = (pattern) => {
    const checker = /\W/g
    return checker.test(pattern)

}

export const containsAnyWhiteSpace = (pattern) => {
    const checker = /\s/g
    return checker.test(pattern)

}

export const containOnlyLetters = (pattern) => {
    const checker = /\b[a-zA-Z]{1,}\b/g
    return checker.test(pattern) && !containsAnySymbol(pattern)

}