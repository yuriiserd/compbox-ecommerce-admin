import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Back from "@/components/Back";
import Spinner from "@/components/Spinner";
import Error from "@/components/Error";
import DeletePopup from "@/components/DeletePopup";
import Dropdown from "@/components/Dropdown";
import { openDelete, setDeleteItem, selectOpenPopupDelete } from "@/slices/deleteSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Categories() {

  const [name, setName] = useState('');
  const [parent, setParent] = useState('');

  const [nameError, setNameError] = useState(false);
  const [parentError, setParentError] = useState(false);
  
  const [categories, setCategories] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState('');

  const openPopup = useSelector(selectOpenPopupDelete);
  const dispatch = useDispatch();

  useEffect(() => {
    updateCategories();
  }, [openPopup])

  function updateCategories() {
    axios.get('/api/categories').then(res => {
      setCategories(res.data);
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

    validateCat(name) || name === '' ? setNameError(true) : setNameError(false);

    !validateCat(parent) && parent !== '' ? setParentError(true) : setParentError(false)
  
  }

  async function saveCategory() {
    if (validateCat(name) && !validateCat(parent)) return;
    if (name === '') return;
    const data = {name};

    if (validateCat(parent)) {
      data.parent = parent
    } else {
      data.parent = '';
    }

    if (isEditing) {
      await axios.put('/api/categories', {...data, _id: editItem});
    } else {
      await axios.post('/api/categories', data);
    }

    setName('');
    setParent('');
    updateCategories();
    setIsEditing(false);
  }

  return (
    <Layout>
      <h1 className="flex items-center gap-4">
        <Back to={"/products/"}/>
        Categories
      </h1>
      <div className="flex gap-4 flex-wrap md:flex-nowrap">
        <div className="w-full md:w-1/2">
          <form onSubmit={(e) => {
            e.preventDefault();
            validateError();
            saveCategory();
          }} className="flex flex-col items-end gap-2">
            <label className="w-full">
              <span className="mb-2 block">
                {
                  isEditing ? 
                  'Edit Category "' + name + '"' :
                  'New Category Name'
                }
              </span>
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
              {(nameError && !!name.length && isEditing) && (
                <Error message={"This category already exist"}/>
              )}
              {(nameError && !name.length) && (
                <Error message={"Please enter category name"}/>
              )}

            </label>
            <label className="w-full relative">
              <span className="mb-2 block">Parent Category</span>

              <Dropdown 
                items={categories} 
                selectedItem={setParent}/>
              
              {!!(parentError && parent?.length) && (
                <Error message={"Please use existing category"}/>
              )}
            </label>
            <button  
              type="submit" 
              className="btn"
            >Save</button>
          </form>
        </div>
        <div className="w-full md:w-1/2">
          <table className="default mt-6">
            <thead>
              <tr>
                <td>Category Name</td>
                <td>Parent Category</td>
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
                  <td>{category.parent}</td>
                  <td className="flex border-none ml-2 gap-4 border-stone-200 border-r">
                    <button title="edit" onClick={() => {
                      setName(category.name);
                      setParent(category.parent);
                      setIsEditing(true);
                      setEditItem(category._id);
                    }} className="text-stone-700">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    <button title="delete" onClick={() => {
                      dispatch(setDeleteItem(category._id));
                      dispatch(openDelete());
                    }} className="text-stone-700">
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
      <DeletePopup collection={'categories'}/>
    </Layout>
  )
}