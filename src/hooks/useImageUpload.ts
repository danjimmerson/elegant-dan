import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useImageUpload = () => {
    const [uploading, setUploading] = useState(false);

    const uploadImage = async (file: File, bucketStr: string = 'media') => {
        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucketStr)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from(bucketStr).getPublicUrl(filePath);
            return data.publicUrl;
        } catch (error: any) {
            console.error(error);
            toast.error('Error uploading image: ' + error.message);
            return null;
        } finally {
            setUploading(false);
        }
    };

    return { uploadImage, uploading };
};
