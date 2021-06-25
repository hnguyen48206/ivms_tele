
const { Worker, isMainThread, workerData, parentPort } = require('worker_threads');

if(!isMainThread)
{
    console.log(workerData)
    parentPort.postMessage({ welcome: workerData })

    //These events work when main thread send messages to worker
    parentPort.on('message',(data)=>{
        console.log(data)
    })
}
