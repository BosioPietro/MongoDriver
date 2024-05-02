"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDriver = void 0;
var mongodb_1 = require("mongodb");
/**
 * @description Driver per MongoDB
 * @class MongoDriver
 * @exports MongoDriver
 */
var MongoDriver = /** @class */ (function () {
    function MongoDriver(strConn, nomeDatabase, collezione) {
        this.database = "";
        this.collezione = "";
        this.strConn = strConn;
        this.SettaDatabase(nomeDatabase);
        if (collezione)
            this.SettaCollezione(collezione);
    }
    /**
     * @description Crea un oggetto ID data una string
     * @param {string} id Stringa da convertire
     * @returns {ObjectId} Oggetto ObjectId corrispondente
     */
    MongoDriver.prototype.ID = function (id) {
        if (!mongodb_1.ObjectId.isValid(id))
            throw new Error("ID non valido");
        return new mongodb_1.ObjectId(id);
    };
    Object.defineProperty(MongoDriver.prototype, "Collezione", {
        /**
         * @description Restituisce il nome della collezione corrente
         * @returns {string} Nome della collezione
         */
        get: function () { return this.collezione; },
        enumerable: false,
        configurable: true
    });
    /**
     * @description Imposta il nome della collezione corrente
     * @param {string} collezione Nome della collezione
     * @throws {Error} Se la collezione non esiste
     */
    MongoDriver.prototype.SettaCollezione = function (collezione) {
        this.collezione = collezione;
    };
    /**
     * @description Ritorna la lista delle collezioni nel database
     * @throws Ritorna un oggetto col campo "errore" contente il messaggio
     * @returns {Promise<{collezioni? : string[], errore? : string}>} Un array col nome delle collezioni
     */
    MongoDriver.prototype.Collezioni = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client, db, collezioni, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.Connetti()];
                    case 1:
                        client = (_a.sent()).client;
                        db = client.db(this.database);
                        return [4 /*yield*/, db.listCollections().toArray()];
                    case 2:
                        collezioni = _a.sent();
                        client.close();
                        return [2 /*return*/, { "collezioni": collezioni.map(function (c) { return c.name; }) }];
                    case 3:
                        err_1 = _a.sent();
                        return [2 /*return*/, { "errore": err_1 }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(MongoDriver.prototype, "Database", {
        /**
         * @description Restituisce il nome del database corrente
         * @returns {string} Nome del database
         */
        get: function () { return this.database; },
        enumerable: false,
        configurable: true
    });
    /**
     * @description Imposta il nome del database corrente
     * @param {string} nomeDatabase Nome del database
     * @throws {Error} Se il database non esiste
     */
    MongoDriver.prototype.SettaDatabase = function (nomeDatabase) {
        this.database = nomeDatabase;
    };
    Object.defineProperty(MongoDriver.prototype, "StrConn", {
        /**
         * @description Restituisce la stringa di connessione corrente
         * @returns {string} Stringa di connessione
         */
        get: function () { return this.strConn; },
        enumerable: false,
        configurable: true
    });
    /**
     * @description Restituisce tutti i risultati della query
     * @param {Record<string, any>} query Query da eseguire
     * @param {Record<string, number>} projection Campi da proiettare
     * @param {{sort: any, direction? : number | ('asc' | 'desc')}} sort Ordinamento -- {sort : nomeCampo, direction : "asc" | "desc"}
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Record<string, any> | Errore>} Risultato della query
     */
    MongoDriver.prototype.PrendiMolti = function (query, projection, sort) {
        if (query === void 0) { query = {}; }
        if (projection === void 0) { projection = {}; }
        if (sort === void 0) { sort = { sort: {} }; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, client, collection;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.Connetti()];
                    case 1:
                        _a = _b.sent(), client = _a.client, collection = _a.collection;
                        return [2 /*return*/, this.EseguiQuery(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, collection.find(query).project(projection).sort(Object.values(sort)).toArray()];
                            }); }); }, client)];
                }
            });
        });
    };
    /**
     * @description Restituisce il primo risultato della query
     * @param {Record<string, any>} query Query da eseguire
     * @param {Record<string, number>} projection Campi da proiettare
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Projection & Record<string, any> | Errore>} Risultato della query
     */
    MongoDriver.prototype.PrendiUno = function (query, projection) {
        if (query === void 0) { query = {}; }
        if (projection === void 0) { projection = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, client, collection;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.Connetti()];
                    case 1:
                        _a = _b.sent(), client = _a.client, collection = _a.collection;
                        return [2 /*return*/, this.EseguiQuery(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, collection.findOne(query, { projection: projection })];
                            }); }); }, client)];
                }
            });
        });
    };
    /**
     * @description Restituisce la corrispondenza con l'ID specificato
     * @param {string} id ID del record
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Record<string, any>>} Risultato della query
     * @deprecated Usare ID()
     */
    MongoDriver.prototype.CercaID = function (id) {
        return this.PrendiUno({ "_id": new mongodb_1.ObjectId(id) });
    };
    /**
     * @description Restituisce la corrispondenza con l'ID specificato
     * @param {Record<string, any>[]} oggetti Record da inserire
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise< Insert | Errore >} Risultato della query
     */
    MongoDriver.prototype.Inserisci = function () {
        var oggetti = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            oggetti[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a, client, collection, rq;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.Connetti()];
                    case 1:
                        _a = _b.sent(), client = _a.client, collection = _a.collection;
                        rq = oggetti.length == 1 ? collection.insertOne(oggetti[0]) : collection.insertMany(oggetti);
                        return [2 /*return*/, this.EseguiQuery(function () { return rq; }, client)];
                }
            });
        });
    };
    /**
     * @description Aggiorna il primo record che corrisponde al filtro
     * @param {Record<string, any>} filtro Filtro per la query
     * @param {Record<string, any>} update Aggiornamento da applicare
     * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Update | Errore>} Risultato della query
     */
    MongoDriver.prototype.UpdateUno = function (filtro, update, upsert) {
        if (upsert === void 0) { upsert = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, client, collection;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.Connetti()];
                    case 1:
                        _a = _b.sent(), client = _a.client, collection = _a.collection;
                        return [2 /*return*/, this.EseguiQuery(function () { return collection.updateOne(filtro, update, { upsert: upsert }); }, client)];
                }
            });
        });
    };
    /**
    * @description Aggiorna tutti i record che corrispondono al filtro
    * @param {Record<string, any>} filtro Filtro per la query
    * @param {Record<string, any>} update Aggiornamento da applicare
    * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
    * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
    * @returns {Promise<Update | Errore>} Risultato della query
    */
    MongoDriver.prototype.UpdateMolti = function (filtro, update, upsert) {
        if (upsert === void 0) { upsert = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, client, collection;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.Connetti()];
                    case 1:
                        _a = _b.sent(), client = _a.client, collection = _a.collection;
                        return [2 /*return*/, this.EseguiQuery(function () { return collection.updateMany(filtro, update, { upsert: upsert }); }, client)];
                }
            });
        });
    };
    /**
     * @description Aggiorna tutti i record che corrispondono al filtro
     * @param {Record<string, any>} filtro Filtro per la query
     * @param {Record<string, any>} oggetto Oggetto che rimpiazza il record
     * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Replace | Errore>} Risultato della query
     */
    MongoDriver.prototype.SostituisciUno = function (filtro, oggetto, upsert) {
        if (upsert === void 0) { upsert = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, client, collection;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.Connetti()];
                    case 1:
                        _a = _b.sent(), client = _a.client, collection = _a.collection;
                        return [2 /*return*/, this.EseguiQuery(function () { return collection.replaceOne(filtro, oggetto, { upsert: upsert }); }, client)];
                }
            });
        });
    };
    /**
     * @description Elimina il primo record che corrisponde al filtro
     * @param {Record<string, any>} query Filtro per la query
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Delete | Errore>} Risultato della query
     */
    MongoDriver.prototype.EliminaUno = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, client, collection;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.Connetti()];
                    case 1:
                        _a = _b.sent(), client = _a.client, collection = _a.collection;
                        return [2 /*return*/, this.EseguiQuery(function () { return collection.deleteOne(query); }, client)];
                }
            });
        });
    };
    /**
     * @description Elimina tutti i record che corrispondono al filtro
     * @param {Record<string, any>} query Filtro per la query
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Delete | Errore>} Risultato della query
     */
    MongoDriver.prototype.Elimina = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, client, collection;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.Connetti()];
                    case 1:
                        _a = _b.sent(), client = _a.client, collection = _a.collection;
                        return [2 /*return*/, this.EseguiQuery(function () { return collection.deleteMany(query); }, client)];
                }
            });
        });
    };
    /**
     * @description Restituisce il numero di record che corrispondono al filtro
     * @param {Record<string, any>} query Filtro per la query
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<number | Errore>} Risultato della query
     */
    MongoDriver.prototype.NumeroRecord = function (query) {
        if (query === void 0) { query = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, client, collection;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.Connetti()];
                    case 1:
                        _a = _b.sent(), client = _a.client, collection = _a.collection;
                        return [2 /*return*/, this.EseguiQuery(function () { return collection.countDocuments(query); }, client)];
                }
            });
        });
    };
    /**
     * @description Restituisce i valori distinti di un campo
     * @param {string} record Campo su cui applicare il distinct
     * @param {Record<string, any>} query Filtro per la query
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Record<string, any>>} Risultato della query
     */
    MongoDriver.prototype.PrendiDistinct = function (record, query) {
        if (query === void 0) { query = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, client, collection;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.Connetti()];
                    case 1:
                        _a = _b.sent(), client = _a.client, collection = _a.collection;
                        return [2 /*return*/, this.EseguiQuery(function () { return collection.distinct(record, query); }, client)];
                }
            });
        });
    };
    /**
     * @description Sostuisce il primo record che corrisponde al filtro mantenendo l'ID
     * @param {Record<string, any>} query Filtro per la query
     * @param {string} nuovo Campo che rimpiazza il campo specificato in query
     * @param {boolean} upsert Se true, crea un nuovo record se non trova corrispondenze
     * @throws { Errore } Restituisce un oggetto con la chiave "errore" e il messaggio di errore
     * @returns {Promise<Replace | Errore>} Risultato della query
     */
    MongoDriver.prototype.Replace = function (query, nuovo, upsert) {
        if (upsert === void 0) { upsert = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, client, collection;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.Connetti()];
                    case 1:
                        _a = _b.sent(), client = _a.client, collection = _a.collection;
                        return [2 /*return*/, this.EseguiQuery(function () { return collection.replaceOne(query, nuovo, { upsert: upsert }); }, client)];
                }
            });
        });
    };
    MongoDriver.prototype.EseguiQuery = function (funzione_query, client) {
        return __awaiter(this, void 0, void 0, function () {
            var data, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, funzione_query()];
                    case 1:
                        data = _a.sent();
                        this.Prompt("Query eseguita con successo");
                        return [2 /*return*/, data];
                    case 2:
                        err_2 = _a.sent();
                        this.Prompt("Errore esecuzione query: " + err_2);
                        return [2 /*return*/, { "errore": err_2 }];
                    case 3:
                        client.close();
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MongoDriver.prototype.Connetti = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client, collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Client()];
                    case 1:
                        client = _a.sent();
                        collection = client.db(this.database).collection(this.collezione);
                        return [2 /*return*/, { client: client, collection: collection }];
                }
            });
        });
    };
    MongoDriver.prototype.Client = function () {
        return __awaiter(this, void 0, void 0, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new mongodb_1.MongoClient(this.strConn);
                        return [4 /*yield*/, client.connect()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, client];
                }
            });
        });
    };
    MongoDriver.prototype.Prompt = function () {
        var elementi = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            elementi[_i] = arguments[_i];
        }
        console.log.apply(console, __spreadArray([">>> "], elementi, false));
    };
    /**
     * @description Controlla se un record è di errore e, in caso affermativo, può inviare una risposta HTTP
     * @param {Errore | T } record Oggetto da controllare
     * @param {Response} response Risposta HTTP che manderà l'errore
     * @param {Record<string, any> | string} messaggio Messaggio di errore da inviare
     * @returns { record is Errore }
     */
    MongoDriver.prototype.Errore = function (record, response, messaggio) {
        if (!!record && record.errore !== undefined) {
            this.Prompt("Errore: " + record.errore);
            response === null || response === void 0 ? void 0 : response.status(500).send(messaggio || "Errore interno nel server");
            return true;
        }
        else
            return false;
    };
    return MongoDriver;
}());
exports.MongoDriver = MongoDriver;
