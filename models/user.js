/*
flores@flores-VirtualBox:~/wik-njs-303-skeleton$ sudo docker run -p 4444:6379 --name=redis-srv --rm redis

flores@flores-VirtualBox:~$ sudo docker exec -ti redis-srv redis-cli

flores@flores-VirtualBox:~$ cd wik-njs-303-skeleton/
flores@flores-VirtualBox:~/wik-njs-303-skeleton$ npm run watch

http://127.0.0.1:8080/users
*/

const Redis = require('ioredis')
const redis = new Redis(4444) 
const uuid = require('uuid')

module.exports = {
  get: async (userId) => {
    return await redis.hgetall("user:"+userId)
  },

  count: async () => {
    return await redis.scard("users")
  },

  getAll: async(limit, offset) => {
    const users = await redis.smembers('users')
    const listusers = []
    for (let i = 0; i < users.length; i++){
      listusers.push( await redis.hgetall ('user:'+users[i]))
    }
     return listusers
  },

  insert: async (params) => {
    const id = uuid.v4()
    const add = await redis.sadd ('users',id)
    return await redis.hmset ('user:'+id,{
      rowid: id,
      pseudo :params.pseudo,
      firstname: params.firstname,
      lastname: params.lastname,
      email: params.email,
      password: params.password
    })

  },

  update: async (userId, params) => {
    return await redis.hmset ('user:'+userId,{
      rowid: userId,
      pseudo :params.pseudo,
      firstname: params.firstname,
      lastname: params.lastname,
      email: params.email,
      password: params.password
    })
  },

  remove: async (userId) => {
     await redis.srem('users', userId)
     return await redis.del('user:'+userId)
  }

}