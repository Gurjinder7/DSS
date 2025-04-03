import { commonPasswords } from "../utils/common-passwords.js"

export const checkCommonPassword = (req, res, next) => {
    try {

        const { password } = req.body
        
        const isCommon = commonPasswords.filter(cPass => cPass === password)
        console.log(isCommon)
        
        if (isCommon.length) {
            res.status(403).json([{message: 'Common password is dangerous'}])
            return
        }

         next()
        
    } catch (e) {
        res.status(500).json([{message: "Server error", error:e}])
        return
    }

}

export default {
    checkCommonPassword
}