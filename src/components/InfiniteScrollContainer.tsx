import { useInView } from 'react-intersection-observer'

interface InfiniteScrollConatinerProps extends React.PropsWithChildren{
    onBottomReached:() => void;
    className?:string;
};


export default function InfiniteScrollConatiner({
    children,
    onBottomReached,
    className
}:InfiniteScrollConatinerProps){
    const{ref} = useInView({
        rootMargin:'200px',
        onChange(inview){
            if(inview){
                onBottomReached();
            };
        },
    });

    return <div className={className}>
        {children}
        <div ref={ref} />
    </div>
}