
const express = require('express')
const exphbs = require('express-handlebars')

const conn = require('./db/conn')
const User = require('./models/User')
const Vet = require('./models/Vet')
const { where } = require('sequelize')

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
    const {nome, especie, raca, idade, sexo, nomeDoTutor, VetId} = req.body

    console.log(req.body)

    try {
        await User.create({nome, especie, raca, idade, sexo, nomeDoTutor, VetId})
        res.redirect('/')
    } catch(err) {
        console.log('Erro ao criar o pet:', err)
    }
})

//* INSERT pet
app.get('/users/create', async(req,res) => {
    try{
        const vet = await Vet.findAll({raw:true})
        res.render('insertpet', {vet: vet})
    } catch(err) {
        console.log('Erro ao buscar veterinário', err)
    }
})

//* WHERE (página individual de cada paciente pet)
app.get('/users/:id', async(req, res) => {
    const id = req.params.id

    const user = await User.findOne({include: Vet, where: {id:id} })

    console.log(user.get({ plain: true })); // Veja se o Vet aparece aqui
    
    res.render('petview', {user: user.get({ plain: true })})
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
    const vet = await Vet.findAll()

    try {
        const user = await User.findOne({ include: Vet, where: {id:id} })

        res.render('updatepet', {user: user.get({ plain: true }), 
            vet: vet.map(vet => vet.get({plain:true}))
        })
    } catch(error) {
        console.log(error)
    }
})

app.post('/users/update', async(req,res) => {
    const {id, name, especie, raca, idade, sexo, nomeDoTutor, VetId} = req.body

    const userData = {
        id,
        name,
        especie,
        raca,
        idade,
        sexo,
        nomeDoTutor,
        VetId
    }

    await User.update(userData, {where: {id:id} })
    res.redirect('/')
})

//* HOME PAGE
app.get('/', async(req,res) => {
    try {
        const users = await User.findAll({include: Vet})

        res.render('home', {users: users.map(user => user.get({plain: true}))})
    } catch(err) {
        console.log('Erro ao buscar pacientes:', err)
    }
})

//* VET TABLE

//! Renderizando os veterinários
app.get('/vet/vetview', async(req,res) => {
    try {
        const vet = await Vet.findAll({raw:true})
        res.render('vetview', {vet: vet})
    } catch(err) {
        console.log('Erro ao buscar veterinários:', err)
        res.status(500).send('Erro ao buscar veterinários')
    }
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

    res.redirect('/vet/vetview')
})

//* DELETE VET
app.post('/vet/delete/:id', async (req,res) => {
    const id = req.params.id

    try {
        await Vet.destroy({ where: {id:id} })
        res.redirect('/vet/vetview')
    } catch(err) {
        console.log('Erro ao excluir veterinário', err)
    }

})

conn.sync().then(() => {  
  app.listen(3000)
})
.catch((err) => console.log(err))