'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";
import { useForm } from 'react-hook-form';
import { messageSchema } from '@/schemas/messageSchema';


const usermessage = () => {
  const onSubmit = async (data:any) => {

  }
  const form = useForm
  return (
    <div className='bg-white w-full my-8 mx-4 p-6'>
      <div className='flex flex-col justify-center items-center'>
        <div className='p-3'>
          <h1 className='text-black text-4xl font-bold'>Public Profile Link</h1>
        </div>
         <Form>
            <form onSubmit={onSubmit} className="space-y-6">

            </form>
         </Form>
      </div>
    </div>
  )
}

export default usermessage
