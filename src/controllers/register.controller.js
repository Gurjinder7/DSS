import { pgClient } from "../psql.js";

// not exporting here gives router callback error
export const registerUser = async (req, res) => {
    try {
        const {username, password } = req.body;

        //  add postgres work herer
        await pgClient.query("SELECT * from USERS").then(res => {
            console.log('works!', res.rows)
        }).catch(e => {
            console.log(e)
        }).finally(() => {
            
        });

        // console.log(asd)

        res.status(200).json({
            message: 'User registered successfully',
            user: {
                username:username,
                password: password
            }
        });

    } catch (e) {
        console.log(e)
        res.status(500).json({error: e})
    }
}


export default {
    registerUser
}