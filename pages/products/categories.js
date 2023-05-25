import Layout from "@/components/Layout";
import { useState } from "react";
import axios from "axios";
import Back from "@/components/Back";

export default function Categories() {

  const [name, setName] = useState('');
  async function saveCategory(e) {
    e.preventDefault();
    await axios.post('/api/categories', {name});
    setName('')
  }

  return (
    <Layout>
      <h1 className="flex items-center gap-4">
        <Back to={"/products/"}/>
        Categories
      </h1>
      <div className="flex gap-4 flex-wrap md:flex-nowrap">
        <div className="w-full md:w-1/2">
          <label>New category name</label>
          <form onSubmit={saveCategory} className="flex gap-2">
            <input
              className="mb-0 mr-0"
              type="text"
              placeholder="Category name"
              onChange={ev => setName(ev.target.value)}
              value={name}
            />
            <button type="submit" className="btn">Save</button>
          </form>
        </div>
        <div className="w-full md:w-1/2">
          Categories List
        </div>
      </div>
    </Layout>
  )
}