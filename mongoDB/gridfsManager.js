var Grid = require('gridfs-stream');

module.exports = {
    daConnectionInit() {
        return new Promise((resolve, reject) => {
            client.connect(err => {
                if (err == null) {
                    console.log('Kết nối ok')
                    resolve(client)
                }
                else {
                    console.log('Kết nối fail')
                    reject(err)
                }
                // client.close();
            });
        })
    },
    findAllRecordsofaTable(dbClient) {

        /////////////////////////////////////////Basic operation for retriving data
        const collection = dbClient.db("sample_airbnb").collection("listingsAndReviews");
        // perform actions on the collection object
        collection.find({}).toArray(function (err, docs) {
            //test to see if the error is null or not. Null means no error.
            assert.equal(err, null);
            console.log('Found the following records');
            console.log(docs);
        });

        ////////////////////////////////////////Using skip and limit to perform pagination
        // let page_size, page_num
        // let skips = page_size * (page_num - 1)
        // collection.find({}).skip(skips).limit(page_size).toArray(function (err, docs) {
        //     assert.equal(err, null);
        //     console.log('Found the following records');
        //     console.log(docs);
        // });

        /////////////////////////////////////////Using sort to sort the return table
        //In this example, we sort data based on 2 fields which are A and B, 1 or -1 represent the ascending or descending order.
        // collection.find({}).sort( { "A": 1, "B": 1 } )
    },

    deleteDocuments(dbClient)
    {
        const collection = dbClient.db("sample_airbnb").collection("listingsAndReviews");

        //delete with equal to Condition
        // collection.deleteMany( { "client" : "Crude Traders Inc." } );

        //delete with comparision Condition. In this example, delete record where beds is greater than 1
        collection.deleteMany( {"beds" : { $gt : 1 }}).then(res=>{
            console.log
        }).catch(err=>{

        });        
    }
}
