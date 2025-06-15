
import React from 'react';
import { cn } from '@/lib/utils';
import { Textarea as UiTextarea } from '@/components/ui/textarea';
import { 
    Tooltip as UiTooltip, 
    TooltipContent as UiTooltipContent, 
    TooltipProvider, 
    TooltipTrigger 
} from '@/components/ui/tooltip';

// CONTEXT
interface PromptInputContextType {
  isLoading: boolean;
  value: string;
  setValue: (value: string) => void;
  maxHeight: number | string;
  onSubmit?: () => void;
  disabled?: boolean;
}
const PromptInputContext = React.createContext<PromptInputContextType | undefined>(undefined);

export function usePromptInput() {
  const context = React.useContext(PromptInputContext);
  if (!context) throw new Error('usePromptInput must be used within a PromptInput.Provider');
  return context;
}

// TEXTAREA WRAPPER
interface CustomTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
const Textarea = React.forwardRef<HTMLTextAreaElement, CustomTextareaProps>(({ className, ...props }, ref) => (
    <UiTextarea
      className={cn(
        "flex w-full rounded-md border-none bg-transparent px-3 py-2.5 text-base text-gray-100 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none scrollbar-thin scrollbar-thumb-[#444444] scrollbar-track-transparent hover:scrollbar-thumb-[#555555]",
        className
      )}
      ref={ref}
      rows={1}
      {...props}
    />
  ));
Textarea.displayName = "Textarea";

// MAIN WRAPPER COMPONENT
interface PromptInputProps {
  isLoading?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  maxHeight?: number | string;
  onSubmit?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}
export const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  ({ className, isLoading = false, maxHeight = 240, value, onValueChange, onSubmit, children, disabled = false, onDragOver, onDragLeave, onDrop }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || '');
    const handleChange = (newValue: string) => {
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <TooltipProvider>
        <PromptInputContext.Provider value={{ isLoading, value: value ?? internalValue, setValue: onValueChange ?? handleChange, maxHeight, onSubmit, disabled }}>
          <div ref={ref} className={cn('rounded-3xl border border-[#444444] bg-[#1F2023] p-2 shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300', isLoading && 'border-red-500/70', className)} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
            {children}
          </div>
        </PromptInputContext.Provider>
      </TooltipProvider>
    );
  }
);
PromptInput.displayName = 'PromptInput';

// TEXTAREA COMPONENT FOR PROMPT
interface PromptInputTextareaProps extends React.ComponentProps<typeof Textarea> {
    disableAutosize?: boolean;
}
export const PromptInputTextarea: React.FC<PromptInputTextareaProps> = ({ className, onKeyDown, disableAutosize = false, ...props }) => {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (disableAutosize || !textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height =
      typeof maxHeight === 'number'
        ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`
        : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`;
  }, [value, maxHeight, disableAutosize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
    onKeyDown?.(e);
  };

  return (
    <Textarea ref={textareaRef} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} className={cn('text-base', className)} disabled={disabled} {...props} />
  );
};

// ACTIONS WRAPPER
interface PromptInputActionsProps extends React.HTMLAttributes<HTMLDivElement> {}
export const PromptInputActions: React.FC<PromptInputActionsProps> = ({ children, className, ...props }) => (
  <div className={cn('flex items-center gap-2', className)} {...props}>
    {children}
  </div>
);

// TOOLTIP WRAPPERS
const TooltipContent = React.forwardRef<React.ElementRef<typeof UiTooltipContent>, React.ComponentPropsWithoutRef<typeof UiTooltipContent>>(({ className, ...props }, ref) => (
    <UiTooltipContent
      ref={ref}
      className={cn(
        "z-50 overflow-hidden rounded-md border border-[#333333] bg-[#1F2023] px-3 py-1.5 text-sm text-white shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  ));
TooltipContent.displayName = UiTooltipContent.displayName;

interface PromptInputActionProps extends React.ComponentProps<typeof UiTooltip> {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}
export const PromptInputAction: React.FC<PromptInputActionProps> = ({ tooltip, children, className, side = 'top', ...props }) => {
  const { disabled } = usePromptInput();
  return (
    <UiTooltip {...props}>
      <TooltipTrigger asChild disabled={disabled}>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side} className={className}>
        {tooltip}
      </TooltipContent>
    </UiTooltip>
  );
};
