import axios from "axios";
import { useEffect, useState } from "react";

export default function Search({setProducts, setNoItemsFound}) {

  const [timeoutSearch, setTimeoutSearch] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  
  useEffect(() => {
    searchProducts(searchValue)
  }, [searchValue])

  // timeout for search optimization
  // reduce server requests
  function searchProducts(search) {
    clearTimeout(timeoutSearch);
    setTimeoutSearch(setTimeout(() => {
      axios.get('/api/products?search='+search).then(response => {
        setProducts(response.data);
        if (response.data.length === 0) {
          setNoItemsFound(true)
        } else {
          setNoItemsFound(false)
        }
      });
    }, 500))
  }

  return (
    <>
      <input 
        onChange={(event) => {
          setSearchValue(event.target.value);
        }}
        className="w-full mb-0 mr-0" 
        value={searchValue}
        type="text" 
        placeholder="search"/>
    </>
  )
}