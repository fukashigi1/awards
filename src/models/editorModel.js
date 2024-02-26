import {connection} from '../server.js'

export class editorModel {
    static view = async ({awardData}) => {
        const {award_id, award_name, session_id} = awardData
        
        // primero obtener el user id con la session id y revisar que ese award existe.
        // hacer un select y mostrar las questions asosciadas a ese award
    }

    static saveQuestions = async () => {

    }
}