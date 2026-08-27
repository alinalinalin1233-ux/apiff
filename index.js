const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// تفعيل CORS لتمكين الاستدعاء من أي موقع أو تطبيق
app.use(cors());
app.use(express.json());

// 1. مسار الصفحة الرئيسية (لتجنب خطأ 502 عند فتح الرابط المباشر)
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'Free Fire API is running successfully!',
        endpoints: {
            account_info: '/api/account/info?uid=YOUR_UID&region=ME',
            add_likes: 'POST /api/account/like'
        }
    });
});

// 2. مسار جلب معلومات الحساب وحالة النشاط
app.get('/api/account/info', async (req, res) => {
    const { uid, region } = req.query;

    if (!uid) {
        return res.status(400).json({
            status: 'error',
            message: 'يرجى إدخال الـ UID الخاص بالحساب'
        });
    }

    const targetRegion = region || 'ME';

    try {
        // الاتصال بمزود خدمة بيانات فري فاير
        const response = await axios.get(`https://api.gameskinbo.com/ff-info/get?uid=${uid}&region=${targetRegion}`, {
            timeout: 10000
        });

        return res.json({
            status: 'success',
            uid: uid,
            region: targetRegion,
            data: response.data
        });
    } catch (error) {
        // في حال توقف الخادم الرئيسي أو وجود خطأ بالـ UID
        return res.status(500).json({
            status: 'error',
            message: 'تعذر جلب بيانات الحساب. تأكد من صحة الـ UID وسيرفر اللعبة.',
            details: error.message
        });
    }
});

// 3. مسار إرسال زيادة اللايكات (POST Request)
app.post('/api/account/like', async (req, res) => {
    const { uid, region } = req.body;

    if (!uid) {
        return res.status(400).json({
            status: 'error',
            message: 'يرجى تزويد الـ UID في Body الطلب'
        });
    }

    const targetRegion = region || 'ME';

    try {
        // إرسال طلب زيادة اللايكات للخادم الخاص باللعبة
        const response = await axios.get(`https://freefireapi.me/api/like?uid=${uid}&region=${targetRegion}`, {
            timeout: 10000
        });

        return res.json({
            status: 'success',
            message: 'تمت معالجة طلب إرسال اللايكات بنجاح',
            result: response.data
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'حدث خطأ أثناء إرسال اللايكات',
            details: error.message
        });
    }
});

// التصدير الخاص بـ Vercel Serverless Functions
module.exports = app;
