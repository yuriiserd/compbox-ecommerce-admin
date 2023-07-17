import Layout from "@/components/Layout";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Back from "@/components/Back";
import Spinner from "@/components/Spinner";
import Error from "@/components/Error";
import DeletePopup from "@/components/DeletePopup";
import Dropdown from "@/components/Dropdown";
import { openDelete, setDeleteItem, selectOpenPopupDelete } from "@/slices/deleteSlice";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@/components/icons/DeleteIcon";
import EditIcon from "@/components/icons/EditIcon";

export default function Categories() {

  const [name, setName] = useState('');
  const [parent, setParent] = useState('');

  const [nameError, setNameError] = useState(false);
  const [parentError, setParentError] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState('');

  const openPopup = useSelector(selectOpenPopupDelete);
  const dispatch = useDispatch();

  const categoryFormRef = useRef(null);

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

  function editCategory(category) {
    categoryFormRef.current.scrollIntoView();
    setName(category.name);
    setParent(category.parent || '');
    setProperties(category.properties || []);
    setIsEditing(true);
    setEditItem(category._id);
  }

  function addProperty() {
    setProperties((old) => {
      return [...old, {name: '', values: []}]
    })
  }

  function deleteProperty(index) {
    setProperties((old) => {
      const newProperties = [...old];
      return newProperties.filter((property, propertyIndex) => propertyIndex !== index)
    })
  }

  function addPropertyName(name, index) {
    setProperties((old) => {
      const newProperties = [...old];
      newProperties[index].name = name;
      return newProperties
    })
  }

  function addPropertyValues(values, index) {
    setProperties((old) => {
      const newProperties = [...old];
      newProperties[index].values = values.split(',');
      return newProperties
    })
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

    if (properties.length > 0) {
      setProperties((old) => {
        const newProperties = [...old];
        // return newProperties.map(property => property.values.map(value => value.trimStart().trimEnd())); // remove spaces from start/end for each value
        return newProperties
      })
      
      data.properties = properties;
    }

    if (isEditing) {
      await axios.put('/api/categories', {...data, _id: editItem});
    } else {
      await axios.post('/api/categories', data);
    }

    setName('');
    setParent('');
    setProperties([])
    updateCategories();
    setIsEditing(false);
  }

  return (
    <Layout>
      <h1 
        ref={categoryFormRef} 
        className="flex items-center gap-4"
      >
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
                initialItem={parent}
                selectedItem={setParent}/>
              
              {!!(parentError && parent?.length) && (
                <Error message={"Please use existing category"}/>
              )}
            </label>
            <div className="w-full relative flex flex-wrap justify-between">
              <span className="mb-2">Properties</span>

              <button
                className="mb-2 mr-0 btn btn_white"
                type="button"
                onClick={addProperty}
              >Add property</button>

              {!!properties.length && properties.map((property, index) => (
                <div key={index} className="flex flex-wrap sm:flex-nowrap mt-2 gap-2 mb-2 items-center w-full">
                  <input 
                    className="w-full block mr-0 mb-0"
                    placeholder="Name"
                    onChange={(event) => addPropertyName(event.target.value, index)}
                    value={property.name}                
                  />
                  <input 
                    className="w-full block mr-0 mb-0"
                    placeholder="Values (coma separated)"
                    onChange={(event) => addPropertyValues(event.target.value, index)}  
                    value={property.values.join(',')}              
                  />
                  <button 
                    onClick={() => deleteProperty(index)}
                  >
                    <DeleteIcon/>
                  </button>
                </div>
              ))}
              
            </div>
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
                    <button title="edit" onClick={() => editCategory(category)} className="text-stone-700">
                      <EditIcon/>
                    </button>
                    <button title="delete" onClick={() => {
                      dispatch(setDeleteItem(category._id));
                      dispatch(openDelete());
                    }} className="text-stone-700">
                      <DeleteIcon/>
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