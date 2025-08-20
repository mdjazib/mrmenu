"use client"
import React, { useEffect, useState } from 'react'
import sass from "../app/app.module.sass"
import { Plus, X } from 'lucide-react'
import { toast } from 'sonner'

const Price = ({ number, setPriceInput, limit, priceInput = { label: "", price: "" } }) => {
    const [label, setLabel] = useState("");
    const [_number, setNumber] = useState("");
    useEffect(() => {
        if (priceInput.label.length) {
            setLabel(priceInput.label);
            setNumber(priceInput.price);
        }
    }, [priceInput]);
    return (
        <div key={number} className={sass.newf}>
            <div className={sass.btn} onClick={() => { setPriceInput(number > 1 ? (prev) => { const copy = [...prev]; copy.splice(number, 1); return copy; } : []) }}><X /></div>
            <input type="text" placeholder='Label' name='label' value={label}
                onInput={(e) => {
                    const value = e.target.value.trim().toUpperCase().slice(0, 1);
                    setLabel(/^[A-Z0-9]$/.test(value) ? value : "");
                }}
                autoComplete='off' />
            <input type="text" placeholder='Price' style={{ maxWidth: "100%" }} name='price' autoComplete='off' value={_number}
                onInput={(e) => {
                    const value = e.target.value.trim().slice(0, 6);
                    setNumber(/^[0-9]*$/.test(value) ? value : "");
                }}
            />
            <div className={sass.btn} onClick={
                limit < 4 ? () => { setPriceInput((prev) => [...prev, ""]) } : (e) => { e.preventDefault(); toast.error("Maximum price tags can be 4.") }
            }><Plus /></div>
        </div>
    )
}

export default Price