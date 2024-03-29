import {connection} from '../server.js'

export class awardsModel {
    static obtainAwards = async ({userData}) => {
        const {cookieSessionId} = userData
        
        try {
            const [owner_id] = await connection.query('SELECT BIN_TO_UUID(user_id) as user_id FROM sessions WHERE session_id = UUID_TO_BIN(?)', cookieSessionId)

            if (owner_id.length > 0){
                
                try {
                    const [insertAward] = await connection.query('SELECT id, award_name FROM awards WHERE owner = UUID_TO_BIN(?)', [owner_id[0].user_id])
                    return {
                        status: 200,
                        content: insertAward
                    }
                } catch (e) {
                    console.log(e)
                    return {
                        status: 500,
                        content: [{msg: 'An internal error has ocurred while trying to create a resource.'}]
                    }
                }
            } else {
                return {
                    status: 401,
                    content: [{msg: 'Session id does not match with user id.'}]
                }
            }
        } catch (e) {
            return {
                status: 500,
                content: [{msg: 'An unexpected internal server error has occurred.'}]
            }
        }
    }

    static addAward = async ({awardData}) => {
        let {award_name, cookieSessionId} = awardData
        if (award_name === '' || award_name === undefined) award_name = 'My award'
        
        try {
            const [owner_id] = await connection.query('SELECT BIN_TO_UUID(user_id) as user_id FROM sessions WHERE session_id = UUID_TO_BIN(?)', cookieSessionId)
            
            if (owner_id.length > 0){
                
                try {
                    let hash = generateHash(36)


                    await connection.query('INSERT INTO awards (award_name, owner, hash) VALUES(?, UUID_TO_BIN(?), ?)', [award_name, owner_id[0].user_id, hash])

                    function generateHash(length) {
                        let result = '';
                        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        const charactersLength = characters.length;
                        let counter = 0;
                        while (counter < length) {
                          result += characters.charAt(Math.floor(Math.random() * charactersLength));
                          counter += 1;
                        }
                        return result;
                    }

                    const baseUrl = process.env.BASE_URL || 'http://localhost:5555/';

                    return {
                        status: 200,
                        content: { 
                            msg: 'Resource created succesfully.', 
                            url: baseUrl + 'vote/' + hash
                        }
                    }
                } catch (e) {
                    console.log(e)
                    return {
                        status: 500,
                        content: [{msg: 'An internal error has ocurred while trying to create a resource.'}]
                    }
                }
                

            } else {
                return {
                    status: 401,
                    content: [{msg: 'Session id does not match with user id.'}]
                }
            }
        } catch (e) {
            return {
                status: 500,
                content: [{msg: 'An unexpected internal server error has occurred.'}]
            }
        }
    }

    static removeAward = async ({awardData}) => {
        const {award_name, award_id, cookieSessionId} = awardData
        try {
            const [owner_id] = await connection.query('SELECT BIN_TO_UUID(user_id) as user_id FROM sessions WHERE session_id = UUID_TO_BIN(?)', cookieSessionId)
            
            if (owner_id.length > 0){
                const [awardExists] = await connection.query('SELECT BIN_TO_UUID(owner) as owner FROM awards WHERE id = ? AND award_name = ?', [award_id, award_name])
                
                if (awardExists.length <= 0) {
                    return {
                        status: 400,
                        content: [{msg: 'The resource selected does not exists.'}]
                    }
                } else if (awardExists[0].owner === owner_id[0].user_id) {
                    
                    const [deleteAwards] = await connection.query('DELETE FROM awards WHERE id = ? AND award_name = ? AND owner = UUID_TO_BIN(?)', [award_id, award_name, awardExists[0].owner])
                    if (deleteAwards.affectedRows > 0) {
                        return {
                            status: 204
                        }
                    } else {
                        return {
                            status: 400,
                            content: [{msg: 'The resource selected does not match with user id.'}]
                        }
                    }
                } else {
                    return {
                        status: 400,
                        content: [{msg: 'The resource selected does not match with user id.'}]
                    }
                }
            } else {
                return {
                    status: 401,
                    content: [{msg: 'Session id does not match with user id.'}]
                }
            }
        } catch(e) {
            return {
                status: 500,
                content: [{msg: 'An unexpected internal server error has occurred while trying to delete a resource.'}]
            }
        }
    }

    static updateAward = async ({awardData}) => {
        const {award_name, award_id, new_award_name, cookieSessionId, is_public} = awardData
        let trimedNewName
        if (new_award_name !== undefined){
            trimedNewName = new_award_name.trim()
        }
        if (trimedNewName === '') {
            return {
                status: 400,
                content: [{msg: 'The new name entered is not valid.'}]
            }
        } else if (trimedNewName === award_name.trim()) {
            return {
                status: 400,
                content: [{msg: 'New name can not be the same as before.'}]
            }
        }
        try {
            const [owner_id] = await connection.query('SELECT BIN_TO_UUID(user_id) as user_id FROM sessions WHERE session_id = UUID_TO_BIN(?)', cookieSessionId)
            
            if (owner_id.length > 0){
                const [awardExists] = await connection.query('SELECT BIN_TO_UUID(owner) as owner FROM awards WHERE id = ? AND award_name = ?', [award_id, award_name])
                
                if (awardExists.length <= 0) {
                    return {
                        status: 400,
                        content: [{msg: 'The resource selected does not exists.'}]
                    }
                } else if (awardExists[0].owner === owner_id[0].user_id) {
                    let is_public_notconst
                    if (is_public === undefined || is_public === null) {
                        is_public_notconst = 0
                    } else if (is_public >= 1) {
                        is_public_notconst = 1
                    } else {
                        is_public_notconst = 0
                    }
                    let name = (trimedNewName === '' || trimedNewName === undefined) ? award_name : trimedNewName

                    const [updateAward] = await connection.query('UPDATE awards SET award_name = ?, public = ? WHERE id = ? AND award_name = ? AND owner = UUID_TO_BIN(?)', [name, is_public_notconst, award_id, award_name, awardExists[0].owner])
                    if (updateAward.affectedRows > 0) {
                        return {
                            status: 204
                        }
                    } else {
                        return {
                            status: 400,
                            content: [{msg: 'The resource selected does not match with user id.'}]
                        }
                    }
                } else {
                    return {
                        status: 400,
                        content: [{msg: 'The resource selected does not match with user id.'}]
                    }
                }
            } else {
                return {
                    status: 401,
                    content: [{msg: 'Session id does not match with user id.'}]
                }
            }
        } catch(e) {
            return {
                status: 500,
                content: [{msg: 'An unexpected internal server error has occurred while trying to update a resource.'}]
            }
        }
    }
}