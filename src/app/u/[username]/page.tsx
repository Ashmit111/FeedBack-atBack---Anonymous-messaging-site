'use client';

import React, {useState, useEffect} from 'react';
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
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const usermessage = () => {
  const params = useParams<{ username: string }>(); 
  const username = params.username;
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast(); 

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  }) 

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true); 
    try { 
        const response = await axios.post<ApiResponse>('/api/send-message',{
          ...data,
          username
        });
        toast({
          title: response.data.message,
          variant: 'default',
        });
        form.reset({ ...form.getValues(), content: '' }); 
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    const response = await axios.post('/api/suggest-messages')
    console.log(response.data.response)
    const result = response.data.response;
    setSuggestions(result.split('||')); 
    setLoading(false);
  }

  const handleCopyToTextarea = async (text: string) => {
    form.setValue('content', text); 
  } 

  const messageContent = form.watch('content');
  return (
     <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    id='text-area'
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>
      <Button className='mt-9' onClick={fetchSuggestions}>Suggest Messages</Button>
      <p className='text-black font-semibold text-xl text-center my-5'>Click on any message below to select it.</p>      
      <Card>
      <CardHeader>
        <h3 className="text-xl font-semibold">Messages</h3>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        {loading ? ( 
            <div className='flex justify-center'>
              <Loader2 className="mr-2 h-10 w-10 animate-spin" />
            </div> 
        ) : (
          suggestions.map((suggestion, index) => (
            <Button key={index} variant="outline" className="mb-2" onClick={() => handleCopyToTextarea(suggestion)}>
              {suggestion}
            </Button>
          ))
        )}
      </CardContent> 
    </Card>     
      <Separator className='mt-5' /> 
      <div className='flex flex-col justify-center items-center'>
        <h2 className='font-bold mt-4'>Get you Message Board</h2>
        <Link href="/sign-up">
          <Button className='mt-3'>Create Your Account</Button>
        </Link>
        </div>
    </div>
  )
}

export default usermessage
