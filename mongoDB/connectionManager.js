const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://fstack2:Vnpt@123@cluster0.nuxmy.mongodb.net/sample_airbnb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const assert = require('assert');
const Grid = require('gridfs-stream');


module.exports = {
    dbConnectionInit() {
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

    deleteDocuments(dbClient) {
        const collection = dbClient.db("sample_airbnb").collection("listingsAndReviews");

        //delete with equal to Condition
        // collection.deleteMany( { "client" : "Crude Traders Inc." } );

        //delete with comparision Condition. In this example, delete record where beds is greater than 1
        collection.deleteMany({ "beds": { $gt: 1 } }).then(res => {
            console.log
        }).catch(err => {

        });
    },


    //Grid Fs init for storing file that exceeds Bson file size ~ >16mb

    gridFsInit(dbClient) {
        var gfs
        try {
            gfs = Grid(dbClient.db("sample_airbnb"), require('mongodb'));           
            console.log('All set! Start uploading :)')
        } catch (error) {
            console.log(error)
        }
        return new Promise((resolve, reject) => {
            if (gfs != null)
                resolve(gfs)
            else
                reject(null)
        })
    },


    // Database Transaction with MongoDB
    async testTransactionInMongo(dbClient, info1, info2) {
 
        const usersCollection = dbClient.db("sample_airbnb").collection("listingsAndReviews");
        const listingsAndReviewsCollection = client.db("sample_airbnb").collection("listingsAndReviews");
     
        const reservation = createReservationDocument(nameOfListing, reservationDates, reservationDetails);
     
        const session = dbClient.startSession();
     
        const transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };
     
        try {
            const transactionResults = await session.withTransaction(async () => {
     
                const usersUpdateResults = await usersCollection.updateOne(
                    { email: userEmail },
                    { $addToSet: { reservations: reservation } },
                    { session });
                console.log(`${usersUpdateResults.matchedCount} document(s) found in the users collection with the email address ${userEmail}.`);
                console.log(`${usersUpdateResults.modifiedCount} document(s) was/were updated to include the reservation.`);
     
     
                const isListingReservedResults = await listingsAndReviewsCollection.findOne(
                    { name: nameOfListing, datesReserved: { $in: reservationDates } },
                    { session });
                if (isListingReservedResults) {
                    // Abort Session means all db transactions will be aborted.
                    await session.abortTransaction();
                    console.error("This listing is already reserved for at least one of the given dates. The reservation could not be created.");
                    console.error("Any operations that already occurred as part of this transaction will be rolled back.");
                    return;
                } 
     
                const listingsAndReviewsUpdateResults = await listingsAndReviewsCollection.updateOne(
                    { name: nameOfListing },
                    { $addToSet: { datesReserved: { $each: reservationDates } } },
                    { session });
                console.log(`${listingsAndReviewsUpdateResults.matchedCount} document(s) found in the listingsAndReviews collection with the name ${nameOfListing}.`);
                console.log(`${listingsAndReviewsUpdateResults.modifiedCount} document(s) was/were updated to include the reservation dates.`);
     
            }, transactionOptions);
     
            if (transactionResults) {
                console.log("The reservation was successfully created.");
            } else {
                console.log("The transaction was intentionally aborted.");
            }
        } catch(e){
            console.log("The transaction was aborted due to an unexpected error: " + e);
        } finally {
            // End Session means all db transactions will be commited.
            await session.endSession();
        }
     
    }
}

