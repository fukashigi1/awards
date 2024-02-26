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
                    const [insertAward] = await connection.query('INSERT INTO awards (award_name, owner) VALUES(?, UUID_TO_BIN(?))', [award_name, owner_id[0].user_id])
                    return {
                        status: 201,
                        content: [{msg: 'Resource created succesfully.'}]
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

    static updateAward = async ({userData}) => {
        
    }
}
// necesito recibir owner id y la id del award
// para obtener el owner id, puedo obtener el uuid de la session y buscar la id del usuario logeado
// para obtener el id del award simplemente lo paso por el front end.