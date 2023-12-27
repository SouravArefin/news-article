


"use client"

import { TCategory, TPost } from '@/app/types/type'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from "react-hot-toast";



export default function EditForm({ post }: { post: TPost }) {

    const [links, setLinks] = useState<string[]>([])
    const [linkInput, setLinkInput] = useState("")
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categories, setCategories] = useState<TCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [publicId, setPublicId] = useState("");
console.log(selectedCategory,"selectedCategory");
    const router = useRouter();

console.log(  fetch(`${process.env.NEXTAUTH_URL}/api/categories`));

  
  
    useEffect(() => {
      const fetchAllCategories = async () => {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/categories`);
        const categoryNames = await res.json();
        setCategories(categoryNames);
        console.log(categoryNames,"categoryNames");
      };
  console.log(categories,"categories");
      fetchAllCategories();


      const initValues = () => {
        setTitle(post.title);
        setContent(post.content);
        setImageUrl(post.imageUrl || "");
        setPublicId(post.publicId || "");
        setSelectedCategory(post.categoryName || "");
        setLinks(post.links || []);
      };

      initValues();
    }, [
      post.title,
      post.content,
      post.imageUrl,
      post.publicId,
      post.categoryName,
      post.links,]);

  
    const addLink = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (linkInput.trim() !== "") {
            setLinks((prev) => [...prev, linkInput])
            setLinkInput("")
        }
    }

const deleteLink =(index:number)=>{
    setLinks((prev)=>prev.filter((_,i)=> i !== index))
}





const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      const errorMessage = "Title and content are required";
      toast.error(errorMessage);
      return;
    }

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          links,
          selectedCategory,
          imageUrl,
          publicId,
        }),
      });

      if (res.ok) {
        toast.success("Post edited successfully");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Something went wrong.Please check");
      }
    } catch (error) {
      console.log(error);
    }
  };


    
    return (
        <div>
            <h2>Edit The Post</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">

       <input 
      onChange={(e) => setTitle(e.target.value)}
  type = "text" placeholder = "title"
    
  value={title}
    />
         <textarea
    onChange={(e) => setContent(e.target.value)}
    className="" placeholder = "content" 
    value={content}
      > </textarea>

                {
                    links && links.map((link, i) =>
                        <div
                            className ="flex items-center gap-4"
                            key={i}>
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                                </svg>

                            </span>
                            <Link className="link" href={link}>{link}</Link>
                            <span
                            
                            onClick = {()=>deleteLink(i)}
                                className="cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                            </span>
                           
                        </div>
                    )
                }
                <div className="flex gap-2">
                    <input
                        onChange={e => setLinkInput(e.target.value)}
                        value={linkInput}
                        className="flex-1" type="text" placeholder=" Paste the link and click on Add" />
                    <button
                        onClick={addLink}
                        className="btn">

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </button>
                </div>

                <select
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-3 rounded-md border appearance-none"
                value={selectedCategory}
              >
                <option value="">Select A Category</option>
                {categories &&
                  categories.map((category) => (
                    <option key={category.id} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
              </select>

                <button className="primary-btn">Update</button>

             
                  </form>
                  {selectedCategory}
        </div>
    )
}
