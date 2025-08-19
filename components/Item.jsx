"use client"
import React, { useEffect, useState } from 'react'
import sass from "../app/app.module.sass"
import { Minus, Plus, Trash } from 'lucide-react'

const Item = ({ number, setItems, items, setPrice, setPriceInput, setSaveRupees }) => {
    const [quantity, setQuantity] = useState(1);
    const [rupees, setRupees] = useState(""); 
    const [name, setName] = useState("");

    const total = (parseInt(rupees || 0)) * quantity;

    useEffect(() => {
        setPrice((prev) => {
            const exists = prev.some((e) => e.index === number);
            if (exists) {
                return prev.map((e) =>
                    e.index === number
                        ? { ...e, rupees, quantity, total }
                        : e
                );
            } else {
                return [...prev, { index: number, rupees, quantity, total }];
            }
        });
    }, [number, rupees, quantity]);

    return (
        <tr>
            <td>{number + 1}</td>

            <td>
                <input
                    type="text"
                    placeholder="Name"
                    name="item"
                    value={name}
                    onChange={(e) => {
                        if (e.target.value.trim().length < 40) setName(e.target.value)
                    }}
                />
            </td>

            <td>
                <div className={sass.quantity}>
                    <div
                        className={sass.ibtn}
                        onClick={() => { if (quantity > 1) setQuantity((count) => count - 1) }}
                    >
                        <Minus />
                    </div>
                    <span>{quantity}</span>
                    <input type="hidden" value={quantity} name="quantity" />
                    <div
                        className={sass.ibtn}
                        onClick={() => { if (quantity < 24) setQuantity((count) => count + 1) }}
                    >
                        <Plus />
                    </div>
                </div>
            </td>

            <td>
                <input
                    type="text"
                    placeholder="Rs"
                    name="rs"
                    value={rupees}
                    onChange={(e) => {
                        if (/^[0-9]*$/.test(e.target.value) && e.target.value.length <= 5) {
                            setRupees(e.target.value);
                        }
                    }}
                />
            </td>

            <td>
                <Trash
                    className={sass.delete}
                    onClick={() => {
                        if (items.length === number + 1) {
                            setPriceInput(0);
                            setSaveRupees(0);
                            const copy = [...items];
                            copy.pop();
                            setItems(copy);
                            if (items.length <= 1) {
                                setPrice([]);
                            } else {
                                setPrice((prev) => prev.filter((e) => e.index !== number));
                            }
                        }
                    }}
                />
            </td>
        </tr>
    )
}

export default Item
