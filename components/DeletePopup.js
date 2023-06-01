export default async function DeletePopup() {

  

  async function openPopup(id) {
    await axios.get('/api/products?id='+id).then(res => {
      setCurrentProduct(res.data);
    })
    setPopup(true);
  }

  async function deleteProduct(id) {
    await axios.delete('/api/products?id='+id).then(() => {
      setPopup(false);
    });
  }

  return (
    <div className={classNames('popup',{
      open: popup
    })}>
      <div className="popup__content"> 
        <p>Do you whant to delete<br/> "{currentProduct?.title}"?</p>
        <div className="flex gap-4 justify-center mt-4">
          <button className="btn btn_red" onClick={() => deleteProduct(currentProduct?._id)}>Yes</button>
          <button className="btn" onClick={() => setPopup(false)}>No</button>
        </div>
      </div>
    </div>
  )
}