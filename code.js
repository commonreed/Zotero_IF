var path = 'C:/Users/Administrator/Desktop/IF_2022.json';
var data = await Zotero.File.getContentsAsync(path);
var impact_factors = eval( "(" + data + ")");
var fieldName = "series";
var newValue = "";
var fieldID = Zotero.ItemFields.getID(fieldName);
var s = new Zotero.Search();
s.libraryID = ZoteroPane.getSelectedLibraryID();
var ids = await s.search();
if (!ids.length) {
return "No items found";
}
await Zotero.DB.executeTransaction(async function () {
for (let id of ids) {
let item = await Zotero.Items.getAsync(id);
let mappedFieldID = Zotero.ItemFields.getFieldIDFromTypeAndBase(item.itemTypeID, fieldName);
var IF=impact_factors[item.getField('publicationTitle').toLowerCase()]
item.setField(mappedFieldID ? mappedFieldID : fieldID, newValue);
if(IF!=undefined){
    item.setField('series',IF)
}
await item.save();
}
});
return ids.length + " item(s) IF updated, and shown in series field!";
