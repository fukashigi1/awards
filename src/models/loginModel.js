import {validateEmail} from '../utils/fnUtilsBE.js'
import {connection} from '../server.js'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';


export class loginModel {
    static login = async ({userData, cookie}) => {
        // const [deleteCookie] = await connection.query('DELETE FROM session WHERE session_id = UUID_TO_BIN(?)', cookie)
        

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
                
                if (existSession.length > 0) {
                    return {
                        status: 200,
                        content: [{msg: "User is already loged in."}] 
                    };
                } else {
                    const sessionId = uuidv4()
                    const [insertSession] = await connection.query('INSERT INTO sessions (session_id, email, user_id) VALUES(UUID_TO_BIN(?), ?, ?)', [sessionId, selectResult[0].email, selectResult[0].id])

                    if (cookie) {
                        try {
                            //const [obtainUserId] = await connection.query('SELECT BIN_TO_UUID(id) as id FROM users WHERE email = ?', [trimmedInput])
                            //const [deleteCookie] = await connection.query('DELETE FROM session WHERE session_id = UUID_TO_BIN(?)', cookie)
                            const [obtainUserIdFromSession] = await connection.query('SELECT user_id FROM sessions WHERE session_id = UUID_TO_BIN(?)', [cookie])
                            
                            if (obtainUserIdFromSession[0].user_id != selectResult[0].id) {
                                const [deleteCookie] = await connection.query('DELETE FROM sessions WHERE session_id = UUID_TO_BIN(?)', cookie)
                                
                            }
                        } catch (e){
                            return {
                                status: 500,
                                content: [{msg: 'An internal server error has occurred.'}]
                            };
                        }
                    }

                    return {
                        status: 200,
                        content: [{msg: "User loged in succesfully.", sessionId: sessionId}] 
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

    static logout = async ({cookie}) => {
        if (cookie) {
            const cookieArray = cookie.replace('; ', '=').split('=')
            const indexCookie = cookieArray.indexOf('session')
            if (indexCookie !== -1) {
                const userSessionCookie = cookieArray[indexCookie + 1]
                console.log(cookieArray, indexCookie, userSessionCookie)

                try {
                    const [selectSessionId] = await connection.query('SELECT session_id FROM sessions WHERE session_id = UUID_TO_BIN(?)', [userSessionCookie])

                    if (selectSessionId.length > 0) {
                        const [deleteSessionId] = await connection.query('DELETE FROM sessions WHERE session_id = UUID_TO_BIN(?)', [userSessionCookie])
                        
                        return {
                            status: 204
                        }

                    } else {
                        return {
                            status: 401
                        }
                    }
                } catch (e) {
                    return {
                        status: 500
                    }
                }

            } else {
                return {
                    status: 401
                }
            }
        } else {
            return  {
                status: 401
            }
        }
    }
}