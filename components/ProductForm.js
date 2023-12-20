import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import Dropdown from "./Dropdown";
import DropdownProperties from "./DropdownProperties";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";


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
}) {

  const [title, setTitle] = useState(existingTitle || '');
  const [category, setCategory] = useState(existingCategory || {name: ''});
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

  useEffect(() => {
    axios.get('/api/categories').then(res => {
      setCategories(res.data);
    });
    if (category.name.length > 0) {
      getPropertiesToShow()
    }
  }, [category]);

  async function saveProduct(e) {
    e.preventDefault();
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

  function updateImagesOrder(images) {
    images = images.map(image => image.toString());
    setImages(images);
  }

  async function deleteImage(deleteLink) {

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

    setPropertiesToShow([]);

    let haveParent = true;
    let categoryCheck = category;
    while (haveParent) {
      if (categoryCheck.parent) {
        const id = typeof(categoryCheck.parent) === "string" ? categoryCheck.parent : categoryCheck.parent._id;
        await axios.get('/api/categories?id=' + id).then(res => {
          setPropertiesToShow(old => {
            return [...old, ...res.data.properties]
          });
          categoryCheck = res.data;
        })
      } else {
        haveParent = false;
      }
    }

    setPropertiesToShow(old => {
      return [...old, ...category.properties].filter((a,b) => {
        return a._id !== b._id
      })
    });

  }
  const properties = propertiesToShow.map((property, index) => {
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
            selectedItem={(item) => setProductProperties(old => {
              return {...old, [propertyName]: item}
            })}
            className="w-full"
          />
        </div>
      </label>
    )
  })

  console.log(productProperties)
  
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
            
            <Dropdown 
              items={categories} 
              initialItem={category.name || {name : 'Select Category'}}
              selectedItem={setCategory}/>
          </label>
          {!!propertiesToShow.length && (
            <span className="mb-2 block">Properties</span>
          )}
          {properties}
          <label>Description</label>
          <textarea 
            type="text" 
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
                list={images}
                setList={updateImagesOrder}
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