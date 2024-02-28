import { ObjectId } from "mongodb";
export type Errore = {
    errore: string;
};
type Anyify<T> = {
    [P in keyof T]: any;
};
interface Projection extends Record<string, any> {
    _id: ObjectId;
}
type Insert = {
    acknowledged: boolean;
    insertedId: ObjectId | number;
};
type Update = {
    acknowledged: boolean;
    modifiedCount: number;
    matchedCount: number;
    upsertedCount?: number;
    upsertedId?: ObjectId | number;
};
type Replace = {
    acknowledged: boolean;
    modifiedCount: number;
    matchedCount: number;
    upsertedCount?: number;
    upsertedId?: ObjectId | number;
};
type Delete = {
    acknowledged: boolean;
    deletedCount: number;
};
/**
 * @description Driver per MongoDB
 * @class MongoDriver
 * @exports MongoDriver
 */
declare class MongoDriver {
    private constructor();
    /**
     * @description Crea un oggetto ID data una string
     * @param {string} id Stringa da convertire
     * @returns {ObjectId} Oggetto ObjectId corrispondente
     */
    ID(id: string): ObjectId;
    /**
     * @description Crea un'istanza di MongoDriver
     * @param {string} strConn Stringa di connessione al DB
     * @param {string} nomeDatabase Nome del database
     * @param {string} collezione Nome della collezione
     * @throws {Error} Se la stringa di connessione non è valida
     * @throws {Error} Se il database non esiste
     * @throws {Error} Se la collezione non esiste
     */
    static CreaDatabase(strConn: string, nomeDatabase: string, collezione?: string): Promise<MongoDriver>;
    private strConn;
    private database;
    private collezione;
    /**
     * @description Restituisce il nome della collezione corrente
     * @returns {string} Nome della collezione
     */
    get Collezione(): string;
    /**
     * @description Imposta il nome della collezione corrente
     * @param {string} collezione Nome della collezione
     * @throws {Error} Se la collezione non esiste
     */
    SettaCollezione(collezione: string): Promise<void>;
    /**
     * @description Ritorna la lista delle collezioni nel database
     * @throws Ritorna un oggetto col campo "errore" contente il messaggio
     * @returns {Promise<{collezioni? : string[], errore? : string}>} Un array col nome delle collezioni
     */
    Collezioni(): Promise<{
        collezioni?: string[];
        errore?: string;
    }>;
    /**
     * @description Restituisce il nome del database corrente
     * @returns {string} Nome del database
     */
    get Database(): string;
    /**
     * @description Imposta il nome del database corrente
     * @param {string} nomeDatabase Nome del database
     * @throws {Error} Se il database non esiste
     */
    SettaDatabase(nomeDatabase: string): Promise<void>;
    /**
     * @description Restituisce la stringa di connessione corrente
     * @returns {string} Stringa di connessione
     */
    get StrConn(): string;
    /**
     * @description Restituisce tutti i risultati della query
     * @param {object} query Query da eseguire
     * @param {object} projection Campi da proiettare
     * @param {object} sort Ordinamento -- {sort : nomeCampo, direction : "asc" | "desc"}
     * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<object>} Risultato della query
     */
    PrendiMolti<T extends Record<string, any> = Record<string, any>>(query?: object, projection?: T, sort?: {
        sort: any;
        direction?: number;
    }): Promise<Projection & Anyify<T> | Errore>;
    /**
     * @description Restituisce il primo risultato della query
     * @param {object} query Query da eseguire
     * @param {object} projection Campi da proiettare
     * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<object>} Risultato della query
     */
    PrendiUno<T extends Record<string, any> = Record<string, any>>(query?: object, projection?: T): Promise<Projection & Anyify<T> | Errore>;
    /**
     * @description Restituisce la corrispondenza con l'ID specificato
     * @param {string} id ID del record
     * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<object>} Risultato della query
     * @deprecated Usare ID()
     */
    CercaID(id: string): Promise<object>;
    /**
     * @description Restituisce la corrispondenza con l'ID specificato
     * @param {object[]} oggetti Record da inserire
     * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<object>} Risultato della query
     */
    Inserisci(...oggetti: object[]): Promise<Insert | Errore>;
    /**
     * @description Aggiorna il primo record che corrisponde al filtro
     * @param {object} filtro Filtro per la query
     * @param {object} update Aggiornamento da applicare
     * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
     * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<object>} Risultato della query
     */
    UpdateUno(filtro: object, update: object, upsert?: boolean): Promise<Update | Errore>;
    /**
    * @description Aggiorna tutti i record che corrispondono al filtro
    * @param {object} filtro Filtro per la query
    * @param {object} update Aggiornamento da applicare
    * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
    * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
    * @returns {Promise<object>} Risultato della query
    */
    UpdateMolti(filtro: object, update: object, upsert?: boolean): Promise<Update | Errore>;
    /**
     * @description Aggiorna tutti i record che corrispondono al filtro
     * @param {object} filtro Filtro per la query
     * @param {object} oggetto Oggetto che rimpiazza il record
     * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
     * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<object>} Risultato della query
     */
    SostituisciUno(filtro: object, oggetto: object, upsert?: boolean): Promise<Replace | Errore>;
    /**
     * @description Elimina il primo record che corrisponde al filtro
     * @param {object} query Filtro per la query
     * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<object>} Risultato della query
     */
    EliminaUno(query: object): Promise<Delete | Errore>;
    /**
     * @description Elimina tutti i record che corrispondono al filtro
     * @param {object} query Filtro per la query
     * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<object>} Risultato della query
     */
    Elimina(query: object): Promise<Delete | Errore>;
    /**
     * @description Restituisce il numero di record che corrispondono al filtro
     * @param {object} query Filtro per la query
     * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<object>} Risultato della query
     */
    NumeroRecord(query?: object): Promise<number | Errore>;
    /**
     * @description Restituisce i valori distinti di un campo
     * @param {string} record Campo su cui applicare il distinct
     * @param {object} query Filtro per la query
     * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<object>} Risultato della query
     */
    PrendiDistinct(record: string, query?: object): Promise<object>;
    /**
     * @description Sostuisce il primo record che corrisponde al filtro mantenendo l'ID
     * @param {object} query Filtro per la query
     * @param {string} nuovo Campo che rimpiazza il campo specificato in query
     * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
     * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<object>} Risultato della query
     */
    Replace(query: object, nuovo: object, upsert?: boolean): Promise<Replace | Errore>;
    private EseguiQuery;
    private Connetti;
    private Client;
    private Prompt;

    /**
     * @description Controlla se un record è di errore
     * @param {Errore | T } record Oggetto da controllare 
     * @returns { record is Errore }
     */
    ChkErrore<T = any>(record: Errore | T): record is Errore;
}
export { MongoDriver };
