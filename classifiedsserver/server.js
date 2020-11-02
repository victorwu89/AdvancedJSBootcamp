const express = require('express')
const  cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const app = express()
app.use(cors())
app.use(express.json())
const SECRET_KEY = "secret!"

const users = [
  {
    id: 1,
    name: "Test user",
    email: "your@email.com",
    password: "$2b$10$ahs7h0hNH8ffAVg6PwgovO3AVzn1izNFHn.su9gcJnUWUzb2Rcb2W", // = ssseeeecrreeet
  },
]

const items = [
  {
    id: 1,
    user: 1,
    title: "Used MacBook Pro 2015",
    price: 500,
    description: "I have an unused MacBook Pro 2015, anyone want it?",
  },
  {
    id: 2,
    user: 1,
    title: "Selling a used Camping Tent",
    price: 100,
    description: "I am selling my used camping tent",
  },
  {
    id: 3,
    user: 1,
    title: "Looking for a used camera",
    price: 100,
    description: "Hi I am looking for a used camera, price under 100$!",
  },
]

app.post("/login", async (req, res) => {
  const { email, password } = req.body
  const theUser = users.find((user) => user.email === email)

  if (!theUser) {
    res.status(404).send({
      success: false,
      message: `Could not find account: ${email}`,
    })
    return
  }

  const match = await bcrypt.compare(password, theUser.password)
  if (!match) {
    //return error to user to let them know the password is incorrect
    res.status(401).send({
      success: false,
      message: "Incorrect credentials",
    })
    return
  }

  const token = jwt.sign({ email: theUser.email }, SECRET_KEY)

  res.send({
    success: true,
    token: token,
  })
})

app.get("/items", async (req, res) => {
  const token = req.headers.authorization || ""

  try {
    const { email } = jwt.verify(token.split(" ")[1], SECRET_KEY)
    const userid = users.filter((user) => user.email === email)[0].id

    res.send({
      success: true,
      items: items.map((item) => {
        item.email = users.filter((user) => user.id === item.user)[0].email
        return item
      }),
    })
  } catch (e) {
    console.log("Authentication token is invalid, please log in")
    res.status(500).send({
      success: false,
      message: "Authentication token is invalid, please log in",
    })
  }
})

app.post("/new", async (req, res) => {
  const token = req.headers.authorization || ""

  try {
    const { email } = jwt.verify(token.split(" ")[1], SECRET_KEY)
    const user = users.filter((user) => user.email === email)[0].id
    const { title, price, description } = req.body

    items.push({
      id:
        Math.max.apply(
          Math,
          items.map(function (o) {
            return o.id
          })
        ) + 1,
      user,
      title,
      price,
      description,
    })

    res.send({
      success: true,
      items: items.map((item) => {
        item.email = users.filter((user) => user.id === item.user)[0].email
        return item
      }),
    })
  } catch (e) {
    console.log("Authentication token is invalid, please log in")
  }
})

app.listen(3010, () => console.log("Server listening on port 3010"))
