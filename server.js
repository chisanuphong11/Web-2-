const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public')); // สำหรับไฟล์ HTML, CSS, JS

// ข้อมูลของขวัญ (ในความเป็นจริงควรใช้ฐานข้อมูล)
let gifts = [
    { id: 1, name: "หูฟังไร้สาย", category: "เทคโนโลยี", price: 1500 },
    { id: 2, name: "สมุดโน้ตน่ารักๆ", category: "เครื่องเขียน", price: 150 },
    { id: 3, name: "แก้วน้ำเก็บอุณหภูมิ", category: "ของใช้", price: 350 },
    { id: 4, name: "ขนมกล่องเล็ก", category: "อาหาร", price: 200 },
    { id: 5, name: "ตุ๊กตานุ่มฟู", category: "ของเล่น", price: 450 },
    { id: 6, name: "ต้นไม้เล็กประดับโต๊ะ", category: "ของตั้ง", price: 120 },
    { id: 7, name: "สายชาร์จเร็ว", category: "เทคโนโลยี", price: 250 },
    { id: 8, name: "ปากกาสีสวย", category: "เครื่องเขียน", price: 180 },
    { id: 9, name: "พวงกุญแจลายน่ารัก", category: "ของตั้ง", price: 80 },
    { id: 10, name: "ของขวัญลึกลับ! 🎁", category: "พิเศษ", price: 999 }
];

let nextId = 11;

// Routes

// GET - ดึงข้อมูลของขวัญทั้งหมด
app.get('/api/gifts', (req, res) => {
    res.json({
        success: true,
        message: 'ดึงข้อมูลของขวัญสำเร็จ',
        data: gifts,
        total: gifts.length
    });
});

// GET - ดึงข้อมูลของขวัญตาม ID
app.get('/api/gifts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const gift = gifts.find(g => g.id === id);
    
    if (!gift) {
        return res.status(404).json({
            success: false,
            message: 'ไม่พบของขวัญที่ต้องการ'
        });
    }
    
    res.json({
        success: true,
        message: 'ดึงข้อมูลของขวัญสำเร็จ',
        data: gift
    });
});

// GET - สุ่มของขวัญ
app.get('/api/gifts/random/pick', (req, res) => {
    if (gifts.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'ไม่มีของขวัญให้สุ่ม'
        });
    }
    
    const randomGift = gifts[Math.floor(Math.random() * gifts.length)];
    res.json({
        success: true,
        message: 'สุ่มของขวัญสำเร็จ',
        data: randomGift
    });
});

// POST - เพิ่มของขวัญใหม่
app.post('/api/gifts', (req, res) => {
    const { name, category, price } = req.body;
    
    // Validation
    if (!name || !category || price === undefined) {
        return res.status(400).json({
            success: false,
            message: 'กรุณากรอกข้อมูลให้ครบถ้วน (name, category, price)'
        });
    }
    
    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({
            success: false,
            message: 'ราคาต้องเป็นตัวเลขและมากกว่าหรือเท่ากับ 0'
        });
    }
    
    const newGift = {
        id: nextId++,
        name: name.trim(),
        category: category.trim(),
        price: price
    };
    
    gifts.push(newGift);
    
    res.status(201).json({
        success: true,
        message: 'เพิ่มของขวัญสำเร็จ',
        data: newGift
    });
});

// PUT - แก้ไขข้อมูลของขวัญ
app.put('/api/gifts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, category, price } = req.body;
    
    const giftIndex = gifts.findIndex(g => g.id === id);
    
    if (giftIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'ไม่พบของขวัญที่ต้องการแก้ไข'
        });
    }
    
    // Validation
    if (!name || !category || price === undefined) {
        return res.status(400).json({
            success: false,
            message: 'กรุณากรอกข้อมูลให้ครบถ้วน (name, category, price)'
        });
    }
    
    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({
            success: false,
            message: 'ราคาต้องเป็นตัวเลขและมากกว่าหรือเท่ากับ 0'
        });
    }
    
    gifts[giftIndex] = {
        id: id,
        name: name.trim(),
        category: category.trim(),
        price: price
    };
    
    res.json({
        success: true,
        message: 'แก้ไขข้อมูลของขวัญสำเร็จ',
        data: gifts[giftIndex]
    });
});

// DELETE - ลบของขวัญ
app.delete('/api/gifts/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const giftIndex = gifts.findIndex(g => g.id === id);
    
    if (giftIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'ไม่พบของขวัญที่ต้องการลบ'
        });
    }
    
    const deletedGift = gifts.splice(giftIndex, 1)[0];
    
    res.json({
        success: true,
        message: 'ลบของขวัญสำเร็จ',
        data: deletedGift
    });
});

// หน้าแรก - ส่งไฟล์ HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'ไม่พบเส้นทางที่ต้องการ'
    });
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`🎁 Gift Server กำลังทำงานที่ http://localhost:${PORT}`);
    console.log(`📋 API Endpoints:`);
    console.log(`   GET    /api/gifts          - ดูของขวัญทั้งหมด`);
    console.log(`   GET    /api/gifts/:id      - ดูของขวัญตาม ID`);
    console.log(`   GET    /api/gifts/random/pick - สุ่มของขวัญ`);
    console.log(`   POST   /api/gifts          - เพิ่มของขวัญใหม่`);
    console.log(`   PUT    /api/gifts/:id      - แก้ไขของขวัญ`);
    console.log(`   DELETE /api/gifts/:id      - ลบของขวัญ`);
});

module.exports = app;