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
  const [parent, setParent] = useState({});

  const [nameError, setNameError] = useState(false);
  const [noItemsFound, setNoItemsFound] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState('');

  const openPopup = useSelector(selectOpenPopupDelete);
  const dispatch = useDispatch();

  const categoryFormRef = useRef(null);

  useEffect(() => {
    updateCategories();
  }, [openPopup, noItemsFound])

  function updateCategories() {
    axios.get('/api/categories').then(res => {
      setCategories(res.data);
      if (res.data.length === 0) {
        setNoItemsFound(true)
      } else {
        setNoItemsFound(false)
      }
    })
  }

  function validateCat(target) {
    let bool = true;
    categories.forEach(cat => {
      if (cat.name !== target) {
        bool = false
      }
    });
    return bool
  }

  function validateError() {

    validateCat(name) || name === '' ? setNameError(true) : setNameError(false);
  
  }

  function editCategory(category) {
    categoryFormRef.current.scrollIntoView();
    setName(category.name);
    setParent(category.parent || {});
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

  function cancelEdit() {
    setName('');
    setParent('');
    setProperties([]);
    setIsEditing(false);
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
    if (validateCat(name) && !validateCat(parent.name)) return;
    if (name === '') return;
    const data = {name, parent: {}, properties: []};

    // if (validateCat(parent.name)) {
    //   data.parent = parent?._id;
    // }

    data.parent = parent?._id;

    if (properties.length > 0) {
      const trimedProperties = properties;
      trimedProperties.forEach(property => {
        property.values = property.values.map(value => value.trimStart().trimEnd())
      });
      data.properties = trimedProperties;
    }

    if (isEditing) {
      await axios.put('/api/categories', {...data, _id: editItem});
    } else {
      await axios.post('/api/categories', data);
    }

    setName('');
    setParent({});
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
              {false && (
                <Error message={"This category already exist"}/>
              )}
              {false && (
                <Error message={"Please enter category name"}/>
              )}

            </label>
            <label className="w-full relative">
              <span className="mb-2 block">Parent Category</span>

              <Dropdown 
                items={categories} 
                initialItem={parent}
                selectedItem={setParent}/>
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
            <div className="flex gap-2">
              <button  
                type="submit" 
                className="btn"
              >Save</button>
              {isEditing && (
                <button  
                  type="button" 
                  onClick={cancelEdit}
                  className="btn btn_red"
                >Cancel</button>
              )}
            </div>
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
              {!categories.length && !noItemsFound && (
                <tr>
                  <td colSpan={99}><Spinner/></td>
                </tr>
              )}
              {noItemsFound && (
                <tr>
                  <td className="text-center p-4" colSpan={99}>No categories found</td>
                </tr>
              )}
              {categories.map(category => (
                <tr key={category._id} className="table-row">
                  <td>{category.name}</td>
                  <td>{category.parent?.name}</td>
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