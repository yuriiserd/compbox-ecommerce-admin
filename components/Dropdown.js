import classNames from "classnames";
import { useState } from "react";

export default function Dropdown(props) {

  const [isVisibleDropdown, setIsVisibleDropdown] = useState(props.isVisible);
  const [selectedItem, setSelectedItem] = useState('');
  const [items, setItems] = useState(props.items);
  const [filteredItems, setFilteredItems] = useState(props.items);

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
  return (
    <>
      <div className="relative">
        <input
          className="mb-0 mr-0"
          type="text"
          placeholder="Parent Category"
          data-dropdown
          onChange={ev => {
            setIsVisibleDropdown(true);
            props.selectedItem(ev.target.value);
            setSelectedItem(ev.target.value);
            filterItems(ev.target.value);
          }}
          value={selectedItem}
        />
        <button
          className={classNames('dropdown-btn', {
            open: isVisibleDropdown
          })}
          data-dropdown
          onClick={(e) => {
            e.preventDefault();
            setIsVisibleDropdown(!isVisibleDropdown);
          }}>
          <svg data-dropdown xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>
      {isVisibleDropdown && !!filteredItems.length && (
        <ul data-dropdown className="absolute bottom-0 left-0 right-0 h-60 overflow-y-scroll translate-y-full bg-stone-200 rounded-md px-2 pt-2">
          {filteredItems.map(item => (
            <li 
              className="border-b pb-1 pt-1 last:border-none border-stone-300 cursor-pointer" 
              key={item._id}
              onClick={() => {
                props.selectedItem(item.name);
                setSelectedItem(item.name);
                setIsVisibleDropdown(false)
              }}
            >{item.name}</li>
          ))}
        </ul>
      )}
    </>
  )
}