import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function ProductForm({
  _id,
  title: existingTitle, 
  description: existingDescription,
  price: existingPrice,
  images
}) {

  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [price, setPrice] = useState(existingPrice || '');

  const [goToProducts, setGoToProducts] = useState(false);

  const router = useRouter()

  async function saveProduct(e) {
    e.preventDefault();
    const data = {title, description, price};
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

  function uploadImages(e) {
    console.log(e);
  }
  
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
          <label>Description</label>
          <div className="mb-4">
            <Editor
              apiKey="ivtbutcg9s0rhvxlmveqt2ybncqhfkd9wap0gme93w5uz395"
              onChange={() => setDescription(editorRef.current.getContent())}
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue={description}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist autolink lists link image charmap print preview anchor',
                  'searchreplace visualblocks code fullscreen',
                  'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
              }}
            />
          </div>
          
          <label>Price</label>
          <input 
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            />
          <button type="submit" className="btn self-end">{_id ? 'Save' : 'Add Product'}</button>
        </div>
        <div>
          <label>Images</label>
          <div>
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