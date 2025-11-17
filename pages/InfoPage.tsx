
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { INFO_SECTIONS } from '../constants';

const AccordionItem: React.FC<{ title: string, content: string, isOpen: boolean, onClick: () => void }> = ({ title, content, isOpen, onClick }) => {
    return (
        <div className="border-b">
            <button onClick={onClick} className="w-full text-right p-4 flex justify-between items-center">
                <h3 className="font-bold text-lg">{title}</h3>
                <span>{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
                <div className="p-4 bg-gray-50 prose max-w-none" dangerouslySetInnerHTML={{ __html: content }}>
                </div>
            )}
        </div>
    )
}

export const InfoPage: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    }
  
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">مركز المعلومات</h1>
            <Card className="p-0">
                {INFO_SECTIONS.map((section, index) => (
                    <AccordionItem 
                        key={index}
                        title={section.title}
                        content={section.content}
                        isOpen={openIndex === index}
                        onClick={() => handleToggle(index)}
                    />
                ))}
            </Card>
        </div>
    );
};
