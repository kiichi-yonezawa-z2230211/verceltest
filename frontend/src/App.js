import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    affiliationCode: '150032',
    burdenDeptCode: '',
    vendorCode: '',
    accountCode: '',
    segmentCode: '',
    paymentAmount: '',
    taxTypeCode: '',
    absorptionFlag: '0',
    remarks: ''
  });

  const [expenses, setExpenses] = useState([]);

  // Firestoreから経費データを取得
  const fetchExpenses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'expenses'));
      const expenseList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setExpenses(expenseList);
    } catch (error) {
      console.error('経費データ取得エラー:', error);
      alert('経費データの取得に失敗しました');
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // バリデーション
    if (!formData.burdenDeptCode || !formData.accountCode || !formData.paymentAmount) {
      alert('必須項目を入力してください');
      return;
    }

    if (formData.paymentAmount < 1) {
      alert('支払金額は1円以上で入力してください');
      return;
    }

    try {
      await addDoc(collection(db, 'expenses'), {
        ...formData,
        paymentAmount: Number(formData.paymentAmount),
        createdAt: new Date().toISOString(),
        status: '新規'
      });
      
      alert('経費申請を保存しました');
      
      // フォームリセット
      setFormData({
        affiliationCode: '150032',
        burdenDeptCode: '',
        vendorCode: '',
        accountCode: '',
        segmentCode: '',
        paymentAmount: '',
        taxTypeCode: '',
        absorptionFlag: '0',
        remarks: ''
      });
      
      fetchExpenses();
    } catch (error) {
      console.error('保存エラー:', error);
      alert('経費申請の保存に失敗しました');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('この経費申請を削除しますか?')) {
      try {
        await deleteDoc(doc(db, 'expenses', id));
        alert('削除しました');
        fetchExpenses();
      } catch (error) {
        console.error('削除エラー:', error);
        alert('削除に失敗しました');
      }
    }
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <h1>経費支払入力 - 基本入力</h1>
        </div>
      </header>

      <main className="main-container">
        <div className="title-bar">経費申請フォーム</div>

        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-group">
            <label>所属コード *</label>
            <input
              type="text"
              name="affiliationCode"
              value={formData.affiliationCode}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>負担部門コード *</label>
            <input
              type="text"
              name="burdenDeptCode"
              value={formData.burdenDeptCode}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>支払先コード</label>
            <input
              type="text"
              name="vendorCode"
              value={formData.vendorCode}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>勘定科目コード *</label>
            <input
              type="text"
              name="accountCode"
              value={formData.accountCode}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>セグメントコード</label>
            <input
              type="text"
              name="segmentCode"
              value={formData.segmentCode}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>支払金額(税込) *</label>
            <input
              type="number"
              name="paymentAmount"
              value={formData.paymentAmount}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>税区分コード</label>
            <input
              type="text"
              name="taxTypeCode"
              value={formData.taxTypeCode}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>配賦フラグ</label>
            <select
              name="absorptionFlag"
              value={formData.absorptionFlag}
              onChange={handleInputChange}
            >
              <option value="0">配賦なし</option>
              <option value="1">配賦あり</option>
            </select>
          </div>

          <div className="form-group">
            <label>備考</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <button type="submit" className="submit-btn">登録</button>
        </form>

        <div className="expense-list">
          <h2>登録済み経費一覧</h2>
          {expenses.length === 0 ? (
            <p>登録されている経費はありません</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>所属コード</th>
                  <th>負担部門</th>
                  <th>勘定科目</th>
                  <th>支払金額</th>
                  <th>ステータス</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.affiliationCode}</td>
                    <td>{expense.burdenDeptCode}</td>
                    <td>{expense.accountCode}</td>
                    <td>¥{Number(expense.paymentAmount).toLocaleString()}</td>
                    <td>{expense.status}</td>
                    <td>
                      <button 
                        onClick={() => handleDelete(expense.id)}
                        className="delete-btn"
                      >
                        削除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
