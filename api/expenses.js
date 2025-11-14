const admin = require('firebase-admin');

// Firebase Admin初期化
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'test1-384bd'
  });
}

const db = admin.firestore();

module.exports = async (req, res) => {
  // CORSヘッダー設定
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // 経費データ取得
      const expensesSnapshot = await db.collection('expenses').get();
      const expenses = [];
      expensesSnapshot.forEach(doc => {
        expenses.push({ id: doc.id, ...doc.data() });
      });
      
      res.status(200).json(expenses);
    } else if (req.method === 'POST') {
      // 経費データ保存
      const data = req.body;
      
      // バリデーション
      if (!data.burdenDeptCode || !data.accountCode || !data.paymentAmount) {
        return res.status(400).json({ error: '必須項目を入力してください' });
      }

      if (data.paymentAmount < 1) {
        return res.status(400).json({ error: '支払金額は1円以上で入力してください' });
      }

      const docRef = await db.collection('expenses').add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: '新規'
      });

      res.status(201).json({ 
        id: docRef.id, 
        message: '経費申請を保存しました' 
      });
    } else if (req.method === 'DELETE') {
      // 経費データ削除
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'IDが必要です' });
      }

      await db.collection('expenses').doc(id).delete();
      
      res.status(200).json({ message: '削除しました' });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};
