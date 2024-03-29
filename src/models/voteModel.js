import {connection} from '../server.js'

export class voteModel {
    static view = async ({hash}) => {
        try {
            const [findHash] = await connection.query('SELECT 1 FROM awards WHERE hash = ?', [hash])

            return (findHash.length > 0) ? 
            {
                status: 200, content: []
            } : 
            {
                status: 404, content: [{msg: 'The vote link provided does not match with any award.'}]
            }
        } catch {
            return {
                status: 500,
                content: [{msg: 'An internal server has ocurred while trying to access the award.'}]
            }
        }
    }

    static obtainaward = async ({hash}) => {
        try {
            const [findHash] = await connection.query('SELECT id, public FROM awards WHERE hash = ?', [hash])
            if (findHash[0].public == 0) {
                return {
                    status: 403,
                    content: [{msg: 'This award is private.'}]
                }
            }

            if (findHash.length > 0) {
                const [questions] = await connection.query('SELECT BIN_TO_UUID(id) as id, id_award, question, question_type, url FROM questions WHERE id_award = ?', [findHash[0].id])
                return {
                    status: 200,
                    content: questions
                }
            }
        } catch {

        }
    }
}