require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 连接到 MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// 创建一个简单的文档模型
const Document = mongoose.model('Document', { content: String });

// 处理连接
io.on('connection', (socket) => {
    console.log('用户已连接');

    // 发送当前文档内容
    Document.findOne({}, (err, doc) => {
        if (doc) {
            socket.emit('load document', doc.content);
        }
    });

    // 监听内容更新
    socket.on('update document', (content) => {
        Document.findOneAndUpdate({}, { content }, { upsert: true }, (err) => {
            if (err) console.error(err);
        });
        socket.broadcast.emit('document updated', content);
    });

    socket.on('disconnect', () => {
        console.log('用户已断开连接');
    });
});
// 访问模板
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'template.html'));
});
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
// 启动服务器
server.listen(3000, () => {
    console.log('服务器正在运行在 http://localhost:3000');
});
