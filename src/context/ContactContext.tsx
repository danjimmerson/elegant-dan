import React, { createContext, useContext, useState, ReactNode } from "react";

interface ContactContextType {
    isOpen: boolean;
    openContact: () => void;
    closeContact: () => void;
    toggleContact: () => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openContact = () => setIsOpen(true);
    const closeContact = () => setIsOpen(false);
    const toggleContact = () => setIsOpen((prev) => !prev);

    return (
        <ContactContext.Provider value={{ isOpen, openContact, closeContact, toggleContact }}>
            {children}
        </ContactContext.Provider>
    );
};

export const useContact = () => {
    const context = useContext(ContactContext);
    if (context === undefined) {
        throw new Error("useContact must be used within a ContactProvider");
    }
    return context;
};
