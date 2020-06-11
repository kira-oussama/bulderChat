//imports 
const http = require('http');
const app = require('./app');

//create server
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = require("socket.io")(server);


app.get('/', (req, res)=>{
    res.status(200).json({
        message: "welcome to bulder chat"
    });
})

//Realtime communication
var usersOnline = [];
io.on('connection', (socket) => {
    //handle users when connect
    socket.on('username', (username) => {
        usersOnline.push({id: socket.id, username});
        io.emit('usersOnline', usersOnline);
        socket.emit('usersOnline', usersOnline)
        // console.log(usersOnline)
    });


    //handle users when send messges in public room
    socket.on('newPublicMessage', message=>{
        io.emit('newPublicMessage', message);
    });
    

    //handle private messages
    socket.on('privateMessage', message=>{
        var receiverId = "";
        usersOnline.forEach(obj=>{
            if(obj.username === message.receiver){
                receiverId = obj.id;
            }
        });
        io.to(`${receiverId}`).emit('privateMessage', {sender: message.sender, message: message.message});
    })


    socket.on('disconnect', ()=>{
        usersOnline = usersOnline.filter(function( obj ) {
            return obj.id !== socket.id;
        });
    })

});



server.listen(port, () => console.log(`Server listening on port ${port}`) );