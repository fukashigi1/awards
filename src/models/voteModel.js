import { response } from 'express'
import {connection} from '../server.js'
import {obtainQuestionTypes} from '../utils/fnUtilsBE.js'

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
                const [questions] = await connection.query('SELECT BIN_TO_UUID(id) as id, id_award, question, question_type, url, question_choices, description, mandatory FROM questions WHERE id_award = ?', [findHash[0].id])
                return {
                    status: 200,
                    content: questions
                }
            } else {
                return {
                    status: 400,
                    content: [{msg: 'Award not found.'}]
                }
            }
        } catch {
            return {
                status: 500,
                content: [{msg: 'An internal server error courred while trying to obtain the award information.'}]
            }
        }
    }

    static sendResponses = async (responseInformation) => {
        let {responses, email, id_award} = responseInformation
        if (!validateEmail(email)) {
            return {
                status: 400,
                content: [{msg: 'The email is not valid or not allowed to vote'}]
            }
        }

        try {
            const [checkPublicClosed] = await connection.query('SELECT public, closed FROM awards WHERE id = ?', [id_award])

            if (checkPublicClosed.length == 0) {
                return {
                    status: 400,
                    content: [{msg: 'This resource was not found.'}]
                }
            }

            if (checkPublicClosed[0].public == 0) {
                return {
                    status: 403,
                    content: [{msg: 'You are not authorized to vote on this award.'}]
                }
            }
            if (checkPublicClosed[0].closed == 1) {
                return {
                    status: 410,
                    content: [{msg: 'This award is now closed.'}]
                }
            }   
            let question_types = await obtainQuestionTypes()
            const [obtainQuestions] = await connection.query('SELECT BIN_TO_UUID(id) as id, question_type, mandatory FROM questions WHERE id_award = ? ORDER BY order_id', [id_award])
            let publish = []
            let responsesWithErrors = []
            let questionIds = []
            let responseIds = []

            for (let question of obtainQuestions) {
                let finded = false;

                for (let response of responses) {

                    if (!responseIds.includes(response.question_id))
                        responseIds.push(response.question_id)

                    if (question.mandatory == 1) {
                        if (!questionIds.includes(question.id))
                            questionIds.push(question.id)

                        if (question.id == response.question_id) {
                            if (response.user_response === "" || response.user_response === undefined || response.user_response === null || response.question_type != question.question_type){
                                responsesWithErrors.push([response, "Your response is not valid."])
                            } else {
                                if (!publish.includes(response))
                                    publish.push(response)
                            }
                            finded = true;
                            break
                        }
                        finded = false;
                    } else {
                        if (question.id == response.question_id) {
                            if (response.question_type != question.question_type){
                                responsesWithErrors.push([question, "The question type provided, does not match with the question."])
                            } else {
                                publish.push(response)
                            }
                            finded = true;
                        }
                    }
                }
                if (finded == false) {
                    responsesWithErrors.push([question, "This question was mandatory."])
                }
            }
            //console.log(responseIds)
            //console.log(questionIds)
            //console.log("publish", publish)
            //console.log("responsesWithErrors", responsesWithErrors) 
            
            if (responsesWithErrors.length == 0) {
                const [verifyDupedResponse] = await connection.query('SELECT 1 FROM responses WHERE email = ? AND id_award = ?', [email, id_award])
                console.log(verifyDupedResponse)
                if (verifyDupedResponse.length > 0) {
                    return {
                        status: 403,
                        content: {msg: 'You have already participated in this award.'}
                    }
                }
                for (let response of responses) {
                    try {
                        const [sendResponses] = await connection.query('INSERT INTO responses (email, question_type, user_response, question_id, id_award) VALUES(?, ?, ?, UUID_TO_bIN(?), ?)', [email, response.question_type, response.user_response, response.question_id, id_award])

                    } catch {
                        return {
                            status: 500,
                            content: {msg: 'An error has ocurred while saving your responses.'}
                        }
                    }
                }

                return {
                    status: 204,
                    content: {}
                }
            } else {
                return {
                    status: 400,
                    content: {responsesWithErrors, msg: 'Some responses are invalid.'}
                }
            }

            // Funciona :)
            // Todas las verificacione se hacen y se detectan las fallas, enviar respuestas.
            // se podria empezar con la interfaz, no es necesario crear AUN la interfaz de creación.
            

        } catch {
            return {
                status: 500,
                content: [{msg: 'An internal server error has ocurred.'}]
            }
        }
        

        function validateEmail(email) {
            return true;
        }
    }
}