const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// 1. مسار جلب معلومات الحساب والحالة والنشاط عبر الـ UID
app.get('/api/account/info', async (req, res) => {
    const { uid, region } = req.query;

    if (!uid) {
        return res.status(400).json({ status: 'error', message: 'يرجى إدخال الـ UID' });
    }

    try {
        // الاتصال بمزود خوادم فري فاير لجلب البيانات
        const reg = region || 'ME'; // الشرق الأوسط افتراضياً
        const response = await axios.get(`https://freefireapi.me/api/info?uid=${uid}&region=${reg}`);
        
        // استرجاع البيانات
        res.json({
            status: 'success',
            data: response.data
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'فشل جلب بيانات الحساب', error: error.message });
    }
});

// 2. مسار إرسال اللايكات للـ UID
app.post('/api/account/like', async (req, res) => {
    const { uid, region } = req.body;

    if (!uid) {
        return res.status(400).json({ status: 'error', message: 'يرجى إدخال الـ UID' });
    }

    try {
        const reg = region || 'ME';
        // إرسال الطلب لزيادة اللايكات عبر خوادم اللعبة
        const response = await axios.get(`https://freefireapi.me/api/like?uid=${uid}&region=${reg}`);

        res.json({
            status: 'success',
            message: 'تمت معالجة طلب اللايكات بنجاح',
            result: response.data
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'فشل إرسال اللايكات', error: error.message });
    }
});

module.exports = app;
