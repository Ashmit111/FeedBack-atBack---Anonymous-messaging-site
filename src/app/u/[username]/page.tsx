'use client';

import React, {useState} from 'react';
import { useParams } from 'next/navigation';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";
import { useForm } from 'react-hook-form';
import { messageSchema } from '@/schemas/messageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';


const usermessage = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data:any) => {

  }
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  })

  const messageContent = form.watch('content');
  return (
    <div className='bg-white w-full my-8 mx-4 p-6'>
      <div className='flex flex-col justify-center items-center'>
        <div className='p-3'>
          <h1 className='text-black text-4xl font-bold'>Public Profile Link</h1>
        </div>
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
              control={form.control}
              name='content'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                  <FormControl>
                    <Textarea
                    placeholder='Write your anonymous message here'
                    className="resize-none w-max"
                    {...field}
                    />
                  </FormControl>
                  <FormMessage /> 
                </FormItem>
              )}
              />
              <div>
                {isLoading ?(
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    Please Wait
                  </Button>
                ):(
                  <Button type="submit" disabled={isLoading || !messageContent}>
                    Send Message
                  </Button>
                )}
              </div>
            </form>
         </Form>
      </div>
    </div>
  )
}

export default usermessage
