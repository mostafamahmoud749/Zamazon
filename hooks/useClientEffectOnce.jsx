"use client"
import { useEffect, useState } from 'react';
import { fetchProducts } from '@/lib/fetchProducts';

export default function useClientEffectOnce(url){
    const [product, setProduct] = useState(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const res = await fetchProducts(url);
                if (!cancelled) setProduct(res);
            } catch {
                if (!cancelled) setProduct(null);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);
    return product
}