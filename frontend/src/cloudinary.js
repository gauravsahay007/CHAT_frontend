import React, { useState } from "react";
import { API } from "./backend";
function Cloudinary(){
const [file,setFile]=useState("");
const [image,setImage]=useState("");
//function for previewing files before uploading
//function used to enable it to show on frontend
function handleChange(event) {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      // Convert the file to Base64 encoding
      reader.readAsDataURL(file);
  
      reader.onloadend = function () {
        const base64Image = reader.result;
  
        // Call your API endpoint and pass the base64Image in the request body
        handleSubmit(base64Image);
      };
    }
  }
function handleSubmit(imageData) {
    console.log(imageData)
    // Make the API request with the imageData in the request body
   fetch(`${API}/cloudinary`, {
        mode:"no-cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:{ imageData},
    })
    
      .then((imageData) => {
        console.log(JSON.stringify({ image: imageData }));
        // Handle the response from the server
      })
      .catch((error) => {
        console.log(error);
        // Handle any errors
      });
  }
    return (
        <>
        <div>
            <form onSubmit={event=>handleSubmit(event)}>
                <label htmlFor="fileInput">Upload Your image</label>
                <input type="file" id="fileInput" onChange={event=>handleChange(event)} required 
                accept="image.png,image.jpeg,image.peg,image.jfif"
                />
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
        {/* //making it able to see on our online interface */}
        <img src={image} alt="" />
        </>
    )
}
export default Cloudinary