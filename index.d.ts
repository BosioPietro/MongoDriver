import { ObjectId } from "mongodb";

declare module '@bosio/mongodriver' {
    /**
     * @description Driver per MongoDB
     * @class MongoDriver
     * @exports MongoDriver
     */
    class MongoDriver {
        private constructor(strConn: string);
        
        /**
         * @description Crea un'istanza di MongoDriver
         * @param {string} strConn Stringa di connessione al DB
         * @param {string} nomeDatabase Nome del database
         * @param {string} collezione Nome della collezione
         * @throws {Error} Se la stringa di connessione non è valida
         * @throws {Error} Se il database non esiste
         * @throws {Error} Se la collezione non esiste
         */
        public static CreaDatabase(strConn: string, nomeDatabase: string, collezione?: string): Promise<MongoDriver>;
        
        /**
         * @description Crea un oggetto ID data una string
         * @param {string} id Stringa da convertire
         * @returns {ObjectId} Oggetto ObjectId corrispondente
         */
        public ID(id: string): ObjectId;
        
        /**
         * @description Imposta il nome della collezione corrente
         * @param {string} collezione Nome della collezione
         * @throws {Error} Se la collezione non esiste
         */
        public SettaCollezione(collezione: string): Promise<void>;
        
        /**
         * @description Ritorna la lista delle collezioni nel database
         * @throws Ritorna un oggetto col campo "errore" contente il messaggio
         * @returns {Promise<{collezioni? : string[], errore? : string}>} Un array col nome delle collezioni
         */
        public Collezioni(): Promise<{ collezioni?: string[], errore?: string }>;
        
        /**
         * @description Imposta il nome del database corrente
         * @param {string} nomeDatabase Nome del database
         * @throws {Error} Se il database non esiste
         */
        public SettaDatabase(nomeDatabase: string): Promise<void>;
        
        /**
         * @description Restituisce tutti i risultati della query
         * @param {object} query Query da eseguire
         * @param {object} projection Campi da proiettare
         * @param {object} sort Ordinamento -- {sort : nomeCampo, direction : "asc" | "desc"}
         * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
         * @returns {Promise<object>} Risultato della query
         */
        public PrendiMolti(query?: object, projection?: object, sort?: { sort: any, direction?: number }): Promise<object>;

        /**
         * @description Restituisce il primo risultato della query
         * @param {object} query Query da eseguire
         * @param {object} projection Campi da proiettare
         * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
         * @returns {Promise<object>} Risultato della query
         */
        public PrendiUno(query?: object, projection?: object): Promise<object>;
        
        /**
         * @description Restituisce la corrispondenza con l'ID specificato
         * @param {object[]} oggetti Record da inserire
         * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
         * @returns {Promise<object>} Risultato della query
         */
        public Inserisci(...oggetti: object[]): Promise<object>;

        /** 
         * @description Aggiorna il primo record che corrisponde al filtro
         * @param {object} filtro Filtro per la query
         * @param {object} update Aggiornamento da applicare
         * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
         * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
         * @returns {Promise<object>} Risultato della query
         */
        public UpdateUno(filtro: object, update: object, upsert?: boolean): Promise<object>;

         /**
         * @description Aggiorna tutti i record che corrispondono al filtro
         * @param {object} filtro Filtro per la query
         * @param {object} update Aggiornamento da applicare
         * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
         * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
         * @returns {Promise<object>} Risultato della query
         */
        public UpdateMolti(filtro: object, update: object, upsert?: boolean): Promise<object>;

        /**
         * @description Aggiorna tutti i record che corrispondono al filtro
         * @param {object} filtro Filtro per la query
         * @param {object} oggetto Oggetto che rimpiazza il record
         * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
         * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
         * @returns {Promise<object>} Risultato della query
         */
        public SostituisciUno(filtro: object, oggetto: object, upsert?: boolean): Promise<object>;

        /**
         * @description Elimina il primo record che corrisponde al filtro
         * @param {object} query Filtro per la query
         * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
         * @returns {Promise<object>} Risultato della query
         */
        public EliminaUno(query: object): Promise<object>;

        /**
         * @description Elimina tutti i record che corrispondono al filtro
         * @param {object} query Filtro per la query
         * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
         * @returns {Promise<object>} Risultato della query
         */
        public Elimina(query: object): Promise<object>;

        /**
         * @description Restituisce il numero di record che corrispondono al filtro
         * @param {object} query Filtro per la query
         * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
         * @returns {Promise<object>} Risultato della query
         */
        public NumeroRecord(query?: object): Promise<object>;

        /**
         * @description Restituisce i valori distinti di un campo
         * @param {string} record Campo su cui applicare il distinct
         * @param {object} query Filtro per la query
         * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
         * @returns {Promise<object>} Risultato della query
         */
        public PrendiDistinct(record: string, query?: object): Promise<object>;

        /**
         * @description Sostuisce il primo record che corrisponde al filtro mantenendo l'ID
         * @param {object} query Filtro per la query
         * @param {string} nuovo Campo che rimpiazza il campo specificato in query
         * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
         * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
         * @returns {Promise<object>} Risultato della query
         */
        public Replace(query: object, nuovo: object, upsert?: boolean): Promise<object>;

        /**
         * @description Restituisce la corrispondenza con l'ID specificato
         * @param {string} id ID del record
         * @throws {object} Restituisce un oggetto con la chiave "errore" e il messaggio di errore
         * @returns {Promise<object>} Risultato della query
         * @deprecated Usare ID()
         */
        public CercaID(id: string): Promise<object>;
        
        /**
         * @description Restituisce la stringa di connessione corrente
         * @returns {string} Stringa di connessione
         */
        public readonly StrConn: string;

        /**
         * @description Restituisce il nome del database corrente
         * @returns {string} Nome del database
         */
        public readonly Database: string;

        /**
         * @description Restituisce il nome della collezione corrente
         * @returns {string} Nome della collezione
         */
        public readonly Collezione: string;
    }

    export = MongoDriver;
}