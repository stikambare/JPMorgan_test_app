import React, { useState, useEffect } from 'react';
import './App.css';

// const sampleData = [
//   {
//     ticker: "ALPHA",
//     price: 3150.67,
//     assetClass: "Credit",
//   },
//   {
//     ticker: "BETA",
//     price: 3791.37,
//     assetClass: "Equities",
//   },

// ];




const App = () => {

  const [data, setData] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  
  const getData = async() => {
    
    try{

      const res = await fetch('/sampleData.json')
      const mainData = await res.json();
      setData(mainData);

    }catch(err){

      console.log(err)

    }
     
  }

  useEffect(() => {
  
    getData();  
  
  },[])
  

  const handleSort = (field) => {
    setSortField(field);
    const sortedData = [...data];
  
    if (field === 'assetClass') {
      sortedData.sort((a, b) => {
        const assetOrder = { Equities: 0, Macro: 1, Credit: 2 };
        return assetOrder[a.assetClass] - assetOrder[b.assetClass];
      });
    } else if (field === 'ticker') {
      sortedData.sort((a, b) => {
        if (sortDirection === 'asc') {
          return a[field].localeCompare(b[field]);
        } else {
          return b[field].localeCompare(a[field]);
        }
      });
      setSortDirection((prevSortDirection) => prevSortDirection === 'asc' ? 'desc' : 'asc');
    } else if (field === 'price') {
      sortedData.sort((a, b) => {
        return sortDirection === 'asc' ? a[field] - b[field] : b[field] - a[field];
      });
      setSortDirection((prevSortDirection) => prevSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      sortedData.sort((a, b) => {
        return a[field] - b[field];
      });
    }
  
    setData(sortedData);
  };
  
  

  const renderRow = (instrument) => {
    const rowStyle = {
      backgroundColor: {
        Macro: 'white',
        Equities: 'blue',
        Credit: 'green',
      }[instrument.assetClass],
      color: instrument.price >= 0 ? 'black' : 'red',
    };

    return (
      <tr key={instrument.ticker} style={rowStyle}>
        <td>{instrument.ticker}</td>
        <td>{instrument.price.toFixed(2)}</td>
        <td>{instrument.assetClass}</td>
      </tr>
    );
  };

  return (
    <div className="App">
      <h1>Financial Instruments Table</h1>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('ticker')}>Ticker</th>
            <th onClick={() => handleSort('price')}>Price</th>
            <th onClick={() => handleSort('assetClass')}>Asset Class</th>
          </tr>
        </thead>
        <tbody>
          {data.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
};

export default App;
