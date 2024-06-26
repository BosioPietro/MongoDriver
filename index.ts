import {Collection, MongoClient, ObjectId } from "mongodb";
import { Response } from "express";

export type Errore = {
    errore: string
}

interface Projection extends Record<string, any> {
    _id: ObjectId;
}

type Insert = {
    acknowledged: boolean,
    insertedId: ObjectId | number
}

type Update = {
    acknowledged: boolean,
    modifiedCount: number,
    matchedCount: number,
    upsertedCount?: number,
    upsertedId?: ObjectId | number
}

type Replace = {
    acknowledged: boolean,
    modifiedCount: number,
    matchedCount: number,
    upsertedCount?: number,
    upsertedId?: ObjectId | number
}

type Delete = {
    acknowledged: boolean,
    deletedCount: number

}


/**
 * @description Driver per MongoDB
 * @class MongoDriver
 * @exports MongoDriver
 */
class MongoDriver{
    

    constructor(strConn : string, nomeDatabase : string, collezione? : string){
        this.strConn = strConn;

        this.SettaDatabase(nomeDatabase);
        if(collezione) this.SettaCollezione(collezione);
    }
    /**
     * @description Crea un oggetto ID data una string
     * @param {string} id Stringa da convertire
     * @returns {ObjectId} Oggetto ObjectId corrispondente
     */
    public ID(id : string) : ObjectId{
        if(!ObjectId.isValid(id)) throw new Error("ID non valido");
        return new ObjectId(id)
    }

    private strConn : string;
    private database : string = "";
    private collezione : string = "";

    /**
     * @description Restituisce il nome della collezione corrente
     * @returns {string} Nome della collezione
     */
    get Collezione() : string { return this.collezione }

    /**
     * @description Imposta il nome della collezione corrente
     * @param {string} collezione Nome della collezione
     * @throws {Error} Se la collezione non esiste
     */
    public SettaCollezione(collezione : string) {
        this.collezione = collezione;
    }

    /**
     * @description Ritorna la lista delle collezioni nel database
     * @throws Ritorna un oggetto col campo "errore" contente il messaggio
     * @returns {Promise<{collezioni? : string[], errore? : string}>} Un array col nome delle collezioni
     */

    public async Collezioni() : Promise<{collezioni? : string[], errore? : string}> {
        try
        {
            const { client } = await this.Connetti();
            const db = client.db(this.database);
            const collezioni = await db.listCollections().toArray();

            client.close();

            return {"collezioni" : collezioni.map(c => c.name)};
        }
        catch(err){ return { "errore" : err as string } }
    }

    /**
     * @description Restituisce il nome del database corrente
     * @returns {string} Nome del database
     */
    get Database() : string { return this.database }

    /**
     * @description Imposta il nome del database corrente
     * @param {string} nomeDatabase Nome del database
     * @throws {Error} Se il database non esiste
     */
    public SettaDatabase(nomeDatabase : string){
        this.database = nomeDatabase;
    } 

    /**
     * @description Restituisce la stringa di connessione corrente
     * @returns {string} Stringa di connessione
     */
    get StrConn() : string { return this.strConn }
    

    /**
     * @description Restituisce tutti i risultati della query
     * @param {Record<string, any>} query Query da eseguire
     * @param {Record<string, number>} projection Campi da proiettare
     * @param {{sort: any, direction? : number | ('asc' | 'desc')}} sort Ordinamento -- {sort : nomeCampo, direction : "asc" | "desc"}
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Record<string, any>[] | Errore>} Risultato della query
     */
    public async PrendiMolti(query: Record<string, any> = {}, projection: Record<string, number> = {}, sort: {sort : any, direction? : number | ('asc' | 'desc')} = {sort: {}}) : Promise<Record<string, any>[] | Errore> {        
        const {client, collection} = await this.Connetti();
    
        return this.EseguiQuery(async () => collection.find(query).project(projection as any).sort(Object.values(sort)).toArray(), client);
    } 

    /**
     * @description Restituisce il primo risultato della query
     * @param {Record<string, any>} query Query da eseguire
     * @param {Record<string, number>} projection Campi da proiettare
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Projection & Record<string, any> | Errore>} Risultato della query
     */
    public async PrendiUno(query: Record<string, any> = {}, projection: Record<string, number> = {}) : Promise<Record<string, any> | Errore> {
        const {client, collection} = await this.Connetti();
    
        return this.EseguiQuery(async () => collection.findOne(query, { projection : projection as any }), client);
    }

    /**
     * @description Restituisce la corrispondenza con l'ID specificato
     * @param {string} id ID del record
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Record<string, any>>} Risultato della query
     * @deprecated Usare ID()
     */
    public CercaID(id : string) : Promise<Record<string, any>>{
        return this.PrendiUno({"_id" : new ObjectId(id)});
    }

    /**
     * @description Restituisce la corrispondenza con l'ID specificato
     * @param {Record<string, any>[]} oggetti Record da inserire
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise< Insert | Errore >} Risultato della query
     */
    public async Inserisci(...oggetti: Record<string, any>[]) : Promise< Insert | Errore > {
        const {client, collection} = await this.Connetti();
        const rq = oggetti.length == 1 ? collection.insertOne(oggetti[0]) : collection.insertMany(oggetti);

        return this.EseguiQuery<Insert>(() => rq, client);
    }

    /** 
     * @description Aggiorna il primo record che corrisponde al filtro
     * @param {Record<string, any>} filtro Filtro per la query
     * @param {Record<string, any>} update Aggiornamento da applicare
     * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Update | Errore>} Risultato della query
     */
    public async UpdateUno(filtro : Record<string, any>, update : Record<string, any>, upsert : boolean = false) : Promise<Update | Errore> {
        const {client, collection} = await this.Connetti(); 

        return this.EseguiQuery<Update>(() => collection.updateOne(filtro, update, { upsert }), client);
    }

     /**
     * @description Aggiorna tutti i record che corrispondono al filtro
     * @param {Record<string, any>} filtro Filtro per la query
     * @param {Record<string, any>} update Aggiornamento da applicare
     * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Update | Errore>} Risultato della query
     */
    public async UpdateMolti(filtro : Record<string, any>, update : Record<string, any>, upsert : boolean = false) : Promise<Update | Errore> {
        const {client, collection} = await this.Connetti(); 

        return this.EseguiQuery<Update>(() => collection.updateMany(filtro, update, { upsert }), client);
    }

    /**
     * @description Aggiorna tutti i record che corrispondono al filtro
     * @param {Record<string, any>} filtro Filtro per la query
     * @param {Record<string, any>} oggetto Oggetto che rimpiazza il record
     * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Replace | Errore>} Risultato della query
     */
    public async SostituisciUno(filtro: Record<string, any>, oggetto: Record<string, any>, upsert: boolean = false) : Promise<Replace | Errore> {
        const {client, collection} = await this.Connetti(); 

        return this.EseguiQuery<Replace>(() => collection.replaceOne(filtro, oggetto, { upsert }), client);
    }

    /**
     * @description Elimina il primo record che corrisponde al filtro
     * @param {Record<string, any>} query Filtro per la query
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Delete | Errore>} Risultato della query
     */
    public async EliminaUno(query : Record<string, any>) : Promise<Delete | Errore> {
        const {client, collection} = await this.Connetti(); 

        return this.EseguiQuery<Delete>(() => collection.deleteOne(query), client);
    }

    /**
     * @description Elimina tutti i record che corrispondono al filtro
     * @param {Record<string, any>} query Filtro per la query
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Delete | Errore>} Risultato della query
     */
    public async Elimina(query : Record<string, any>) : Promise< Delete | Errore> {
        const {client, collection} = await this.Connetti(); 

        return this.EseguiQuery<Delete>(() => collection.deleteMany(query), client);
    }

    /**
     * @description Restituisce il numero di record che corrispondono al filtro
     * @param {Record<string, any>} query Filtro per la query
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<number | Errore>} Risultato della query
     */
    public async NumeroRecord(query : Record<string, any> = {}) : Promise<number | Errore> {
        const {client, collection} = await this.Connetti(); 

        return this.EseguiQuery<number>(() => collection.countDocuments(query), client);
    }

    /**
     * @description Restituisce i valori distinti di un campo
     * @param {string} record Campo su cui applicare il distinct
     * @param {Record<string, any>} query Filtro per la query
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Record<string, any>>} Risultato della query
     */
    public async PrendiDistinct(record : string, query : Record<string, any> = {}) : Promise<Record<string, any>> {
        const {client, collection} = await this.Connetti(); 

        return this.EseguiQuery(() => collection.distinct(record, query), client);
    }

    /**
     * @description Sostuisce il primo record che corrisponde al filtro mantenendo l'ID
     * @param {Record<string, any>} query Filtro per la query
     * @param {string} nuovo Campo che rimpiazza il campo specificato in query
     * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Replace | Errore>} Risultato della query
     */
    public async Replace(query : Record<string, any>, nuovo : Record<string, any>, upsert : boolean = false) : Promise<Replace | Errore> {
        const {client, collection} = await this.Connetti(); 

        return this.EseguiQuery<Replace>(() => collection.replaceOne(query, nuovo, { upsert }), client);
    }
    
    private async EseguiQuery<T = Record<string, any>>(funzione_query : Function, client : MongoClient) : Promise<T | Errore>{
        try
        {
            const data = await funzione_query();
            this.Prompt("Query eseguita con successo");
            return data;
        }
        catch(err)
        {
            this.Prompt("Errore esecuzione query: " + err as string);
            return { "errore" : err as string };
        }
        finally { client.close() }
    }

    private async Connetti() : Promise<{client : MongoClient, collection : Collection}> {
        const client = await this.Client();
        const collection = client.db(this.database).collection(this.collezione);
        return {client, collection};
    }

    private async Client() : Promise<MongoClient>{
        const client = new MongoClient(this.strConn);
        await client.connect();
        return client;
    }

    private Prompt(...elementi : any[]) : void {
        console.log(">>> ", ...elementi);
    }

    /**
     * @description Controlla se un record è di errore e, in caso affermativo, può inviare una risposta HTTP
     * @param {Errore | T } record Oggetto da controllare
     * @param {Response} response Risposta HTTP che manderà l'errore
     * @param {Record<string, any> | string} messaggio Messaggio di errore da inviare
     * @returns { record is Errore }
     */
    public Errore<T = any>(record : Errore | T, response?: Response, messaggio? : Record<string, any> | string) : record is Errore {
        if(!!record && (record as Errore).errore !== undefined)
        {
            this.Prompt("Errore: " + (record as Errore).errore);
            response?.status(500).send(messaggio || "Errore interno nel server")
            return true;
        }
        else return false;
    }
}

export { MongoDriver }; 