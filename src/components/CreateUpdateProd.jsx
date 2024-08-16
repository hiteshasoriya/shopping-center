"use client"
import React, { useEffect, useState } from 'react'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useForm } from 'react-hook-form'
import FormInput from './Forminput'
import SelectForm from './SelectForm'
import { Form } from './ui/form'
import { getCategories } from '@/services/categories'
import { UploadDropzone } from '@/lib/uploadthing'
import { addUpdatePost } from '@/services/posts'
import { toast } from './ui/use-toast'

export function CreateUpdateProd({ children, product }) {
  const form = useForm();
  const [getCat, setCat] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if(product?.images) setImages(product.images)
    categories();
  }, []);

  const categories = async () => {
    const res = await getCategories();
    setCat(res.result)
   }

  const handelSubmit = async (formData) => {
    const categoryId = form.getValues().categoryId || product.categoryId;
    const res = await addUpdatePost(formData, images, categoryId,product?.id );
    
    if (res.result) {
      toast({
        title: "product successfully created",
      });
    } else {
      toast({
        title: "product not created",
      });
    }
  };


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">New Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{children}</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when yore done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={handelSubmit}>
            <div className='grid gap-4 py-3'>
              <FormInput
                id="name"
                label="Name"
                placeholder="Full name"
                type="text"
                defaultValue={product?.name || ""}
                className="h-10"
              />
              <FormInput
                id="description"
                label="Description"
                placeholder="Add Description"
                type="text"
                defaultValue={product?.description || "Description"}
                className="h-10"
              />
              <FormInput
                id="price"
                label="Price"
                placeholder="Enter price"
                type="text"
                defaultValue={product?.price || "price"}
                className="h-10"
              />
              <SelectForm
                id="categoryId"
                label="Select Category"
                placeholder="Select Category"
                list={getCat}
                defaultValue=""
                control={form.control}
              />
              {!images?.length?
                            <UploadDropzone
                                endpoint="imageUploader"
                                appearance={{
                                    button:
                                        "ut-uploading:cursor-not-allowed bg-slate-600 w-full text-sm after:bg-orange-400 max-w-[700px]",
                                    allowedContent: "hidden",
                                }}
                                onClientUploadComplete={(res) => {
                                    setImages(res);
                                }}
                                onUploadError={(error) => {
                                    alert(`ERROR ${error.message}`);
                                }}
                            /> :
                            (<div className='flex flex-center gap-2'>
                              {
                                images.map((img, index)=>{
                                  <div>
                                    <img src={img?.url || img } className='h-16 w-16' alt="" />
                                  </div>
                                })
                              }
                            </div>)
                        }
            </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}


export default CreateUpdateProd