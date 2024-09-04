'use client'
import { EditorContent, useEditor} from '@tiptap/react';
import Starterkit from '@tiptap/starter-kit'
import PlaceHolder from '@tiptap/extension-placeholder';
import UserAvatar from '@/components/UserAvatar';
import { useSession } from '@/app/(main)/SessionProvider';
import './style.css'
import useSubmitPostMuataion from './mutaions';
import LoadingButton from '@/components/LoadingButton';

export default function PostEditor(){
const{user} = useSession();
const mutation = useSubmitPostMuataion();

    const editor = useEditor({
    immediatelyRender:false,
      extensions:[
        Starterkit.configure({
            italic:false,
            bold:false
        }),

        PlaceHolder.configure({
            placeholder:"what's crack-a-lackin'?"
        }),

      ]
    });

    const input = editor?.getText({
        blockSeparator:'\n'
    }) || '';

    function onSubmit(){
        mutation.mutate(input,{
            onSuccess:() =>{
                editor?.commands.clearContent();
            },
        }); 
    };

    return(
        <div className='flex flex-col gap-5 p-5 rounded-2xl bg-card shadow-sm'>
            <div className='flex gap-5'>
                <UserAvatar avatarUrl={user.avatarUrl} className='hidden sm:inline' />
               <EditorContent 
               editor={editor}
               className='max-h-[20rem] overflow-y-auto  w-full rounded-2xl bg-background px-5 py-3 '
               />
            </div>
            <div className='flex justify-end'>
                <LoadingButton
                onClick={onSubmit}
                loading={mutation.isPending}
                disabled={!input.trim()}
                className='min-w-20'
                >
                    Post
                </LoadingButton>
            </div>
        </div>
    )
}