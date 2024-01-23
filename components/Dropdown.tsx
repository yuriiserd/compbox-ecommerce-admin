import classNames from "classnames";
import { useEffect, useState } from "react";

type SelectedItem = {
  name: string;
} | string | null;

type DropdownProps = {
  items: string[] | {}[];
  placeholder?: string;
  selectedItem: (item: SelectedItem) => void;
  editable?: boolean;
  initialItem: SelectedItem;
}

export default function Dropdown(props: DropdownProps) {

  // props - items, placeholder, selectedItem, editable, initialItem

  const [isVisibleDropdown, setIsVisibleDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  const [selectedItemName, setSelectedItemName] = useState('');
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setItems(props.items);
    setSelectedItem(props.initialItem || null);
  }, [isVisibleDropdown, props.initialItem])

  useEffect(() => {
    if (typeof(selectedItem) !== 'string') {
      setSelectedItemName(selectedItem?.name);
    } else {
      setSelectedItemName(selectedItem);
    }
  }, [selectedItem])

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

  function selectItemOnChange(name) {
    items.forEach(item => {
      let itemName = item.name.toLowerCase();
      let nameLowerCase = name.toLowerCase()
      if (itemName.includes(nameLowerCase)) {
        if (itemName === nameLowerCase) {
          props.selectedItem(item)
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
            selectItemOnChange(ev.target.value);
            filterItems(ev.target.value);
          }}
          value={selectedItemName}
        />
        <button
          className={classNames(`dropdown-btn ${!props?.editable && 'dropdown-btn_full'}`, {
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
        <div className="absolute z-50 bottom-0 left-0 right-0 max-h-60 overflow-y-scroll translate-y-full bg-stone-200 rounded-md px-2 py-2">
          {filteredItems.map(item => (
            <div 
              className="border-b pb-1 pt-1 last:border-none border-stone-300 cursor-pointer" 
              key={item._id ? item._id : item.name ? item.name : item}
              onClick={() => {
                props.selectedItem(item);
                setSelectedItem(item);
                setIsVisibleDropdown(false)
              }}
            >{item.name ? item.name : item}</div>
          ))}
        </div>
      )}
    </>
  )
}