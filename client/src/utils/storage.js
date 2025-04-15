import localforage from 'localforage';

// Cấu hình localForage
localforage.config({
  name: 'FamilyFunds',
  storeName: 'funds'
});

// Lấy dữ liệu từ storage
export const getFunds = async () => {
  try {
    const funds = await localforage.getItem('funds');
    if (!funds) {
      // Nếu không có dữ liệu, load từ file JSON
      const response = await fetch('/data/funds.json');
      const data = await response.json();
      await localforage.setItem('funds', data.funds);
      return data.funds;
    }
    return funds;
  } catch (err) {
    console.error('Error getting funds:', err);
    return [];
  }
};

// Lưu dữ liệu vào storage
export const saveFunds = async (funds) => {
  try {
    await localforage.setItem('funds', funds);
  } catch (err) {
    console.error('Error saving funds:', err);
  }
};

// Thêm quỹ mới
export const addFund = async (newFund) => {
  try {
    const funds = await getFunds();
    funds.push(newFund);
    await saveFunds(funds);
    return funds;
  } catch (err) {
    console.error('Error adding fund:', err);
    return null;
  }
};

// Xóa quỹ
export const deleteFund = async (fundId) => {
  try {
    const funds = await getFunds();
    const updatedFunds = funds.filter(fund => fund.id !== fundId);
    await saveFunds(updatedFunds);
    return updatedFunds;
  } catch (err) {
    console.error('Error deleting fund:', err);
    return null;
  }
};

// Thêm giao dịch mới
export const addTransaction = async (fundId, newTransaction) => {
  try {
    const funds = await getFunds();
    const fundIndex = funds.findIndex(fund => fund.id === fundId);
    
    if (fundIndex !== -1) {
      // Cập nhật số dư
      if (newTransaction.type === 'deposit') {
        funds[fundIndex].currentBalance += newTransaction.amount;
      } else {
        funds[fundIndex].currentBalance -= newTransaction.amount;
      }
      
      // Thêm giao dịch mới
      funds[fundIndex].transactions.push(newTransaction);
      await saveFunds(funds);
      return funds;
    }
    return null;
  } catch (err) {
    console.error('Error adding transaction:', err);
    return null;
  }
}; 