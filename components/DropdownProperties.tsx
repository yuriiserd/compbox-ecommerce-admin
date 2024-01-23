import classNames from "classnames";
import { set } from "mongoose";
import { useEffect, useState } from "react";

type DropdownPropertiesProps = {
  items: string[];
  selectedItem: (item: string) => void;
  initialItem: string;
}

export default function DropdownProperties(props) {

  const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setSelectedItem(props.initialItem);
  },[])

  useEffect(() => {
    setItems(props.items);
    
    setFilteredItems(props.items);
  }, [isVisibleDropdown, props.initialItem])

  function filterItems(target) {
    const targetCheck = target.toLowerCase();
    setFilteredItems(() => {
      const filtered = [];
      items.forEach(item => {
        const itemCheck = item.toLowerCase();
        if (itemCheck.includes(targetCheck)) {
          filtered.push(item)
        }
      })
      return filtered
    })
  }

  function selectItemOnChange(name) {
    if (name !== '') {
      items.forEach(item => {
        let itemName = item.toLowerCase();
        let nameLowerCase = name.toLowerCase()
        if (itemName.includes(nameLowerCase)) {
          if (itemName === nameLowerCase) {
            props.selectedItem(item)
          }
        }
      })
    }
  }

  return (
    <>
      {isVisibleDropdown && (
        <div 
          className="fixed left-0 right-0 top-0 bottom-0 z-40"
          onClick={() => {setIsVisibleDropdown(false)}}>
        </div>
      )}
      <div className="relative z-30 w-full">
        <input
          className="mb-0 mr-0"
          type="text"
          placeholder="value"
          onChange={ev => {
            if (ev.target.value !== '') {
              setIsVisibleDropdown(true);
            } else {
              setIsVisibleDropdown(false);
            }
            console.log(ev.target.value + " value")
            selectItemOnChange(ev.target.value);
            filterItems(ev.target.value);
            setSelectedItem(ev.target.value);
          }}
          value={selectedItem}
        />
        <button
          className={classNames('dropdown-btn', {
            open: isVisibleDropdown
          })}
          onClick={(e) => {
            e.preventDefault();
            setIsVisibleDropdown(!isVisibleDropdown);
          }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>
      {isVisibleDropdown && (
        <ul className="absolute z-50 bottom-0 left-0 right-0 h-60 overflow-y-scroll translate-y-full bg-stone-200 rounded-md px-2 pt-2">
          {filteredItems.map((item, index) => (
            <li 
              className="border-b pb-1 pt-1 last:border-none border-stone-300 cursor-pointer" 
              key={index}
              onClick={() => {
                props.selectedItem(item);
                setSelectedItem(item);
                setIsVisibleDropdown(false)
              }}
            >{item}</li>
          ))}
        </ul>
      )}
    </>
  )
}