import { ObjectId } from "mongodb";
import { Response } from "express";
export type Errore = {
    errore: string;
};
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
    constructor(strConn: string, nomeDatabase: string, collezione?: string);
    /**
     * @description Crea un oggetto ID data una string
     * @param {string} id Stringa da convertire
     * @returns {ObjectId} Oggetto ObjectId corrispondente
     */
    ID(id: string): ObjectId;
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
    SettaCollezione(collezione: string): void;
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
    SettaDatabase(nomeDatabase: string): void;
    /**
     * @description Restituisce la stringa di connessione corrente
     * @returns {string} Stringa di connessione
     */
    get StrConn(): string;
    /**
     * @description Restituisce tutti i risultati della query
     * @param {Record<string, any>} query Query da eseguire
     * @param {Record<string, number>} projection Campi da proiettare
     * @param {{sort: any, direction? : number | ('asc' | 'desc')}} sort Ordinamento -- {sort : nomeCampo, direction : "asc" | "desc"}
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Record<string, any> | Errore>} Risultato della query
     */
    PrendiMolti(query?: Record<string, any>, projection?: Record<string, number>, sort?: {
        sort: any;
        direction?: number | ('asc' | 'desc');
    }): Promise<Record<string, any> | Errore>;
    /**
     * @description Restituisce il primo risultato della query
     * @param {Record<string, any>} query Query da eseguire
     * @param {Record<string, number>} projection Campi da proiettare
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Projection & Record<string, any> | Errore>} Risultato della query
     */
    PrendiUno(query?: Record<string, any>, projection?: Record<string, number>): Promise<Record<string, any> | Errore>;
    /**
     * @description Restituisce la corrispondenza con l'ID specificato
     * @param {string} id ID del record
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Record<string, any>>} Risultato della query
     * @deprecated Usare ID()
     */
    CercaID(id: string): Promise<Record<string, any>>;
    /**
     * @description Restituisce la corrispondenza con l'ID specificato
     * @param {Record<string, any>[]} oggetti Record da inserire
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise< Insert | Errore >} Risultato della query
     */
    Inserisci(...oggetti: Record<string, any>[]): Promise<Insert | Errore>;
    /**
     * @description Aggiorna il primo record che corrisponde al filtro
     * @param {Record<string, any>} filtro Filtro per la query
     * @param {Record<string, any>} update Aggiornamento da applicare
     * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Update | Errore>} Risultato della query
     */
    UpdateUno(filtro: Record<string, any>, update: Record<string, any>, upsert?: boolean): Promise<Update | Errore>;
    /**
    * @description Aggiorna tutti i record che corrispondono al filtro
    * @param {Record<string, any>} filtro Filtro per la query
    * @param {Record<string, any>} update Aggiornamento da applicare
    * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
    * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
    * @returns {Promise<Update | Errore>} Risultato della query
    */
    UpdateMolti(filtro: Record<string, any>, update: Record<string, any>, upsert?: boolean): Promise<Update | Errore>;
    /**
     * @description Aggiorna tutti i record che corrispondono al filtro
     * @param {Record<string, any>} filtro Filtro per la query
     * @param {Record<string, any>} oggetto Oggetto che rimpiazza il record
     * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Replace | Errore>} Risultato della query
     */
    SostituisciUno(filtro: Record<string, any>, oggetto: Record<string, any>, upsert?: boolean): Promise<Replace | Errore>;
    /**
     * @description Elimina il primo record che corrisponde al filtro
     * @param {Record<string, any>} query Filtro per la query
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Delete | Errore>} Risultato della query
     */
    EliminaUno(query: Record<string, any>): Promise<Delete | Errore>;
    /**
     * @description Elimina tutti i record che corrispondono al filtro
     * @param {Record<string, any>} query Filtro per la query
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Delete | Errore>} Risultato della query
     */
    Elimina(query: Record<string, any>): Promise<Delete | Errore>;
    /**
     * @description Restituisce il numero di record che corrispondono al filtro
     * @param {Record<string, any>} query Filtro per la query
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<number | Errore>} Risultato della query
     */
    NumeroRecord(query?: Record<string, any>): Promise<number | Errore>;
    /**
     * @description Restituisce i valori distinti di un campo
     * @param {string} record Campo su cui applicare il distinct
     * @param {Record<string, any>} query Filtro per la query
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Record<string, any>>} Risultato della query
     */
    PrendiDistinct(record: string, query?: Record<string, any>): Promise<Record<string, any>>;
    /**
     * @description Sostuisce il primo record che corrisponde al filtro mantenendo l'ID
     * @param {Record<string, any>} query Filtro per la query
     * @param {string} nuovo Campo che rimpiazza il campo specificato in query
     * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Replace | Errore>} Risultato della query
     */
    Replace(query: Record<string, any>, nuovo: Record<string, any>, upsert?: boolean): Promise<Replace | Errore>;
    private EseguiQuery;
    private Connetti;
    private Client;
    private Prompt;
    /**
     * @description Controlla se un record è di errore e, in caso affermativo, può inviare una risposta HTTP
     * @param {Errore | T } record Oggetto da controllare
     * @param {Response} response Risposta HTTP che manderà l'errore
     * @param {Record<string, any> | string} messaggio Messaggio di errore da inviare
     * @returns { record is Errore }
     */
    Errore<T = any>(record: Errore | T, response?: Response, messaggio?: Record<string, any> | string): record is Errore;
}
export { MongoDriver };
