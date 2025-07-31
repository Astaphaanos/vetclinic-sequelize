
const express = require('express')
const exphbs = require('express-handlebars')

const conn = require('./db/conn')
const User = require('./models/User')
const Vet = require('./models/Vet')

const app = express()

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(
    express.urlencoded({
        extended: true,
    }),
)
app.use(express.json()) 

app.use(express.static('public'))


//* POST INSERT pet
app.post('/users/create', async(req, res) => {
    const {nome, especie, raca, idade, sexo, nomeDoTutor} = req.body

    console.log(req.body)

    await User.create({nome, especie, raca, idade, sexo, nomeDoTutor})
    res.redirect('/')
})

//* INSERT pet
app.get('/users/create', (req,res) => {
    res.render('insertpet')
})

//* WHERE (página individual de cada paciente pet)
app.get('/users/:id', async(req, res) => {
    const id = req.params.id

    const user = await User.findOne({raw: true, where: {id:id} })
    res.render('petview', {user})
})

//* DELETE
app.post('/users/delete/:id', async(req,res) => {
    const id = req.params.id

    await User.destroy({where: {id: id} })
    res.redirect('/')
})

//* UPDATE 
app.get('/users/update/:id', async(req,res) => {
    const id = req.params.id

    const user = await User.findOne({ raw: true, where: {id:id} })

    res.render('updatepet', {user})
})

app.post('/users/update', async(req,res) => {
    const {id, name, especie, raca, idade, sexo, nomeDoTutor} = req.body

    const userData = {
        id,
        name,
        especie,
        raca,
        idade,
        sexo,
        nomeDoTutor,
    }

    await User.update(userData, {where: {id:id} })
    res.redirect('/')
})

//* HOME PAGE
app.get('/', async(req,res) => {
    const users = await User.findAll({raw: true})
    
    res.render('home', {users: users})
})

//* VET TABLE

//! Renderizando os veterinários
app.get('/vet/vetview', async(req,res) => {
    res.render('vetview')
})

//! Renderizando o formulários para registar o vet
app.get('/vet/create', async(req,res) => {
    res.render('vetregister')
})

//* POST vet
app.post('/vet/create', async(req,res) => {
    const veterinario = req.body.veterinario

    const vet = {
        veterinario,
    }

    await Vet.create(vet)

    res.redirect('/')
})

conn.sync().then(() => {  
  app.listen(3000)
})
.catch((err) => console.log(err))