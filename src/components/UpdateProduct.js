import react, { useEffect } from "react"
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


const UpdateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categary, setCategary] = useState("");
  const [company, setCompany] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  useEffect(()=>{
    getDetails();
  },[])

  const getDetails = async()=>{
    const result = await fetch(`http://localhost:4000/product/${params.id}`);
    const fresult = await result.json();
    console.log(fresult);
    setName(fresult.name)
    setPrice(fresult.price)
    setCategary(fresult.categary)
    setCompany(fresult.company)
  }

  const update = async ()=>{
    const dresult = await fetch(`http://localhost:4000/product/${params.id}`,{
        method:"Put",
        body:JSON.stringify({name, price, categary, company}),
        headers:{
            'Content-Type': 'application/json'
        }
    });
    const fdresult = await dresult.json();
    if(fdresult){
        alert("product updated succesfully")
        navigate("/product");
    }
}
    return(
          <div className="input_type">
          <h3>Update Product </h3>
            <input type="text" placeholder="Enter product Name" className="text-style" 
              value={name} onChange={(e)=>{setName(e.target.value)}} />
            <input type="number" placeholder="Enter product price" className="text-style" 
              value={price} onChange={(e)=>{setPrice(e.target.value)}} />
            <input type="text" placeholder="Enter product Categary" className="text-style" 
              value={categary} onChange={(e)=>{setCategary(e.target.value)}} />
            <input type="text" placeholder="Enter product Company" className="text-style" 
              value={company} onChange={(e)=>{setCompany(e.target.value)}}  />
            <button className="text-style" onClick={update} type="submit">Update Product</button>
          </div>  
    )
}
export default UpdateProduct;