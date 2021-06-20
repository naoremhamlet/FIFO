const express = require('express');
var path = require('path');



const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));

//function to return response to the client
async function sendValue(req, res, next){

    //data can be fetched dynamically from a database or input from user
    const data = [
        {"date" : "16-12-2018", "symbol" :  "ITC", "type" : "buy", "quantity" : 90, "rate" : 260},
        {"date" : "19-12-2018", "symbol" :  "ITC", "type" : "buy", "quantity" : 30, "rate" : 256},
        {"date" : "21-12-2018", "symbol" :  "ITC", "type" : "sell", "quantity" : 80, "rate" : 275},
        {"date" : "25-12-2018", "symbol" :  "ITC", "type" : "buy", "quantity" : 50, "rate" : 270},
        {"date" : "28-12-2018", "symbol" :  "ITC", "type" : "sell", "quantity" : 10, "rate" : 275},
        {"date" : "05-12-2018", "symbol" :  "ITC", "type" : "sell", "quantity" : 30, "rate" : 275},
        {"date" : "25-12-2018", "symbol" :  "ITC", "type" : "buy", "quantity" : 20, "rate" : 270},
        {"date" : "28-12-2018", "symbol" :  "ITC", "type" : "sell", "quantity" : 20, "rate" : 275}
    ];
    const { totalCost, averageCost } = find(data);

    res.render('index', {data: data, totalCost: totalCost, averageCost: averageCost});
}


function find(originalData) {
    //FIFO implementation
    //first create a duplicate file(deep copy)
    const data = JSON.parse(JSON.stringify(originalData));

    for(var i=0; i<data.length; i++){
        if(data[i].type == "sell" && data[i].quantity != 0){
            for(var j=0; j<i; j++){
                if(data[j].type == "buy" && data[j].quantity != 0){
                    if(data[j].quantity >= data[i].quantity){
                        data[j].quantity -= data[i].quantity;
                        data[i].quantity = 0;
                        
                        break;
                    }
                    else if(data[j].quantity < data[i].quantity){
                        data[i].quantity -= data[j].quantity;
                        data[j].quantity = 0;
                    }
                }
            }
        }
    }
    
    //finding totalCost and averageCost
    var totalCost = 0, totalQuantity = 0;
    for(var i=0; i<data.length; i++){
        totalCost += data[i].quantity*data[i].rate;
        totalQuantity += data[i].quantity;
    }
    var averageCost = Math.floor(totalCost/totalQuantity);

    return {totalCost, averageCost};
}
//Since there is two for loops
// for i <-- n
//      for j <-- i
//hence the time complexity is O(n*n)

app.get('/', sendValue);

app.listen(4000, (err)=>{
    if(err) throw(err);
    console.log('Listening in port 4000....');
})



