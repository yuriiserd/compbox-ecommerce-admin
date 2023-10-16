import classNames from "classnames";
import { useEffect, useState } from "react";

export default function Dropdown(props) {

  const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setItems(props.items);
    setSelectedItem(props.initialItem || {});
  }, [isVisibleDropdown, props.initialItem])

  useEffect(() => {
    setFilteredItems(props.items);
  }, [isVisibleDropdown])

  function filterItems(target) {
    target = target.toLowerCase();
    setFilteredItems(() => {
      const filtered = [];
      items.forEach(cat => {
        let {name} = cat;
        name = name.toLowerCase();
        if (name.includes(target)) {
          filtered.push(cat)
        }
      })
      return filtered
    })
  }

  function findItemByName(name) {

    items.forEach(item => {
      let itemName = item.name.toLowerCase();
      let nameLowerCase = name.toLowerCase()
      if (itemName.includes(nameLowerCase)) {
        setSelectedItem({
          name
        });
        if (itemName === nameLowerCase) {
          props.selectedItem(item);
          setSelectedItem(item)
        }
      }
    })
  }

  return (
    <>
      {isVisibleDropdown && (
        <div 
          className="fixed left-0 right-0 top-0 bottom-0 z-40"
          onClick={() => {setIsVisibleDropdown(false)}}>
        </div>
      )}
      <div className="relative z-50">
        <input
          className="mb-0 mr-0"
          type="text"
          placeholder={props.placeholder}
          onChange={ev => {
            setIsVisibleDropdown(true);
            findItemByName(ev.target.value);
            filterItems(ev.target.value);
          }}
          value={selectedItem.name || ''}
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
          {filteredItems.map(item => (
            <li 
              className="border-b pb-1 pt-1 last:border-none border-stone-300 cursor-pointer" 
              key={item._id}
              onClick={() => {
                props.selectedItem(item);
                setSelectedItem(item);
                setIsVisibleDropdown(false)
              }}
            >{item.name}</li>
          ))}
        </ul>
      )}
    </>
  )
}