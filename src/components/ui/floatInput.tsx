import * as React from 'react';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startContent?:React.ReactNode;
  endContent?:React.ReactNode;
}

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className,startContent,endContent,...props }, ref) => {
    return (
      <>
      <p className="pointer-events-none absolute top-1/2 transform -translate-y-1/2 left-2 ">
     <span className=''> {startContent}</span>
      </p>
      <p className="pointer-events-none absolute w-full top-1/2 transform -translate-y-1/2 flex items-center justify-end p-2 ">
     <span className=''> {endContent}</span>
      </p>
      <Input placeholder=" " className={cn(`peer ${startContent && 'pl-7 '}`, className)} ref={ref} {...props} />
      </>
    );
  },
);
FloatingInput.displayName = 'FloatingInput';

const FloatingLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      className={cn(
        'peer-focus:secondary peer-focus:dark:secondary absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-background px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-[50%] peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-1 peer-focus:-translate-y-4 peer-focus:scale-90 peer-focus:px-2 dark:bg-background rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
FloatingLabel.displayName = 'FloatingLabel';

type FloatingLabelInputProps = InputProps & { label?: string };

const FloatingLabelInput = React.forwardRef<
  React.ElementRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, ...props }, ref) => {
  return (
    <div className="relative">
      <FloatingInput ref={ref} id={id} {...props} />
      <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
    </div>
  );
});
FloatingLabelInput.displayName = 'FloatingLabelInput';

export { FloatingInput, FloatingLabel, FloatingLabelInput };
