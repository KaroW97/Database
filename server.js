if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path:'.env'})
}
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

const IndexRouter = require('./routes/index');
const ClientRouter = require('./routes/clients')
const TreatmentRotuer = require('./routes/treatment')

const CalendarRouter = require('./routes/calendar')
const SettingsRotuer = require('./routes/settings')



app.set('view engine', 'ejs') 
app.set('views',__dirname+'/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public')) //images
app.use(bodyParser.urlencoded({limit:'10mb',extended:false}))


const mongoose =  require('mongoose')
mongoose.connect(process.env.DATABASE_URL , {
    useNewUrlParser:true, 
    useUnifiedTopology: true
})//url for connection with database
const db = mongoose.connection;
db.on('error', error=>console.error(error)) //if error conecting database
db.once('open', ()=>console.log('Conected to mongoose')) //only for the firsst time when we are creating 



app.use('/',IndexRouter); //login register
app.use(['/clients','/clients/show'],ClientRouter) //Clients
app.use('/treatment',TreatmentRotuer)
app.use('/calendar',CalendarRouter)//Calendar page
app.use('/settings',SettingsRotuer) //Settings router



app.listen(process.env.PORT || 3000); //proces is getting from server