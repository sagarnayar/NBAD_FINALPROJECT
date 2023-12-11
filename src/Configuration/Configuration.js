import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ConfigurePage({ updateHomePageData }) {
  const [categoryAllocation, setCategoryAllocation] = useState('');
  const [allocated, setAllocated] = useState('');
  const [selectedMonthAllocation, setSelectedMonthAllocation] = useState('January');
  const [selectedYearAllocation, setSelectedYearAllocation] = useState(new Date().getFullYear());
  const [allCategories, setAllCategories] = useState([]);
  const [allocationSuccess, setAllocationSuccess] = useState(false);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await axios.get('http://64.176.221.128:3002/api/get-all-categories');
        setAllCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchAllCategories();
  }, []);

  const handleAllocationSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    const allocatedValue = parseFloat(allocated);

    if (isNaN(allocatedValue)) {
      console.error('Invalid value for allocated:', allocated);
      return;
    }

    const budgetData = {
      category: categoryAllocation,
      allocated: allocatedValue,
      month: selectedMonthAllocation,
      year: selectedYearAllocation,
      userId,
    };

    try {
      const response = await axios.post('http://64.176.221.128:3002/api/configure-budget', budgetData);
      console.log(response.data);

      setAllocationSuccess(true);

      if (typeof updateHomePageData === 'function') {
        updateHomePageData();
      }
    } catch (error) {
      console.error('Error configuring budget:', error);
    }

    setTimeout(() => {
      setCategoryAllocation('');
      setAllocated('');
      setAllocationSuccess(false);
    }, 3000);
  };

  const months = [ 'select none',
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div role="form" aria-labelledby="configureBudgetHeading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundImage: 'url("/path/to/your/background-image.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <form onSubmit={handleAllocationSubmit} style={{ width: '48%', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.8)' }}>
        <h2 id="configureBudgetHeading" style={{ textAlign: 'center', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold', color: '#000' }}>CONFIGURE BUDGET</h2>
        
        {/* Label for Category */}
        <label style={{ display: 'block', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', color: '#000' }} htmlFor="categoryInput">
          Category:
          {/* Input for Category */}
          <input type="text" list="categoriesAllocatedList" id="categoryInput" value={categoryAllocation} onChange={(e) => setCategoryAllocation(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', color: '#000', background: 'rgba(255, 255, 255, 0.5)' }} />
          {/* Datalist for Category options */}
          <datalist id="categoriesAllocatedList">
            {allCategories.length > 0 && allCategories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </label>
        
        {/* Label for Allocated Budget */}
        <label style={{ display: 'block', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', color: '#000' }} htmlFor="allocatedInput">
          Allocated Budget:
          {/* Input for Allocated Budget */}
          <input type="number" id="allocatedInput" value={allocated} onChange={(e) => setAllocated(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', color: '#000', background: 'rgba(255, 255, 255, 0.5)' }} />
        </label>
        
        {/* Label for Month */}
        <label style={{ display: 'block', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', color: '#000' }} htmlFor="monthSelect">
          Month:
          {/* Dropdown for Month */}
          <select id="monthSelect" value={selectedMonthAllocation} onChange={(e) => setSelectedMonthAllocation(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', color: '#000', background: 'rgba(255, 255, 255, 0.5)' }}>
            {months.map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </label>
        
        {/* Label for Year */}
        <label style={{ display: 'block', marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', color: '#000' }} htmlFor="yearInput">
          Year:
          {/* Input for Year */}
          <input type="number" id="yearInput" value={selectedYearAllocation} onChange={(e) => setSelectedYearAllocation(e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', fontWeight: 'bold', color: '#000', background: 'rgba(255, 255, 255, 0.5)' }} />
        </label>
        
        {/* Submit button */}
        <button type="submit" style={{ backgroundColor: '#4caf50', color: '#fff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>Allocate</button>

        {/* Success message */}
        {allocationSuccess && (
          <div style={{ backgroundColor: '#000', color: '#fff', padding: '15px', borderRadius: '8px', marginTop: '10px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
            Successfully allocated!
          </div>
        )}
      </form>
    </div>
  );
}

export default ConfigurePage;
