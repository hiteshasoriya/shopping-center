import React from 'react'
import { emailVerify } from '@/utils/actions';
import { toast } from '@/components/ui/use-toast';

const Verification = async ({ params }) => {
    console.log(params?.verificationId);
    const res = await emailVerify(params?.verificationId);
    // if (res?.error) {
    //     toast({ title: res.error });
    // }
    return (
        <div className='text-white grid place-content-center h-screen'>
            {res?.error || "Loading"}
        </div>
    )
}

export default Verification
