import { cn } from '@/lib/utils';
import { buttonVariants, type ButtonVariantProps } from '@/components/ui/button-variants';

type ButtonProps = React.ComponentProps<'button'> & ButtonVariantProps;

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

type LinkButtonProps = React.ComponentProps<'a'> & ButtonVariantProps;

/** Same visual treatment as `Button`, rendered as an anchor. */
export function LinkButton({ className, variant, size, ...props }: LinkButtonProps) {
  return <a className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
