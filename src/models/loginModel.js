import {validateEmail} from '../utils/fnUtilsBE.js'
import {connection} from '../server.js'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';


export class loginModel {
    static login = async ({userData}) => {
        const {usernameEmailInput, passwordInput} = userData;
        const trimmedInput = usernameEmailInput.trim();
    
        if (!trimmedInput || !passwordInput) {
            return {
                status: 400,
                content: [{msg: 'A value has not been delivered. Please check your input.'}]
            };
        }
    
        const isEmail = validateEmail(trimmedInput);
        const query = isEmail ? 'SELECT id, username, email, pass FROM users WHERE email = ?;' : 'SELECT id, username, email, pass FROM users WHERE username = ?';
    
        try {
            const [selectResult] = await connection.query(query, [trimmedInput]);
    
            if (selectResult.length === 0) {
                return {
                    status: 401,
                    content: [{msg: `The ${isEmail ? 'email' : 'username'} you entered is not connected to an account.`, element: 'usernameEmailInput'}]
                };
            }
    
            const isPasswordCorrect = await bcrypt.compare(passwordInput, selectResult[0].pass);
    
            if (isPasswordCorrect) {
                const [existSession] = await connection.query('SELECT session_id FROM sessions WHERE email = ?', selectResult[0].email)
                console.log(existSession)
                if (existSession.length > 0) {
                    return {
                        status: 204,
                        content: [{msg: "User is already loged in."}] // GENERAR TOKENS O COOKIES, INVESTIGAR
                    };
                } else {
                    const sessionId = uuidv4()
                    const [insertSession] = await connection.query('INSERT INTO sessions (session_id, email, user_id) VALUES(UUID_TO_BIN(?), ?, ?)', [sessionId, selectResult[0].email, selectResult[0].id])
                    return {
                        status: 200,
                        content: [{msg: "User loged in succesfully.", sessionId: sessionId}] // GENERAR TOKENS O COOKIES, INVESTIGAR
                    };
                }
                
            } else {
                return {
                    status: 401,
                    content: [{msg: 'The password entered is not correct.', element: 'passwordInput'}]
                };
            }
        } catch (error) {
            return {
                status: 500,
                content: [{msg: 'An internal server error has occurred.'}]
            };
        }
    };
}