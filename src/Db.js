let db;
const openRequest = indexedDB.open('myDatabase', 1);
openRequest.addEventListener("success",(e)=>{
    db = e.target.result;
    console.log("success");
    
})
openRequest.addEventListener("error",(e)=>{
    console.log("error:" + e.target.value);
})
openRequest.addEventListener("upgradeneeded",(e)=>{
    db = e.target.result;
    const objectStore = db.createObjectStore("transactions",{keyPath:"id",autoIncrement:true});
    objectStore.createIndex("type", "type", { unique: false });
    objectStore.createIndex("category","category",{unique:false});
    objectStore.createIndex("description","description",{unique:false});
    objectStore.createIndex("amount","amount",{unique:false});

})

export const saveTransaction = (transaction) => {
  if (!db) {
    console.log("DB not ready yet");
    return;
  }
  const tx = db.transaction("transactions", "readwrite");
  const store = tx.objectStore("transactions");
  store.add(transaction);
};

export const getAllTransactions = () => {
  return new Promise((resolve, reject) => {
    if (!db) {
      resolve([]);
      return;
    }
    const tx = db.transaction("transactions", "readonly");
    const store = tx.objectStore("transactions");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = (err) => reject(err);
  });
};