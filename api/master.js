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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type } = req.query;

    let collectionName = '';
    switch (type) {
      case 'departments':
        collectionName = 'departments';
        break;
      case 'vendors':
        collectionName = 'vendors';
        break;
      case 'accounts':
        collectionName = 'accounts';
        break;
      case 'segments':
        collectionName = 'segments';
        break;
      case 'taxCategories':
        collectionName = 'taxCategories';
        break;
      default:
        return res.status(400).json({ error: '無効なマスタタイプです' });
    }

    const snapshot = await db.collection(collectionName).get();
    const data = [];
    snapshot.forEach(doc => {
      data.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
};
