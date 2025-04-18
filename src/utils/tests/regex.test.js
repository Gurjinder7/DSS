import { containOnlyLetters, containsNoSymbol, containsAnyNonWordCharacter, containsAnyWhiteSpace } from "../regex";

test('should contain only letters', () => {
    expect(containOnlyLetters('ASDASDjhkjh')).toBeTruthy()
    expect(containOnlyLetters('hjsdf234assd')).toBeFalsy()
    expect(containOnlyLetters('kjhkjh$#@$kjkasd')).toBeFalsy()
})


test('should contain no symbols', () => {
    expect(containsNoSymbol('ASDASDjhkjh')).toBeTruthy()
    expect(containsNoSymbol('hjsdf234assd')).toBeTruthy()
    expect(containsNoSymbol('kjhkjh$#@$kj/>kasd')).toBeFalsy()
})


test('should contain any non word letter', () => {
    expect(containsAnyNonWordCharacter('ASDASDjhkjh')).toBeFalsy()
    expect(containsAnyNonWordCharacter('hjsdf234assd')).toBeFalsy()
    expect(containsAnyNonWordCharacter('kjhkjh$#@$kjkasd')).toBeTruthy()
})


test('should contain a white space', () => {
    expect(containsAnyWhiteSpace('ASDASDjhkjh ')).toBeTruthy()
    expect(containsAnyWhiteSpace('hjsdf234assd')).toBeFalsy()
    expect(containsAnyWhiteSpace('kjhkjh$# @$kjkasd')).toBeTruthy()
})