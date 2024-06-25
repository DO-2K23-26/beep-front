import { ReactNode } from "react";

export interface DynamicSelectorProps {
    title: string;
    elements: { id: string, content: ReactNode }[];
    maxElements: number;
    emptyMessage: string;
    onSelect: (id: string) => void;
}

export function DynamicSelector({
    title,
    elements,
    maxElements,
    emptyMessage,
    onSelect
}: DynamicSelectorProps) {
    return (
        <div className="relative">
            <div className="absolute w-full bottom-2 bg-violet-300 p-4 rounded-xl">
                <p className="font-semibold truncate">{title}</p>
                <div className="h-2"></div>
                { elements.length === 0 ? (
                    <p className="truncate text-center mb-2">{emptyMessage}</p>
                ) : (
                    <div>
                        {elements.slice(0, maxElements).map((element) => (
                            <div key={element.id} className="cursor-pointer hover:bg-violet-200 p-3 rounded-lg" onClick={() => onSelect(element.id)}>
                                {element.content}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}