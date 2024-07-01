// implement your posts router here
const express = require('express')
const posts = require('./posts-model')

const router = express.Router()

router.get('/', (req, res) => {
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
router.get('/:id', (req, res) => {
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
router.post('/', (req, res) => {
    const {title, contents}  = req.body

    if(!title || !contents){
       return res.status(400).json({message: 'please provide title & contents'}) 
            } 
    
        posts.insert({title, contents})
        .then(({id}) => {
            return posts.findById(id)
        })
        .then( post => {
            res.status(201).json(post)
        })
        .catch(err => {
            res.status(500).json({
                message: "There was an error while saving the post to the database",
            err: err.message,
            stack: err.stack,
            })
        })
})
router.put('/:id', (req, res) => {
    const {id} = req.params
    const update = req.body

    if(!update.title || !update.contents){
    throw new Error(res.status(400).json({message: 'provide title and contents'}))

    }

    posts.update(id, update)
    .then((huh) => {
       if(huh){
        return posts.findById(id)
       }
       else res.status(404).json({message: "The post with the specified ID does not exist" })

    })
    .then( post => {
        res.status(200).json(post)
    })
    .catch(err => {
        res.status(500).json({
            message: "The post information could not be modified",
        err: err.message,
        stack: err.stack,
        })
    })
})
router.delete('/:id', async (req, res) => {
    const {id} = req.params
    const deletedpost = await posts.findById(id)
    posts.remove(id)
    .then((ehhhh) => {
        console.log(ehhhh)
        if(ehhhh){
         res.json(deletedpost)
    }
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
router.get('/:id/comments', (req, res) => {

})


module.exports= router;