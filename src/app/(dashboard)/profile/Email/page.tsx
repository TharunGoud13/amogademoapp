"use client"
import EmailDetails from '@/components/profile/emailDetails'
import SaveEmailDetails from '@/components/profile/saveEmailDetails'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import React, { useState } from 'react'

const Email = () => {
    const [isPopoverOpen,setIsPopoverOpen] = useState(false)
    return (
        <div className='h-full flex gap-2.5 justify-between w-full'>
            <div className='w-full'>
                <EmailDetails/>
            </div>
            <div>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button className='w-[150px]'>Add</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 fixed right-[5%]  md:right-[10px] md:top-[10px]">
                    <SaveEmailDetails setIsPopoverOpen={setIsPopoverOpen}/>
                </PopoverContent>
            </Popover>
            </div>
        </div>
    );
}

export default Email