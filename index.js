import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import express from 'express'

const app = express()

app.use(express.static('public'));

//middleware
app.use(express.json());

//set up the database
const  db = await  sqlite.open({
    filename:  './data_plan.db',
    driver:  sqlite3.Database
});

//migration
await db.migrate();

app.post('/api/price_plan/update', async(req, res) => {
    console.log(req.body)

    const { 
        sms_price,
        call_price,
        price_name
    } = req.body;

    const result = await db.run(`update price_plan set sms_price = ?, 
    call_price = ? where plan_name = ?`,
    sms_price,
    call_price,
    price_name);

    console.log(result)

    res.json({
        status: 'You have successfully updated your Price plan data'
    })
});

//create API
app.get('/api/price_plans', async (req, res) => {

    const price_plans = await db.all(`select * from price_plan`)
    res.json({
        price_plans 
    })
});


app.post('/api/phonebill/', async(req, res) => {
    console.log(req.body)

    //get the price plan to USE

    const price_plan = await db.get(`SELECT id, plan_name, sms_price, call_price
        FROM price_plan where plan_name = ?`, req.body.price_plan) 

        if(!price_plan) {
            res.json({
                error : `invalid price plan name : ${price_plan}`
            })
        }
    console.log(price_plan);

    //Use the price plan to calculate the total cost

    const activity = req.body.actions;
    const activities = activity.split(',');
    let total = 0;

    activities.forEach(action => {
        if(action.trim() === 'sms') {
            total += price_plan.sms_price;
        } else if (action.trim() == 'call') {
            total += price_plan.call_price;
        }
    });

    res.json({
        total
    })
})

const port = process.env.PORT || 6088;
app.listen(port, () => console.log(`listen on port ${port}...`))
