/**
 * Created by nokamojd on 15/07/2016.
 */

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.connect("mongodb://epp:testepppdb@ds139645.mlab.com:39645/eappdb");

mongoose.connect("mongodb://epp:testepppdb@ds139645.mlab.com:39645/eappdb", {
    useMongoClient: true
});

// console.log(mongoose.connect("mongodb://epp:testepppdb@ds139645.mlab.com:39645/eappdb", {
//     useMongoClient: true
// }));