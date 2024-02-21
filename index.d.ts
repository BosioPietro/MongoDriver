import { ObjectId } from "mongodb";

declare module '@bosio/mongodriver' {
    class MongoDriver {
        private constructor(strConn: string);
        public static CreaDatabase(strConn: string, nomeDatabase: string, collezione?: string): Promise<MongoDriver>;
        public ID(id: string): ObjectId;
        public SettaCollezione(collezione: string): Promise<void>;
        public Collezioni(): Promise<{ collezioni?: string[], errore?: string }>;
        public SettaDatabase(nomeDatabase: string): Promise<void>;
        public PrendiMolti(query?: object, projection?: object, sort?: { sort: any, direction?: number }): Promise<object>;
        public PrendiUno(query?: object, projection?: object): Promise<object>;
        public Inserisci(...oggetti: object[]): Promise<object>;
        public UpdateUno(filtro: object, update: object, upsert?: boolean): Promise<object>;
        public UpdateMolti(filtro: object, update: object, upsert?: boolean): Promise<object>;
        public SostituisciUno(filtro: object, oggetto: object, upsert?: boolean): Promise<object>;
        public EliminaUno(query: object): Promise<object>;
        public Elimina(query: object): Promise<object>;
        public NumeroRecord(query?: object): Promise<object>;
        public PrendiDistinct(record: string, query?: object): Promise<object>;
        public Replace(query: object, nuovo: object, upsert?: boolean): Promise<object>;
    }

    export = MongoDriver;
}