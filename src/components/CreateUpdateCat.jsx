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

import FormInput from './Forminput'
import { UploadButton } from '@/lib/uploadthing'
import { toast } from './ui/use-toast'
import { CreateCategory } from '@/services/categories'

export function CreateUpdateCat({ children, category }) {
    const [image, setImage] = useState("");

    useEffect(()=>{
        if(category?.image) setImage(category?.image)
    },[])

    const handelSubmit = async (formData) => {
        const result = await CreateCategory(formData, image, category?.id);
        if (result?.Result) {
            toast({ title: "Category created successfully" });
          } else {
            toast({ title: result.error })
        }
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
            <Button variant="outline">{children}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{children}</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when yore done.
                    </DialogDescription>
                </DialogHeader>

                <form action={handelSubmit}>
                    <div className='grid gap-4 py-4'>
                        <FormInput
                            id="name"
                            label="Name"
                            placeholder="Full name"
                            type="text"
                            defaultValue={category?.name || ""}
                            className="h-10"
                        />
                        {!image ?
                            <UploadButton
                                endpoint="imageUploader"
                                appearance={{
                                    button:
                                        "ut-uploading:cursor-not-allowed bg-slate-600 w-full text-sm after:bg-orange-400 max-w-[700px]",
                                    allowedContent: "hidden",
                                }}
                                onClientUploadComplete={(res) => {
                                    setImage(res[0].url);
                                }}
                                onUploadError={(error) => {
                                    alert(`ERROR ${error.message}`);
                                }}
                            /> :
                            (<div className='flex flex-center gap-2'>
                                <img src={image} className='h-16 w-16' alt="" />
                            </div>)
                        }
                    </div>
                    <DialogFooter>
                    <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>

        </Dialog>
    )
}


export default CreateUpdateCat