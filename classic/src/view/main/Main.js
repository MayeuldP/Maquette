/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */

Ext.define('My.custom.MyClass', { /** Default config values */ 
    
    config: { 
        foo: 'Anonymous', 
        bar: false,
        db : undefined, 
        foobarred: false },   
    
    constructor: function(config) { this.initConfig(config); },  
    
    applyFoobarred: function(newValue, oldValue) 
    { 
        this.foobarred = newValue; 
        if (newValue) { 
            alert("You're foobarred"); 
        } 
    }
}); 




Ext.define('Maquette.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',
    db_name : undefined,
    content: '',
    indexedDB : window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB,
    
     requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'Maquette.view.main.MainController',
        'Maquette.view.main.MainModel',
        'Maquette.view.main.List'
    ],

    config: {
                foo: 'John Doe',
                title: 'lel'
    },
  
    controller: 'main',
    viewModel: {type :'main'},

    ui: 'navigation',

    tabBarHeaderPosition: 1,
    titleRotation: 0,
    tabRotation: 0,

    header: {
        layout: {
            align: 'stretchmax'
        },
        title: {
            bind: {
                text: '{name}'
            },
            flex: 0
        },
        iconCls: 'fa-th-list'
    },

    tabBar: {
        flex: 1,
        layout: {
            align: 'stretch',
            overflowHandler: 'none'
        }
    },

    responsiveConfig: {
        tall: {
            headerPosition: 'top'
        },
        wide: {
            headerPosition: 'left'
        }
    },

    defaults: {
        bodyPadding: 20,
        margin: 10,
        tabConfig: {
            plugins: 'responsive',
            responsiveConfig: {
                wide: {
                    iconAlign: 'left',
                    textAlign: 'left'
                },
                tall: {
                    iconAlign: 'top',
                    textAlign: 'center',
                    width: 120
                }
            }
        }
    },
                
    items: [{
        title: 'Home',
        iconCls: 'fa-home',
        items: [{
            xtype: 'mainlist'
        }]
    }, {
        name: 'form',
        title: 'Consult DB',
        iconCls: 'fa-database',
        items: [{
            title: 'Add person',
            id: 'tmp',
            foo : 'Michael Jackson',
            db : undefined,
            bodyPadding: 10,
            defaultType: 'textfield',
            items: [
                {
                    id: 'firstName',
                    fieldLabel: 'First Name',
                    name: 'firstName'
                },
                {
                    id : 'lastName',
                    fieldLabel: 'Last Name',
                    name: 'lastName'
                },
                {
                    id:'birthDate',
                    xtype: 'datefield',
                    fieldLabel: 'Date of Birth',
                    name: 'birthDate'
                },
                {
                    xtype: 'button',
                    text: 'InitDB',
                    handler: function(button) {

                       var Name = Ext.getCmp('firstName').getValue();
                       var LastName = Ext.getCmp('lastName').getValue();
                       const User = [{empid: "1" , name : Name, lastname : LastName}];
                       Ext.Msg.confirm('Pushing Elem...', "Confirm : " +  Name + " " + LastName, function (id, value) {
                                    if (id === 'yes') {
                                       var request = indexedDB.open("troisiemeDB", 3);
                                       request.onupgradeneeded = function(event) {
                                            var db = event.target.result;
                                            var objectStore = db.createObjectStore("employees", { keyPath: "id", autoIncrement: true });
                                            objectStore.createIndex("name", "name", { unique: false });
                                            objectStore.createIndex("lastname", "lastname", { unique: false });
                                           
                                            objectStore.transaction.oncomplete = function(event) {
                                                var req = db.transaction("employees", "readwrite")
                                                .objectStore("employees")
                                                .add({name: Name, lastname: LastName});
                                                 req.onsuccess = function(event) {
                                                            alert("DB correct inititialized and elem added to it." + db.name);
                                                            button.up().db = db;
                                                            
                                                    };
                                            }
                                    }
                                }
                        }, this);       
                    }
                },
                {
                    xtype: 'button',
                    text: 'Push',
                    handler: function(button) {
                        var request = indexedDB.open("troisiemeDB", 4);
                        request.onsuccess = function(event)
                        {
                            var db = event.target.result;
                            var Name = Ext.getCmp('firstName').getValue();
                            var LastName = Ext.getCmp('lastName').getValue();
                       
                            var transaction = db.transaction(["employees"], "readwrite");
                            var objectStore = transaction.objectStore("employees");
                            var req = objectStore.put({name: Name, lastname: LastName});
                            alert("Pushed.");
                            req.onsuccess = function(event) {
                                alert("Done");
                            };
                        }
                    }
                },
                {
                    xtype: 'button',
                    //alias: 'store.content',
                    text: 'Read',
                    handler: function(button) {
                        var request = indexedDB.open("troisiemeDB");
                        var str = [];
                        request.onsuccess = function(event)
                        {
                            var db = event.target.result;
                            var objectStore = db.transaction("employees").objectStore("employees");
  
                            objectStore.openCursor().onsuccess = function(event) {
                            var cursor = event.target.result;
                            if (cursor) {
                                    str.push('<br />' + " <b>Name :</b>  " + cursor.value.name + 
                                                        " - <b>LastName :</b> " +  cursor.value.lastname +
                                             '<br />');
                                    cursor.continue();
                            }
                            else {
                                var final = "";
                                for (var i in str)
                                {
                                    final += str[i];
                                    final += '\n----------------------------------------------------------------\n';
                                }
                                Ext.MessageBox.show({
                                        title: 'Result for ' + db.name ,
                                        msg: final,
                                        buttons: Ext.MessageBox.OK,
                                        width: 300});
                                }   
                            };      
                        
                        }
                    },
                },
                {
                     xtype: 'button',
                    text: 'Clear DB',
                    handler: function(button) {
                        var request = indexedDB.open("troisiemeDB");
                        request.onsuccess = function(event)
                        {
                            var db = event.target.result;
                            var transaction = db.transaction(["employees"], "readwrite");

                            // create an object store on the transaction
                            var objectStore = transaction.objectStore("employees");

                            // clear all the data out of the object store
                            var objectStoreRequest = objectStore.clear();

                            objectStoreRequest.onsuccess = function(event) {
                                // report the success of our clear operation
                                alert("db cleared");
                            };
                        }
                    }
                },
                ],
            }],
             fields: [
                'value'
            ],
        }
        , /*{
        title: 'Look elems',
        iconCls: 'fa-search',
        items: [{
            xtype: 'adding'
        }]
    },*/ {
        title: 'Readme',
        iconCls: 'fa-cog',
        bind: {
            html: '{settings}'
        }
    }],
});

var store = Ext.create('Ext.data.Store', {
    fields : [ 'id', 
               'username', 
               'email'],
    autoLoad : true,
});