// implement your server here
// require your posts router and connect it here
const express = require('express')
const posts = require('./posts/posts-model')
const postsRouter = require('./posts/posts-router')
const server = express()
server.use(express.json())

//get posts
server.get('/api/posts', (req, res) => {
    posts.find()
    .then(posts => {
        res.json(posts)
    })
    .catch(err => {
        res.status(500).json({
            message: "The posts information could not be retrieved",
        err: err.message,
        stack: err.stack,
        })
    })
})

//get posts by id
server.get('/api/posts/:id', (req, res) => {
    posts.findById(req.params.id)
    .then(post => {
        if(post){
        res.json(post)}
        else res.status(404).json({message:'does not exist'})
    })
    .catch(err => {
        res.status(500).json({
            message: "The post information could not be retrieved",
        err: err.message,
        stack: err.stack,
        })
    })
})

// post new Post
server.post('/api/posts/', (req, res) => {
    const {title, contents}  = req.body

if(!title || !contents){
    throw new Error(res.status(400).json({message: 'please provide title & contents'}))
           
        } 

    posts.insert({title, contents})
    .then((newpost) => {
        
        res.status(201).json(newpost)
    })
    .catch(err => {
        res.status(500).json({
            message: "There was an error while saving the post to the database",
        err: err.message,
        stack: err.stack,
        })
    })
})

//Update post by id
server.put('/api/posts/:id', (req, res) => {
    const {id} = req.params
    const update = req.body

    if(!update.title || !update.contents){
    throw new Error(res.status(400).json({message: 'provide title and contents'}))

    }

    posts.update(id, update)
    .then(updated => {
       if(updated){
        res.status(200).json(update)
       }
       else res.status(404).json({message: "The post with the specified ID does not exist" })

    })
    .catch(err => {
        res.status(500).json({
            message: "The post information could not be modified",
        err: err.message,
        stack: err.stack,
        })
    })
})

//delete post by id
server.delete('/api/posts/:id', (req, res) => {
    posts.remove(req.params.id)
    .then(post => {
        if(post){
        res.json(post)}
        else res.status(404).json({message:"The post with the specified ID does not exist"})
    })
    .catch(err => {
        res.status(500).json({
            message: "The post could not be removed",
        err: err.message,
        stack: err.stack,
        })
    })
})

module.exports = server;