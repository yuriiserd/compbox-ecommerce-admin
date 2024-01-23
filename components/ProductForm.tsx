import { Editor } from "@tinymce/tinymce-react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import Dropdown from "./Dropdown";
import DropdownProperties from "./DropdownProperties";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { useSession } from "next-auth/react";
import { ErrorContext } from "./ErrorContext";
import useAdminRole from "../hooks/useAdminRole";
import { Product } from "../types/product";

type Property = {
  _id: string;
  name: string;
  values: string[];
}


export default function ProductForm({
  _id,
  title: existingTitle, 
  category: existingCategory,
  description: existingDescription,
  content: existingContent,
  price: existingPrice,
  salePrice: existingSalePrice,
  images: existingImages,
  properties: existingProperties
}: Product) {

  const [title, setTitle] = useState(existingTitle || '');
  const [category, setCategory] = useState(existingCategory || null);
  const [description, setDescription] = useState(existingDescription || '');
  const [content, setContent] = useState(existingContent || '');
  const [price, setPrice] = useState(existingPrice || '');
  const [salePrice, setSalePrice] = useState(existingSalePrice || '');
  const [productProperties, setProductProperties] = useState(existingProperties || []);

  const [propertiesToShow, setPropertiesToShow] = useState([]);

  const [images, setImages] = useState(existingImages || []);
  
  const [categories, setCategories] = useState([]);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const {data: session} = useSession();
  const {setErrorMessage, setShowError} = useContext(ErrorContext);

  useEffect(() => {
    axios.get('/api/categories').then(res => {
      setCategories(res.data);
    });
    if (typeof(category) !== "string") {
      if (category?._id) {
        getPropertiesToShow()
      }
    }
  }, [category]);

  async function saveProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const role = await useAdminRole(session?.user?.email);
    if (role !== 'Admin') {
      setErrorMessage('You are not authorized to create or save product. Please contact an admin');
      setShowError(true);
      return;
    }

    const data = {title, category, description, content, price, salePrice, images, properties: productProperties};
    if (_id) {
      await axios.put('/api/products', {...data, _id});
    } else {
      await axios.post('/api/products', data);
    }
    setGoToProducts(true);
  }

  if(goToProducts) {
    router.push('/products');
  }

  const editorRef = useRef(null);

  async function uploadImages(e) {

    const role = await useAdminRole(session?.user?.email);
    if (role !== 'Admin') {
      setErrorMessage('You are not authorized to upload images. Please contact an admin');
      setShowError(true);
      return;
    }

    const files = e.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);
      setImages(oldImages => {
        return [...oldImages, ...res.data.links]
      });
      setIsUploading(false);
    }
  }

  function updateImagesOrder(newImages : string[]) {
    newImages = newImages.map(image => image.toString());
    setImages(newImages);
  }

  async function deleteImage(deleteLink: string) {

    const deleteKey = deleteLink.split('/').pop();
    // TODO delete image from s3 bucked
    
    await axios.delete('/api/delete?key=' + deleteKey);

    setImages(oldImages => {
      const newImages = [];
      oldImages.forEach(link => {
        if (link !== deleteLink) {
          newImages.push(link)
        }
      })
      return newImages;
    })
  }

  async function getPropertiesToShow() {
    // Clear the existing properties to show
    setPropertiesToShow([]);

    let haveParent = true;
    let categoryCheck = category;
    console.log(categoryCheck)
    // If the category is a string, return early
    if (typeof(categoryCheck) === "string") return
    // If the category has a parent, get the parent and add the properties to the properties to show
    while (haveParent) {
      if (categoryCheck.parent) {
        const id = typeof(categoryCheck.parent) === "string" ? categoryCheck.parent : categoryCheck.parent._id;
        await axios.get('/api/categories?id=' + id).then(res => {
          setPropertiesToShow(old => {
            return [...res.data.properties, ...old]
          });
          categoryCheck = res.data;
        })
      } else {
        haveParent = false;
      }
    }

    setPropertiesToShow(old => {
      if (typeof(category) === "string") return old;
      return [...old, ...category?.properties]
    });

  }
  const properties = propertiesToShow.map((property: Property, index) => {
    let initialValue = '';
    Object.keys(productProperties).forEach(key => {
      if (key === property.name) {
        initialValue = productProperties[key];
      }
    })

    const propertyName = property.name;
    
    return (
      <label key={index} className="w-full relative flex">
        <span className="ml-4 mb-2 block w-1/2">- {propertyName}</span>
        <div className="relative w-1/2">
          <DropdownProperties 
            items={property.values.sort()} 
            initialItem={initialValue}
            selectedItem={(item: string) => setProductProperties(old => {
              return {...old, [propertyName]: item}
            })}
            className="w-full"
          />
        </div>
      </label>
    )
  })
  
  return (
    <>
      <form className="form" onSubmit={(e) => saveProduct(e)}>
        <div>
          <label>Product Name</label>
          <input 
            type="text" 
            placeholder="Product Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />
          <label className="mb-4 w-full relative">
            <span className="mb-2 block">Category</span>
            {typeof(category) !== "string" && (
              <Dropdown 
                items={categories} 
                initialItem={category?.name ? category.name : {name : 'Select Category'}}
                selectedItem={setCategory}/>
            )}
          </label>
          {!!propertiesToShow.length && (
            <span className="mb-2 block">Properties</span>
          )}
          {properties}
          <label>Description</label>
          <textarea  
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
          <label>Content</label>
          <div className="mb-4">
            <Editor
              apiKey="ivtbutcg9s0rhvxlmveqt2ybncqhfkd9wap0gme93w5uz395"
              onChange={() => setContent(editorRef.current.getContent())}
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue={content}
              init={{
                height: 500,
                menubar: true,
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </div>
          
          <label>Price</label>
          <input 
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            />
          <label>Sale Price</label>
          <input 
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(parseFloat(e.target.value))}
            />
          <button type="submit" className="btn ">{_id ? 'Save' : 'Add Product'}</button>
        </div>
        <div className="images">
          <label>Images</label>
          <div className="flex flex-wrap gap-2">
            {!!images?.length && (
              <ReactSortable
                className="flex flex-wrap gap-2"
                animation={200}
                list={images.map((image, index) => ({id: index, image}))}
                setList={newList => updateImagesOrder(newList.map(item => item.image))}
              >
                {images.map(link => (
                  <div key={link} className="image-preview">
                    <Image src={link} className="rounded-lg object-cover h-24 w-24 hover:cursor-grab hover:object-contain" width={96} height={96} alt={`image`}/>
                    <div className="delete" onClick={() => deleteImage(link)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                ))}
                
              </ReactSortable>
            )}
            {isUploading && (
              <Spinner/>
            )}
            <label className="upload">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <input type="file" onChange={uploadImages} className="hidden"></input>
            </label>
          </div>
        </div>
      </form>
    </>
  )
}