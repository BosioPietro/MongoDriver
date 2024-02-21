import {Collection, MongoClient, ObjectId} from "mongodb";

class MongoDriver{
    private constructor(strConn : string){
        this.strConn = strConn;
        this.Prompt(`Driver creato con stringa di connessione ${strConn}`)
    }

    public ID(id : string) : ObjectId{
        if(!ObjectId.isValid(id)) throw new Error("ID non valido");
        return new ObjectId(id)
    }

    public static async CreaDatabase(strConn : string, nomeDatabase : string, collezione? : string) : Promise<MongoDriver> {
        const database = new MongoDriver(strConn);
        await database.SettaDatabase(nomeDatabase);
        if(collezione) await database.SettaCollezione(collezione);

        database.Prompt(`Database ${database.database} e collezione ${database.collezione} impostati`)
        return database;
    }

    private strConn : string;
    private database : string = "";
    private collezione : string = "";

    get Collezione() : string { return this.collezione }

    public async SettaCollezione(collezione : string) {
        const client = await this.Client();
        const db = client.db(this.database);
        const collezioni = await db.listCollections().toArray();
        client.close();

        if(collezioni.some(c => c.name == collezione))
        {
            this.collezione = collezione;
        }
        else throw new Error(`La collezione ${collezione} non esiste`);
    }

    public async Collezioni() : Promise<{collezioni? : string[], errore? : string}> {
        try
        {
            const {client} = await this.Connetti();
            const db = client.db(this.database);
            const collezioni = await db.listCollections().toArray();

            client.close();

            return {"collezioni" : collezioni.map(c => c.name)};
        }
        catch(err){ return {"errore" : `${err}`} }
    }

    get Database() : string { return this.database }

    public async SettaDatabase(nomeDatabase : string){
        const client = await this.Client();
        const dbList = await client.db().admin().listDatabases();
        client.close();

        if(dbList.databases.some(db => db.name == nomeDatabase))
        {
            this.database = nomeDatabase;
        }
        else throw new Error(`Il database ${nomeDatabase} non esiste`);
    } 

    get StrConn() : string { return this.strConn }

    public async PrendiMolti(query: object = {}, projection:object = {}, sort:{sort : any, direction? : number} = {sort: {}}) : Promise<object> {
        const {client, collection} = await this.Connetti();

        return this.EseguiQuery(async () => collection.find(query).project(projection).sort(Object.values(sort)).toArray(), client)
    }

    public async PrendiUno(query: object = {}, projection : object = {}) : Promise<object> {
        const {client, collection} = await this.Connetti();

        return this.EseguiQuery(async () => collection.findOne(query, { projection }), client)
    }

    public CercaID(id : string) : Promise<object>{
        return this.PrendiUno({"_id" : new ObjectId(id)});
    }

    public async Inserisci(...oggetti: object[]) : Promise<object> {
        const {client, collection} = await this.Connetti();
        const rq = oggetti.length == 1 ? collection.insertOne(oggetti[0]) : collection.insertMany(oggetti);

        return this.EseguiQuery(() => rq, client);
    }

    public async UpdateUno(filtro : object, update : object, upsert : boolean = false) : Promise<object> {
        const {client, collection} = await this.Connetti(); 

        return this.EseguiQuery(() => collection.updateOne(filtro, update, { upsert }), client);
    }

    public async UpdateMolti(filtro : object, update : object, upsert : boolean = false) : Promise<object> {
        const {client, collection} = await this.Connetti(); 

        return this.EseguiQuery(() => collection.updateMany(filtro, update, { upsert }), client);
    }

    public async SostituisciUno(filtro: object, oggetto: object, upsert: boolean = false) : Promise<object> {
        const {client, collection} = await this.Connetti(); 

        return this.EseguiQuery(() => collection.replaceOne(filtro, oggetto, { upsert }), client);
    }

    public async EliminaUno(query : object) : Promise<object> {
        const {client, collection} = await this.Connetti(); 

        return this.EseguiQuery(() => collection.deleteOne(query), client);
    }

    public async Elimina(query : object) : Promise<object> {
        const {client, collection} = await this.Connetti(); 

        return this.EseguiQuery(() => collection.deleteMany(query), client);
    }

    public async NumeroRecord(query : object = {}) : Promise<object> {
        const {client, collection} = await this.Connetti(); 

        return this.EseguiQuery(() => collection.countDocuments(query), client);
    }

    public async PrendiDistinct(record : string, query : object = {}) : Promise<object> {
        const {client, collection} = await this.Connetti(); 

        return this.EseguiQuery(() => collection.distinct(record, query), client);
    }


    public async Replace(query : object, nuovo : object, upsert : boolean = false) : Promise<object> {
        const {client, collection} = await this.Connetti(); 

        return this.EseguiQuery(() => collection.replaceOne(query, nuovo, { upsert }), client);
    }
    
    private async EseguiQuery(funzione_query : Function, client : MongoClient) : Promise<object>{
        try
        {
            const data = await funzione_query();
            this.Prompt("Query eseguita con successo");
            return data;
        }
        catch(err)
        {
            this.Prompt(`Errore esecuzione query: ${err}`);
            return { "errore" : `${err}` };
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
}

export default MongoDriver; 