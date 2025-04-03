
// not exporting here gives router callback error
export const registerUser = async (req, res) => {
    try {
        const {username, password } = req.body;

        //  add postgres work herer

        await setTimeout(() => {

        },2000)

        res.status(200).json({
            message: 'User registered successfully',
            user: {
                username:username,
                password: password
            }
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({error: e})
    }
}


export default {
    registerUser
}