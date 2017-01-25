import {MOCKER_DATABASE_NAME} from '../constant';

let db;

function createMockerDatabase() {

    //兼容性
    let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    let IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: "readwrite"};
    let IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    let request = window.indexedDB.open(MOCKER_DATABASE_NAME);
    request.onerror = function () {
        throw new Error("数据库创建失败")
    };

    request.onsuccess = function (event) {
        db = event.target.result;
    };

    request.onupgradeneeded = function (event) {
        db = event.target.result;

        // 创建表结构
        let objectStore = db.createObjectStore("records", {
            keyPath: "id",
            autoIncrement: true
        });

        objectStore.createIndex("methodUrl", ["method", "url"], {
            unique: true
        });

    }


}
function getMockerRecord(o) {
    checkMockerRecord(o);

    let objectStore = db.transaction("records", "readonly").objectStore("records");

    return new Promise(function (resolve, reject) {
        // 根据索引查询
        objectStore.index('methodUrl').get([o.method, o.url]).onsuccess = function (e) {
            resolve(e.target.result);
        }
    });


}
function addMockerRecord(o) {

    checkMockerRecord(o);

    let objectStore = db.transaction("records", "readwrite").objectStore("records");
    let request = objectStore.add({
        "method": o.method,
        "url": o.url,
        "response": o.response
    });
    request.onsuccess = function () {

    };
    request.onerror = function () {
        throw new Error("Mocker数据库添加失败");
    }

}

function deleteMockerRecord(o) {

}

function updateMockerRecord(o) {

}

function checkMockerRecord(o) {
    // 检测输入参数
    if (!(typeof o === 'object' &&
        typeof o.method === 'string' &&
        typeof o.url === 'string' &&
        /^(get|post)$/i.test(o.method))
    ) {
        throw new Error('数据库操作数据非法')
    }
}

export {
    createMockerDatabase,
    getMockerRecord,
    addMockerRecord,
    deleteMockerRecord,
    updateMockerRecord
}