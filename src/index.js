const express = require('express')
//Universal Unique Id
const { uuid } = require('uuidv4') //{uuid} importando apenas uma função

const app = express()

app.use(express.json()) // utiliza em todas as rotas

//simulando banco de dados
const projects = []

//Middleware para mostrar todas as rotas que esta sendo chamada no Postman 
function logRequest(req, res, next) {
  const { method, url } = req

  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.log(logLabel)

  return next() // chamada do próximo middeware
}

app.use(logRequest) // utiliza o middleware em todas as rotas

//***LIST */
app.get('/projects', (req, res) => {
  //variavel coleta informaçãos do parametro de busca
  const {title} = req.query
  
  // retorna o valor encontrado na busca (filter) 
  // se não for encontrado retorna todos / includes retorna falso ou verdad
  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects

  return res.json(results)
})

//***CREATE */
app.post('/projects', (req, res) => {
  const { title, owner } = req.body

  const project = { id: uuid(), title, owner }

  projects.push(project)
  
  return res.json(project)
})

//***UPDATE */
app.put('/projects/:id', (req,res) => {
  const {id} = req.params //pega Id enviado através do HTTP
  const { title, owner } = req.body //pega as informações através do postman 

  //variavel projectIndex percorre todos os projetos e retorna
  // o índice do projeto que for igual ao id passado
  const projectIndex = projects.findIndex(project => project.id === id)

  //se o projectIndex for menor do que zero quer dizer que o projeto
  //não foi encotrado gerando status 400 (algum erro do cliente)
  if (projectIndex < 0) {
    return res.status(400).json({error: 'Project not found.'})
  }

  //Atualiza novo projeto utilizando requisição no Postman
  const project = {
    id,
    title,
    owner,
  }

  projects[projectIndex] = project

  return res.json(projects[projectIndex])
})

//**DELETE */
app.delete('/projects/:id', (req,res) => {
  const {id} = req.params

  const projectIndex = projects.findIndex(project => project.id === id)
  
  if(projectIndex < 0) {
    return res.status(400).json(
      {
      error: "Project Not Found."
      }
    )
  }

  //remove do array 1 elemento após o projectIndex
  projects.splice(projectIndex, 1)

  //retorna mensagem fazia com status ok
  return res.status(204).send()
})

app.listen(3333, () => console.log('🖥 The server has started...'))