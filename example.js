#!/usr/bin/env node

const storm = require('node-storm')

const sentences = [
  "the cow jumped over the moon",
  "an apple a day keeps the doctor away",
  "four score and seven years ago",
  "snow white and the seven dwarfs",
  "i am at two with nature"
]
const randomsentence = storm.spout(function(callback) {
  const self = this
  const i = Math.floor(Math.random() * sentences.length)
  const sentence = sentences[i]
  setTimeout(() => {
    self.emit([sentence]) /* {id:'unique'} //for reliable emit */
    callback()
  }, 1000);
})
.declareOutputFields([""])

const splitsentence = storm.asyncbolt(function(data, callback) {
  const words = data.tuple[0].split(" ")
  words.forEach((word, index) => {
    if (!word) {
      return
    }
    if (!index) {
      this.emit([word.trim()], {stream: 'a'});
    } else {
      this.emit([word.trim()], {stream: 'b'});
    }
	})
	callback(err)
})
.declareStream('a', ['0'])
.declareStream('b', ['0'])

const counts = {}
const wordcountA = storm.asyncbolt(function(data, callback) {
  const word = data.tuple[0]
  if (counts[word] == null) {
  	counts[word] = 0
  }
  const count = ++counts[word]
  this.emit([word, count])
  callback()
})
.declareOutputFields(['0', '1'])

const wordcountB = storm.asyncbolt(function(data, callback) {
  const word = data.tuple[0]
  if (counts[word] == null) {
  	counts[word] = 0
  }
  const count = ++counts[word]
  this.emit([word, count])
  callback()
})
.declareOutputFields(['0', '1'])

const builder = storm.topologybuilder()
builder.setSpout('randomsentence', randomsentence)
builder.setBolt('splitsentence', splitsentence, 8).shuffleGrouping('randomsentence')
builder.setBolt('wordcount.a', wordcountA, 5).shuffleGrouping('splitsentence', 'a')
builder.setBolt('wordcount.b', wordcountB, 5).shuffleGrouping('splitsentence', 'b')

const nimbus = process.argv[2]
const options = {
  config: {
    'topology.debug': true
  }
}
const topology = builder.createTopology()

if (nimbus == null) {
  const cluster = storm.localcluster()
  cluster.submit(topology, options).then().finally(() => {
    return cluster.shutdown()
  }).fail(console.error)
} else {
  options.nimbus = nimbus
  storm.submit(topology, options).fail(console.error)
}
