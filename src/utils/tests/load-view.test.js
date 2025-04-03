import { getView } from "../load-view.js"


test('Should return a html path', () => {
    expect(getView('register').not.toBeUndefined())
})