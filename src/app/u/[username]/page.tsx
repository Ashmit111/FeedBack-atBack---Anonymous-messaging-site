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

const usermessage = () => {
  const params = useParams<{ username: string }>();
  const [messagestatus, setMessagestatus] = useState<boolean>(false);
  const username = params.username;
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast(); 

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  })

  const fetchAcceptMessages = async () =>{
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      console.log(response.data)
      const status = response.data.isAcceptingMessages;
      console.log(status)
      setMessagestatus(status ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
          axiosError.response?.data.message ??
          'Failed to fetch message status',
          variant: 'destructive',
        });
    }
  }
 
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    console.log(messagestatus)
    try {
      if (messagestatus) {
        console.log(messagestatus)
        const response = await axios.post<ApiResponse>('/api/send-message',{
          ...data,
          username
        });
        toast({
          title: response.data.message,
          variant: 'default',
        });
        form.reset({ ...form.getValues(), content: '' });
      }
      else{
        toast({
          title: 'Error',
          description: 'User is not accepting message',
          variant: 'destructive',
        });
      }
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
  useEffect(() => {
    fetchAcceptMessages();
  }, [])
  

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
    </div>
  )
}

export default usermessage
