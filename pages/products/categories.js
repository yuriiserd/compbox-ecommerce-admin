import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Back from "@/components/Back";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import Error from "@/components/Error";
import classNames from "classnames";

export default function Categories() {

  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [nameError, setNameError] = useState(false);
  const [parentError, setParentError] = useState(false);
  const [isVisibleDropdown, setisVisibleDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState();

  useEffect(() => {
    updateCategories();
  }, [])

  function updateCategories() {
    axios.get('/api/categories').then(res => {
      setCategories(res.data);
      setFilteredCategories(res.data)
    })
  }

  function filterCategories(target) {
    target = target.toLowerCase();
    setFilteredCategories(() => {
      const filtered = [];
      categories.forEach(cat => {
        let {name} = cat;
        name = name.toLowerCase();
        if (name.includes(target)) {
          filtered.push(cat)
        }
      })
      return filtered
    })
  }

  function validateCat(target) {
    let bool = false;
    categories.forEach(cat => {
      if (cat.name === target) {
        bool = true
      }
    });
    return bool
  }

  function validateError() {

    if (validateCat(name) || name === '') {
      setNameError(true)
    } else {
      setNameError(false)
    }
    if (!validateCat(parent) && parent !== '') {
      setParentError(true)
    } else {
      setParentError(false)
    }
  }

  async function saveCategory(e) {
    e.preventDefault();
    if ((validateCat(name) || name === '') || !validateCat(parent)) return;
    const data = {name};

    if (validateCat(parent)) {
      data.parent = parent
    } else {
      data.parent = '';
    }

    await axios.post('/api/categories', data);
    console.log('work')
    setName('');
    updateCategories();
  }

  return (
    <div onClick={(ev) => {
      if (!ev.target.getAttribute('data-dropdown')) {
        setisVisibleDropdown(false)
      }
    }}> {/* Wrapper for handle Parent Category dropdown */}
      <Layout>
        <h1 className="flex items-center gap-4">
          <Back to={"/products/"}/>
          Categories
        </h1>
        <div className="flex gap-4 flex-wrap md:flex-nowrap">
          <div className="w-full md:w-1/2">
            <form onSubmit={saveCategory} className="flex flex-col items-end gap-2">
              <label className="w-full">
                <span className="mb-2 block">New category name</span>
                <input
                  className="mb-0 mr-0"
                  type="text"
                  placeholder="Category name"
                  onChange={ev => {
                    if (nameError) {
                      validateError()
                    }
                    setName(ev.target.value)
                  }}
                  value={name}
                />
                {(nameError && !!name.length) && (
                  <Error message={"This category already exist"}/>
                )}
                {(nameError && !name.length) && (
                  <Error message={"Please enter category name"}/>
                )}

              </label>
              <label className="w-full relative">
                <span className="mb-2 block">Parent Category</span>
                <div className="relative">
                  <input
                    className="mb-0 mr-0"
                    type="text"
                    placeholder="Parent Category"
                    data-dropdown
                    onChange={ev => {
                      setisVisibleDropdown(true)
                      if (parentError) {
                        validateError()
                      }
                      setParent(ev.target.value);
                      filterCategories(ev.target.value);
                    }}
                    value={parent}
                  />
                  <button 
                    className={classNames('dropdown-btn', {
                      open: isVisibleDropdown
                    })} 
                    data-dropdown
                    onClick={(e) => {
                    e.preventDefault();
                    setisVisibleDropdown(!isVisibleDropdown);
                  }}>
                    <svg data-dropdown xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                </div>
                {parentError && (
                  <Error message={"Please use existing category"}/>
                )}
                {isVisibleDropdown && !!filteredCategories.length && (
                  <ul data-dropdown className="absolute bottom-0 left-0 right-0 h-60 overflow-y-scroll translate-y-full bg-stone-200 rounded-md px-2 pt-2">
                    {filteredCategories.map(category => (
                      <li 
                        className="border-b pb-1 pt-1 last:border-none border-stone-300 cursor-pointer" 
                        key={category._id}
                        onClick={() => {
                          setParent(category.name);
                          setisVisibleDropdown(false)
                        }}
                      >{category.name}</li>
                    ))}
                  </ul>
                )}
              </label>
              <button 
                onFocus={() => setisVisibleDropdown(false)} 
                onClick={validateError}
                type="submit" 
                className="btn"
              >Save</button>
            </form>
          </div>
          <div className="w-full md:w-1/2">
            <table className="default mt-6">
              <thead>
                <tr>
                  <td>Category name</td>
                  <td>Actions</td>
                </tr>
              </thead>
              <tbody>
                {!categories.length && (
                  <tr>
                    <td colSpan={99}><Spinner/></td>
                  </tr>
                )}
                {categories.map(category => (
                  <tr key={category._id} className="table-row">
                    <td>{category.name}</td>
                    <td className="flex border-none ml-2 gap-4 border-stone-200 border-r">
                      <Link className="text-stone-700" href={`/products/edit/${category._id}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>
                      </Link>
                      <button onClick={() => openPopup(category._id)} className="text-stone-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </div>
    
  )
}